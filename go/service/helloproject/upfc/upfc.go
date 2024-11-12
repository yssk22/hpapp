package upfc

import (
	"context"
	"fmt"
	"time"

	"github.com/spf13/cobra"
	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/cli"
	"github.com/yssk22/hpapp/go/foundation/slice"
	"github.com/yssk22/hpapp/go/foundation/stringutil"
	"github.com/yssk22/hpapp/go/foundation/timeutil"
	"github.com/yssk22/hpapp/go/service/auth"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/bootstrap/config"
	"github.com/yssk22/hpapp/go/service/bootstrap/http/middleware"
	"github.com/yssk22/hpapp/go/service/bootstrap/http/task"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/hpfceventticket"
	"github.com/yssk22/hpapp/go/service/ent/predicate"
	"github.com/yssk22/hpapp/go/service/ent/user"
	"github.com/yssk22/hpapp/go/service/ent/usernotificationsetting"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/errors"
	"github.com/yssk22/hpapp/go/service/push"
	"github.com/yssk22/hpapp/go/service/schema/enums"
	"github.com/yssk22/hpapp/go/service/schema/jsonfields"
	"github.com/yssk22/hpapp/go/system/clock"
	"github.com/yssk22/hpapp/go/system/slog"
)

type upfcService struct {
}

func NewService() config.Service {
	return &upfcService{}
}

func (*upfcService) Middleware() []middleware.HttpMiddleware {
	return nil
}

func (s *upfcService) Tasks() []task.Task {
	return []task.Task{
		s.SendPaymentStartNotificationTask(),
		s.SendPaymentDueNotificationTask(),
	}
}

func (s *upfcService) Command() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "upfc",
		Short: "operate upfc events",
	}
	sim := &cobra.Command{
		Use:   "simulate-payment-notifications",
		Short: "simulate the payment notifications",
		Args:  cobra.MinimumNArgs(0),
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()
			date := timeutil.JSTDate(clock.Now(ctx))
			query := paymentStartQuery
			dateStr := assert.X(cmd.Flags().GetString("date"))
			queryStr := assert.X(cmd.Flags().GetString("query"))
			n := assert.X(cmd.Flags().GetInt("ndays"))
			if dateStr != "" {
				date = assert.X(time.Parse("2006-01-02", dateStr))
				date = time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, timeutil.JST)
			}
			if queryStr != "" {
				query = queryType(queryStr)
			}
			notifs, err := s.buildNotifications(ctx, date, n, query)
			if err != nil {
				return err
			}
			fmt.Println("Conditions:", "date -", date, n, "days", query, "query")
			fmt.Println("------------------------------------------------------")
			if len(notifs) == 0 {
				fmt.Println("no notificatino sent")
			}
			w := cli.NewTableWriter([]string{"Key", "# of Receivers", "Title", "Trigger"})
			for _, n := range notifs {
				w.WriteRow([]string{
					n.Key(),
					fmt.Sprintf("%d", len(assert.X(n.Receivers(ctx)))),
					assert.X(n.Message(ctx)).PushMessage.Title,
					assert.X(n.Trigger(ctx)),
				})
			}
			w.Flush()
			return nil
		},
	}
	sim.Flags().StringP("date", "d", "", "date to simulate")
	sim.Flags().StringP("query", "q", "payment_start", "payment_start or payment_due")
	sim.Flags().IntP("ndays", "n", 1, "# of days to cover notification")
	cmd.AddCommand(sim)
	return cmd
}

func (s *upfcService) SendPaymentStartNotificationTask() *task.TaskSpec[any] {
	return task.NewTask[any](
		"/helloproject/upfc/send-payment-start-notification",
		&task.JSONParameter[any]{},
		s.sendPaymentStartNotificationFunc,
		auth.AllowAdmins[any](),
	)
}

func (s *upfcService) sendPaymentStartNotificationFunc(ctx context.Context, _ any) error {
	_, err := slog.Track(ctx, "service.helloproject.upfc.SendPaymentStartNotificationTask", func(log slog.Attributes) (any, error) {
		notifs, err := s.buildNotifications(ctx, clock.ContextTime(ctx), 1, paymentStartQuery)
		if err != nil {
			return nil, err
		}
		return slice.Map(notifs, func(i int, n push.Notification) (any, error) {
			return push.Deliver(ctx, n)
		})
	})
	return err
}

func (s *upfcService) SendPaymentDueNotificationTask() *task.TaskSpec[any] {
	return task.NewTask[any](
		"/helloproject/upfc/send-payment-due-notification",
		&task.JSONParameter[any]{},
		s.sendPaymentDueNotificationFunc,
		auth.AllowAdmins[any](),
	)
}

func (s *upfcService) sendPaymentDueNotificationFunc(ctx context.Context, _ any) error {
	_, err := slog.Track(ctx, "service.helloproject.upfc.SendPaymentDueNotificationTask", func(log slog.Attributes) (any, error) {
		notifs, err := s.buildNotifications(ctx, clock.ContextTime(ctx), 3, paymentDueQuery)
		if err != nil {
			return nil, err
		}
		return slice.Map(notifs, func(i int, n push.Notification) (any, error) {
			return push.Deliver(ctx, n)
		})
	})
	return err
}

func (s *upfcService) buildNotifications(ctx context.Context, date time.Time, ndays int, qtype queryType) ([]push.Notification, error) {
	if !appuser.CurrentUser(ctx).IsAdmin(ctx) {
		// the logic building notifications would not work for non admin users because of entpolicy so early return here.
		return nil, fmt.Errorf("not an admin")
	}

	query, err := s.queryEventTickets(ctx, date, ndays, qtype)
	if err != nil {
		return nil, err
	}
	var notifPredicate predicate.UserNotificationSetting
	switch qtype {
	case paymentStartQuery:
		notifPredicate = usernotificationsetting.EnablePaymentStart(true)
	case paymentDueQuery:
		notifPredicate = usernotificationsetting.EnablePaymentDue(true)
	}
	userPredicate := user.HasNotificationSettingsWith(notifPredicate)
	tickets, err := query.
		WithUser(func(userQuery *ent.UserQuery) {
			userQuery.Where(userPredicate).
				WithNotificationSettings(func(notifQuery *ent.UserNotificationSettingQuery) {
					notifQuery.Where(notifPredicate)
				})
		}).
		Where(hpfceventticket.HasUserWith(userPredicate)).
		Order(ent.Asc(hpfceventticket.FieldCreatedAt)).
		All(ctx)
	if err != nil {
		return nil, errors.Wrap(ctx, err)
	}
	// Group by ticket application title
	// TODO: replace ApplicationTitle with ApplicationID
	var groups = make(map[string][]*ent.HPFCEventTicket)
	for _, t := range tickets {
		if _, ok := groups[t.ApplicationTitle]; !ok {
			groups[t.ApplicationTitle] = []*ent.HPFCEventTicket{}
		}
		groups[t.ApplicationTitle] = append(groups[t.ApplicationTitle], t)
	}
	var notifications []push.Notification
	for _, tickets = range groups {
		notifications = append(notifications, s.buildNotificationFromTickets(tickets, date, qtype))
	}
	return notifications, nil
}

type queryType string

const (
	paymentStartQuery queryType = "payment_start"
	paymentDueQuery   queryType = "payment_due"
)

func (s *upfcService) queryEventTickets(ctx context.Context, date time.Time, ndays int, qtype queryType) (*ent.HPFCEventTicketQuery, error) {
	entclient := entutil.NewClient(ctx)
	jstDate := timeutil.JSTDate(date)
	jstNextDate := jstDate.Add(time.Duration(ndays) * 24 * time.Hour)
	query := entclient.HPFCEventTicket.Query().Where(
		hpfceventticket.StatusNotIn(
			enums.HPFCEventTicketApplicationStatusCompleted,
			enums.HPFCEventTicketApplicationStatusRejected,
		),
	)
	switch qtype {
	case paymentStartQuery:
		query = query.Where(
			hpfceventticket.PaymentStartDateGTE(jstDate.UTC()),
			hpfceventticket.PaymentStartDateLT(jstNextDate.UTC()),
		)
	case paymentDueQuery:
		query = query.Where(
			hpfceventticket.PaymentDueDateGTE(jstDate.UTC()),
			hpfceventticket.PaymentDueDateLT(jstNextDate.UTC()),
		)
	default:
		return nil, fmt.Errorf("invalid query type: %q", qtype)
	}
	return query, nil
}

func (s *upfcService) buildNotificationFromTickets(tickets []*ent.HPFCEventTicket, date time.Time, qtype queryType) push.Notification {
	var users []*ent.UserNotificationSetting
	for _, t := range tickets {
		users = append(users, t.Edges.User.Edges.NotificationSettings...)
	}
	users = slice.Unique(users, func(i int, v *ent.UserNotificationSetting) string {
		return fmt.Sprintf("%d", v.ID)
	})
	switch qtype {
	case paymentStartQuery:
		return &paymentStartNotification{
			applicationTitle: tickets[0].ApplicationTitle,
			startDate:        timeutil.JSTDate(*tickets[0].PaymentStartDate),
			sendDate:         timeutil.JSTDate(date),
			users:            users,
		}
	case paymentDueQuery:
		return &paymentDueNotification{
			applicationTitle: tickets[0].ApplicationTitle,
			dueDate:          timeutil.JSTDate(*tickets[0].PaymentDueDate),
			sendDate:         timeutil.JSTDate(date),
			users:            users,
		}
	}
	panic(fmt.Errorf("unknown query type: %q", qtype))
}

type paymentStartNotification struct {
	applicationTitle string
	startDate        time.Time
	sendDate         time.Time
	users            []*ent.UserNotificationSetting
}

func (pn *paymentStartNotification) Key() string {
	return "helloproject.upfc.notificaiton.payment_start"
}

func (pn *paymentStartNotification) Trigger(ctx context.Context) (string, error) {
	return fmt.Sprintf(
		"send: %s, start: %s - %s",
		stringutil.UTF8Slice(pn.applicationTitle, 80),
		pn.sendDate.Format("2006-01-02"),
		pn.startDate.Format("2006-01-02"),
	), nil
}

func (pn *paymentStartNotification) Receivers(ctx context.Context) ([]*ent.UserNotificationSetting, error) {
	return pn.users, nil
}

func (pn *paymentStartNotification) Message(ctx context.Context) (*jsonfields.ReactNavigationPush, error) {
	title := "当落が発表されています。"
	body := fmt.Sprintf("【%s】の当落を確認しましょう。", stringutil.UTF8Slice(pn.applicationTitle, 80))
	return &jsonfields.ReactNavigationPush{
		PushMessage: jsonfields.ExpoPushMessage{
			Title: title,
			Body:  body,
		},
		Path: "/",
	}, nil
}

func (pn *paymentStartNotification) ExpectedDeliveryTime(ctx context.Context) (time.Time, error) {
	return clock.Now(ctx), nil
}

type paymentDueNotification struct {
	applicationTitle string
	dueDate          time.Time
	sendDate         time.Time
	users            []*ent.UserNotificationSetting
}

func (pn *paymentDueNotification) Key() string {
	return "helloproject.upfc.notificaiton.payment_due"
}

func (pn *paymentDueNotification) Trigger(ctx context.Context) (string, error) {
	return fmt.Sprintf(
		"send: %s, due: %s - %s",
		pn.sendDate.Format("2006-01-02"),
		pn.dueDate.Format("2006-01-02"),
		stringutil.UTF8Slice(pn.applicationTitle, 80),
	), nil
}

func (pn *paymentDueNotification) Receivers(ctx context.Context) ([]*ent.UserNotificationSetting, error) {
	return pn.users, nil
}

func (pn *paymentDueNotification) Message(ctx context.Context) (*jsonfields.ReactNavigationPush, error) {
	var title string
	numDays := int(pn.dueDate.Sub(pn.sendDate).Hours() / 24)
	if numDays == 0 {
		title = "【本日締切】入金期限が近づいています！！！"
	} else {
		title = fmt.Sprintf("【あと%d日】入金期限が近づいています！！！", numDays)
	}
	body := fmt.Sprintf("【%s】が未入金です。急いで入金してください。", stringutil.UTF8Slice(pn.applicationTitle, 80))
	return &jsonfields.ReactNavigationPush{
		PushMessage: jsonfields.ExpoPushMessage{
			Title: title,
			Body:  body,
		},
		Path: "/",
	}, nil
}

func (pn *paymentDueNotification) ExpectedDeliveryTime(ctx context.Context) (time.Time, error) {
	return clock.Now(ctx), nil
}
