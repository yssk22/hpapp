package push

import (
	"context"
	"fmt"
	"time"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/slice"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/schema/enums"
	"github.com/yssk22/hpapp/go/service/schema/jsonfields"
	"github.com/yssk22/hpapp/go/system/clock"
	"github.com/yssk22/hpapp/go/system/push"
	"github.com/yssk22/hpapp/go/system/settings"
	"github.com/yssk22/hpapp/go/system/slog"
)

var (
	// KillNotification kills all the notifications
	KillNotification = settings.NewBool("service.push.kill_notification", false)
	// KillNotificationLogByKeys kills the notifications by the specific keys.
	KillNotificationByKeys = settings.NewStringArray("service.push.kill_notification_by_keys", []string{})
	// TestTokens is a comma seperated list of Expo tokens to send test notifications.
	TestTokens = settings.NewStringArray("service.push.test_tokens", []string{})

	// DeliveryDelayThresholdHours is a threshold to send a notification. The clock.Now(ctx) is compared with ExpectedDeliveryTime and if the diff exceeds this threshold,
	// then the notification is not sent.
	DeliveryDelayThresholdHours = settings.NewInt("service.push.delivery_delay_threshold_hours", 6)
)

// errors
var (
	ErrNoReceivers                 = fmt.Errorf("no receivers to send a notification")
	ErrDuplicateNotification       = fmt.Errorf("duplicate notification")
	ErrExceedDeliveryTimeThreshold = fmt.Errorf("time to deliver exceeded with the threshold")
	ErrKilledNotificationGlobally  = fmt.Errorf("notification is killed globally")
	ErrKilledNotification          = fmt.Errorf("notification is killed")
)

type option struct {
	TestOnly bool
}

type DeliveryOption func(*option)

func TestOnly(value bool) DeliveryOption {
	return func(o *option) {
		o.TestOnly = value
	}
}

type Notification interface {
	Key() string
	Trigger(context.Context) (string, error)
	Receivers(context.Context) ([]*ent.UserNotificationSetting, error)
	Message(context.Context) (*jsonfields.ReactNavigationPush, error)
	ExpectedDeliveryTime(context.Context) (time.Time, error)
}

// Deliver creates a UserNotificationLog record as 'prepared' status
func Deliver(ctx context.Context, notif Notification, options ...DeliveryOption) (*ent.UserNotificationLog, error) {
	o := option{}
	for _, opt := range options {
		opt(&o)
	}
	key := notif.Key()
	trigger, err := notif.Trigger(ctx)
	if err != nil {
		return nil, err
	}
	receivers, err := notif.Receivers(ctx)
	if err != nil {
		return nil, err
	}
	message, err := notif.Message(ctx)
	if err != nil {
		return nil, err
	}
	expectedTime, err := notif.ExpectedDeliveryTime(ctx)
	if err != nil {
		return nil, err
	}
	if len(receivers) == 0 {
		return nil, ErrNoReceivers
	}

	entclient := entutil.NewClient(ctx)
	record, err := entclient.UserNotificationLog.Create().
		SetKey(key).
		SetTrigger(trigger).
		SetReactNavigationMessage(*message).
		SetIsTest(o.TestOnly).
		SetStatus(enums.UserNotificationStatusPrepared).
		SetExpectedDeliveryTime(expectedTime).
		AddReceivers(receivers...).
		Save(ctx)
	if err != nil {
		if ent.IsConstraintError(err) {
			return nil, ErrDuplicateNotification
		}
		return nil, err
	}
	messages, err := buildPushMessage(ctx, record)
	var status enums.UserNotificationStatus
	var statusMsg string
	if err != nil {
		status = enums.UserNotificationStatusError
		statusMsg = err.Error()
	} else {
		_, err := slice.Map(messages, func(i int, msg *push.Message) (any, error) {
			return push.Send(ctx, msg)
		})
		if err != nil {
			status = enums.UserNotificationStatusError
			statusMsg = err.Error()
		} else {
			status = enums.UserNotificationStatusSent
			statusMsg = ""
		}
	}
	updated, updateError := record.Update().SetStatus(status).SetStatusMessage(statusMsg).Save(ctx)
	if updateError != nil {
		slog.Critical(ctx, "failed to update notification status even the notification has been sent",
			slog.Name("service.push.notification.Deliver"),
			slog.A("key", record.Key),
			slog.A("trigger", record.Trigger),
			slog.A("expected_status", status),
			slog.A("expected_status_message", statusMsg),
		)
	}
	return updated, err
}

func buildPushMessage(ctx context.Context, r *ent.UserNotificationLog) ([]*push.Message, error) {
	err := checkIfNotificationShouldBeDelivered(ctx, r)
	if err != nil {
		return nil, err
	}
	tokenSets, err := getTokenSets(ctx, r)
	if err != nil {
		return nil, err
	}
	return slice.Map(tokenSets, func(i int, tokens []string) (*push.Message, error) {
		return r.ReactNavigationMessage.ToPushMessage(tokens), nil
	})
}

func checkIfNotificationShouldBeDelivered(ctx context.Context, r *ent.UserNotificationLog) error {
	// test record is always allowed even kill switch is on since we want to test the notification in production
	if r.IsTest {
		return nil
	}
	// global kill switch
	killed := settings.GetX(ctx, KillNotification)
	if killed {
		return ErrKilledNotificationGlobally
	}
	killedByKeys := settings.GetX(ctx, KillNotificationByKeys)
	for _, k := range killedByKeys {
		if r.Key == k {
			return ErrKilledNotification
		}
	}
	if !r.ExpectedDeliveryTime.IsZero() {
		thresholdHours := time.Duration(settings.GetX(ctx, DeliveryDelayThresholdHours))
		shouldBeDeliveredBy := r.ExpectedDeliveryTime.Add(thresholdHours * time.Hour)
		now := clock.Now(ctx)
		if now.After(shouldBeDeliveredBy) {
			return ErrExceedDeliveryTimeThreshold
		}
	}
	return nil
}

func getTokenSets(ctx context.Context, r *ent.UserNotificationLog) ([][]string, error) {
	var err error
	receivers := r.Edges.Receivers
	if len(receivers) == 0 {
		receivers, err = r.QueryReceivers().All(ctx)
		if err != nil {
			return nil, err
		}
	}
	if r.IsTest {
		// If test flag is on, then we restrict receivers who have a token that matches with one of test tokens.
		origReceivers := len(receivers)
		testTokens := settings.GetX(ctx, TestTokens)
		receivers = assert.X(slice.Filter(receivers, func(i int, settings *ent.UserNotificationSetting) (bool, error) {
			for _, token := range testTokens {
				if settings.Token == token {
					return true, nil
				}
			}
			return false, nil
		}))
		restrictedReceivers := len(receivers)
		slog.Warning(ctx, "trying to send a test notification so restrict receivers defined in service.push.test-tokens",
			slog.Name("service.push.Deliver"),
			slog.Attribute("record_id", r.ID),
			slog.Attribute("num_original_receivers", origReceivers),
			slog.Attribute("num_restricted_receivers", restrictedReceivers),
		)
	}
	if len(receivers) == 0 {
		return nil, ErrNoReceivers
	}
	// group by slug since we cannot send multipe slugs in one request
	var slugToTokens = make(map[string][]string)
	for _, rcv := range receivers {
		if _, ok := slugToTokens[rcv.Slug]; !ok {
			slugToTokens[rcv.Slug] = make([]string, 0)
		}
		slugToTokens[rcv.Slug] = append(slugToTokens[rcv.Slug], rcv.Token)
	}
	var tokenSets [][]string
	for _, t := range slugToTokens {
		tokenSets = append(tokenSets, t)
	}
	return tokenSets, nil
}
