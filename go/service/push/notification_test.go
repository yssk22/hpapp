package push

import (
	"context"
	"testing"
	"time"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/object"
	"github.com/yssk22/hpapp/go/foundation/timeutil"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/bootstrap/test"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/usernotificationlog"
	"github.com/yssk22/hpapp/go/service/schema/enums"
	"github.com/yssk22/hpapp/go/service/schema/jsonfields"
	"github.com/yssk22/hpapp/go/system/clock"
	"github.com/yssk22/hpapp/go/system/push"
	"github.com/yssk22/hpapp/go/system/settings"
)

type testNotification struct {
	key                  string
	trigger              string
	receivers            []*ent.UserNotificationSetting
	message              *jsonfields.ReactNavigationPush
	expectedDeliveryTime time.Time
}

func (sn *testNotification) Key() string {
	return sn.key
}

func (sn *testNotification) Trigger(context.Context) (string, error) {
	return sn.trigger, nil
}
func (sn *testNotification) Receivers(context.Context) ([]*ent.UserNotificationSetting, error) {
	return sn.receivers, nil
}
func (sn *testNotification) Message(context.Context) (*jsonfields.ReactNavigationPush, error) {
	return sn.message, nil
}
func (sn *testNotification) ExpectedDeliveryTime(context.Context) (time.Time, error) {
	return sn.expectedDeliveryTime, nil
}

func TestNotification(t *testing.T) {
	test.New(
		"Avoid duplicate notification",
		test.WithHPMaster(),
		test.WithUser(),
	).Run(t, func(ctx context.Context, tt *testing.T) {
		a := assert.NewTestAssert(tt)

		// notification settings
		follower1 := appuser.CurrentUser(ctx)
		settings := assert.X(UpsertNotificationSettings(
			ctx,
			appuser.EntID(follower1), "ExponentPushToken[follower1-token]", NotificationSettings{EnableNewPosts: object.NullableTrue}),
		)
		message := &jsonfields.ReactNavigationPush{
			PushMessage: jsonfields.ExpoPushMessage{
				Title: "test-title",
				Body:  "test-body",
			},
			Path: "/test/",
			Params: map[string]interface{}{
				"foo": map[string]interface{}{
					"bar": 1,
				},
			},
		}
		_, err := Deliver(ctx, &testNotification{
			key:       "notify",
			trigger:   "trigger",
			receivers: []*ent.UserNotificationSetting{settings},
			message:   message,
		})
		a.Nil(err)
		messages := push.GetMockSentMessages(ctx)
		a.Equals(1, len(messages))
		a.Equals(message.PushMessage.Title, messages[0].Title)
		a.Equals(message.PushMessage.Body, messages[0].Body)
		a.Equals(`{"params":{"foo":{"bar":1}},"path":"/test/"}`, messages[0].Data["payload"])

		// same pair of key and trigger -> should be rejected.
		_, err = Deliver(ctx, &testNotification{
			key:       "notify",
			trigger:   "trigger",
			receivers: []*ent.UserNotificationSetting{settings},
			message:   message,
		})
		a.NotNil(err)
		a.Equals(ErrDuplicateNotification, err)
		messages = push.GetMockSentMessages(ctx)
		a.Equals(1, len(messages))

		// if trigger is changed, it should be fine to deliver.
		message.PushMessage.Title = "updated_title"
		_, err = Deliver(ctx, &testNotification{
			key:       "notify",
			trigger:   "trigger2",
			receivers: []*ent.UserNotificationSetting{settings},
			message:   message,
		})
		a.Nil(err)
		messages = push.GetMockSentMessages(ctx)
		a.Equals(2, len(messages))
		a.Equals(message.PushMessage.Title, messages[1].Title)

		logs := settings.QueryNotificationLogs().Order(ent.Asc(usernotificationlog.FieldCreatedAt)).AllX(ctx)
		a.Equals(2, len(logs))
		a.Equals("notify", logs[0].Key)
		a.Equals("trigger", logs[0].Trigger)
		a.Equals(enums.UserNotificationStatusSent, logs[0].Status)

		a.Equals("notify", logs[1].Key)
		a.Equals("trigger2", logs[1].Trigger)
		a.Equals(enums.UserNotificationStatusSent, logs[1].Status)
	})

	test.New(
		"ErrExceedDeliveryTimeThreshold",
		test.WithHPMaster(),
		test.WithUser(),
		test.WithNow(time.Date(2022, 10, 18, 22, 30, 0, 0, timeutil.JST)),
	).Run(t, func(ctx context.Context, tt *testing.T) {
		a := assert.NewTestAssert(tt)
		timestamp := clock.Now(ctx)
		// notification settings
		follower1 := appuser.CurrentUser(ctx)
		settings := assert.X(UpsertNotificationSettings(ctx, appuser.EntID(follower1), "ExponentPushToken[follower1-token]", NotificationSettings{EnableNewPosts: object.NullableTrue}))
		message := &jsonfields.ReactNavigationPush{
			PushMessage: jsonfields.ExpoPushMessage{
				Title: "test-title",
				Body:  "test-body",
			},
			Path: "/test/",
			Params: map[string]interface{}{
				"foo": map[string]interface{}{
					"bar": 1,
				},
			},
		}
		nlog, err := Deliver(ctx, &testNotification{
			key:                  "notify",
			trigger:              "trigger",
			receivers:            []*ent.UserNotificationSetting{settings},
			message:              message,
			expectedDeliveryTime: timestamp.Add(-1 * (6*time.Hour + 1*time.Second)),
		})
		a.Equals(ErrExceedDeliveryTimeThreshold, err)
		a.Equals("notify", nlog.Key)
		a.Equals("trigger", nlog.Trigger)
		a.Equals(enums.UserNotificationStatusError, nlog.Status)
		a.Equals(ErrExceedDeliveryTimeThreshold.Error(), nlog.StatusMessage)
		messages := push.GetMockSentMessages(ctx)
		a.Equals(0, len(messages))

		nlog, err = Deliver(ctx, &testNotification{
			key:                  "notify",
			trigger:              "trigger2",
			receivers:            []*ent.UserNotificationSetting{settings},
			message:              message,
			expectedDeliveryTime: timestamp.Add(-1 * (time.Hour * 6)),
		})
		a.Nil(err)
		a.Equals("notify", nlog.Key)
		a.Equals("trigger2", nlog.Trigger)
		a.Equals(enums.UserNotificationStatusSent, nlog.Status)
		messages = push.GetMockSentMessages(ctx)
		a.Equals(1, len(messages))
	})

	test.New(
		"TestOnly",
		test.WithHPMaster(),
		test.WithUser(),
	).Run(t, func(ctx context.Context, tt *testing.T) {
		a := assert.NewTestAssert(tt)

		// notification settings
		follower1 := appuser.CurrentUser(ctx)
		notifs := assert.X(UpsertNotificationSettings(ctx, appuser.EntID(follower1), "ExponentPushToken[follower1-token]", NotificationSettings{EnableNewPosts: object.NullableTrue}))
		message := &jsonfields.ReactNavigationPush{
			PushMessage: jsonfields.ExpoPushMessage{
				Title: "test-title",
				Body:  "test-body",
			},
			Path: "/test/",
			Params: map[string]interface{}{
				"foo": map[string]interface{}{
					"bar": 1,
				},
			},
		}
		a.Nil(settings.Set(ctx, TestTokens, []string{"foo"}))
		_, err := Deliver(ctx, &testNotification{
			key:       "notify",
			trigger:   "trigger",
			receivers: []*ent.UserNotificationSetting{notifs},
			message:   message,
		}, TestOnly(true))
		a.NotNil(err)
		a.Equals(ErrNoReceivers, err)

		// update settings
		a.Nil(settings.Set(ctx, TestTokens, []string{"ExponentPushToken[follower1-token]"}))
		_, err = Deliver(ctx, &testNotification{
			key:       "notify",
			trigger:   "trigger2",
			receivers: []*ent.UserNotificationSetting{notifs},
			message:   message,
		}, TestOnly(true))
		a.Nil(err)
	})

	test.New(
		"Killswitch",
		test.WithHPMaster(),
		test.WithUser(),
	).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		a.Nil(settings.Set(ctx, KillNotification, true))

		follower1 := appuser.CurrentUser(ctx)
		notifs := assert.X(UpsertNotificationSettings(ctx, appuser.EntID(follower1), "ExponentPushToken[follower1-token]", NotificationSettings{EnableNewPosts: object.NullableTrue}))
		message := &jsonfields.ReactNavigationPush{
			PushMessage: jsonfields.ExpoPushMessage{
				Title: "test-title",
				Body:  "test-body",
			},
			Path: "/test/",
			Params: map[string]interface{}{
				"foo": map[string]interface{}{
					"bar": 1,
				},
			},
		}

		nlog, err := Deliver(ctx, &testNotification{
			key:       "notify",
			trigger:   "trigger",
			receivers: []*ent.UserNotificationSetting{notifs},
			message:   message,
		})
		a.Equals(ErrKilledNotificationGlobally, err)
		a.Equals("notify", nlog.Key)
		a.Equals("trigger", nlog.Trigger)
		a.Equals(enums.UserNotificationStatusError, nlog.Status)
		a.Equals(`notification is killed globally`, nlog.StatusMessage)
		messages := push.GetMockSentMessages(ctx)
		a.Equals(0, len(messages))

		t.Log("FOO")
		a.Nil(settings.Set(ctx, KillNotification, false))
		t.Log(settings.GetX(ctx, KillNotification))
		nlog, err = Deliver(ctx, &testNotification{
			key:       "notify",
			trigger:   "trigger2",
			receivers: []*ent.UserNotificationSetting{notifs},
			message:   message,
		})
		a.Nil(err)
		a.Equals("notify", nlog.Key)
		a.Equals("trigger2", nlog.Trigger)
		a.Equals(enums.UserNotificationStatusSent, nlog.Status)
		messages = push.GetMockSentMessages(ctx)
		a.Equals(1, len(messages))
	})
}
