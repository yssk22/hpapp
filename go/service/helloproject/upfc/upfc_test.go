package upfc

import (
	"context"
	"testing"
	"time"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/object"
	"github.com/yssk22/hpapp/go/foundation/slice"
	"github.com/yssk22/hpapp/go/foundation/timeutil"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/bootstrap/test"
	"github.com/yssk22/hpapp/go/service/push"
	"github.com/yssk22/hpapp/go/service/schema/enums"
	"github.com/yssk22/hpapp/go/system/clock"
)

func TestUPFC(t *testing.T) {
	test.New(
		"NotificationTasks",
		test.WithHPMaster(),
	).Run(t, func(ctx context.Context, t *testing.T) {
		s := NewService().(*upfcService)

		user1 := test.MakeTestUser(ctx) // get both
		user2 := test.MakeTestUser(ctx) // get payent start, not get payment due
		user3 := test.MakeTestUser(ctx) // not get payment start, get payment due
		user4 := test.MakeTestUser(ctx) // get both (but don't have any tickets)

		assert.X(push.UpsertNotificationSettings(appuser.WithUser(ctx, user1), appuser.EntID(user1), "ExponentPushToken[user1token]", push.NotificationSettings{
			EnablePaymentStart: object.NullableTrue,
			EnablePaymentDue:   object.NullableTrue,
		}))
		assert.X(push.UpsertNotificationSettings(appuser.WithUser(ctx, user2), appuser.EntID(user2), "ExponentPushToken[user2token]", push.NotificationSettings{
			EnablePaymentStart: object.NullableTrue,
			EnablePaymentDue:   object.NullableFalse,
		}))
		assert.X(push.UpsertNotificationSettings(appuser.WithUser(ctx, user3), appuser.EntID(user3), "ExponentPushToken[user3token]", push.NotificationSettings{
			EnablePaymentStart: object.NullableFalse,
			EnablePaymentDue:   object.NullableTrue,
		}))
		assert.X(push.UpsertNotificationSettings(appuser.WithUser(ctx, user4), appuser.EntID(user4), "ExponentPushToken[user4token]", push.NotificationSettings{
			EnablePaymentStart: object.NullableTrue,
			EnablePaymentDue:   object.NullableTrue,
		}))

		startAt := clock.Now(ctx)
		event1 := assert.X(upsertEvent(ctx, "モーニング娘。'21 コンサートツアー秋", "神奈川県 横浜アリーナ", startAt, nil))
		event2 := assert.X(upsertEvent(ctx, "モーニング娘。'21 コンサートツアー秋", "神奈川県 横浜アリーナ", startAt.Add(3*time.Hour), nil))

		t.Run("Payment Start", func(t *testing.T) {
			a := assert.NewTestAssert(t)
			paymentStartDate := time.Date(2021, time.October, 2, 0, 0, 0, 0, timeutil.JST)
			paymentDueDate := time.Date(2021, time.October, 5, 0, 0, 0, 0, timeutil.JST)
			// user1 has a pending payment ticket for event1 and event2
			assert.X(upsertFCEventTicket(appuser.WithUser(ctx, user1), upsertFCEventTicketParams{
				EventId:          event1.ID,
				UserId:           appuser.EntID(user1),
				MemberSha256:     "fcmemberid",
				ApplicationSite:  enums.HPFCEventTicketApplicationSiteHelloProject,
				ApplicationTitle: "モーニング娘。'21 コンサートツアー秋",
				ApplicationID:    object.Nullable("mm21-1"),
				Num:              2,
				PaymentStartDate: &paymentStartDate,
				PaymentDueDate:   &paymentDueDate,
				Status:           enums.HPFCEventTicketApplicationStatusPendingPayment,
			}))
			assert.X(upsertFCEventTicket(appuser.WithUser(ctx, user1), upsertFCEventTicketParams{
				EventId:          event2.ID,
				UserId:           appuser.EntID(user1),
				MemberSha256:     "fcmemberid",
				ApplicationSite:  enums.HPFCEventTicketApplicationSiteHelloProject,
				ApplicationTitle: "モーニング娘。'21 コンサートツアー秋",
				ApplicationID:    object.Nullable("mm21-2"),
				Num:              2,
				PaymentStartDate: &paymentStartDate,
				PaymentDueDate:   &paymentDueDate,
				Status:           enums.HPFCEventTicketApplicationStatusPendingPayment,
			}))
			// user2 have tickets for event1 and event2
			assert.X(upsertFCEventTicket(appuser.WithUser(ctx, user2), upsertFCEventTicketParams{
				EventId:          event1.ID,
				UserId:           appuser.EntID(user2),
				MemberSha256:     "fcmemberid2",
				ApplicationSite:  enums.HPFCEventTicketApplicationSiteHelloProject,
				ApplicationTitle: "モーニング娘。'21 コンサートツアー秋",
				ApplicationID:    object.Nullable("mm21-1"),
				Num:              2,
				PaymentStartDate: &paymentStartDate,
				PaymentDueDate:   &paymentDueDate,
				Status:           enums.HPFCEventTicketApplicationStatusPendingPayment,
			}))
			assert.X(upsertFCEventTicket(appuser.WithUser(ctx, user2), upsertFCEventTicketParams{
				EventId:          event2.ID,
				UserId:           appuser.EntID(user2),
				MemberSha256:     "fcmemberid2",
				ApplicationSite:  enums.HPFCEventTicketApplicationSiteHelloProject,
				ApplicationTitle: "モーニング娘。'21 コンサートツアー秋 先々行",
				ApplicationID:    object.Nullable("mm21-2"),
				Num:              2,
				PaymentStartDate: &paymentStartDate,
				PaymentDueDate:   &paymentDueDate,
				Status:           enums.HPFCEventTicketApplicationStatusPendingPayment,
			}))
			// user3 has only one ticket for event1
			assert.X(upsertFCEventTicket(appuser.WithUser(ctx, user3), upsertFCEventTicketParams{
				EventId:          event1.ID,
				UserId:           appuser.EntID(user3),
				MemberSha256:     "fcmemberid3",
				ApplicationSite:  enums.HPFCEventTicketApplicationSiteHelloProject,
				ApplicationTitle: "モーニング娘。'21 コンサートツアー秋",
				ApplicationID:    object.Nullable("mm21-1"),
				Num:              2,
				PaymentStartDate: &paymentStartDate,
				PaymentDueDate:   &paymentDueDate,
				Status:           enums.HPFCEventTicketApplicationStatusPendingPayment,
			}))
			/*
				All applications start payment at 2021/10/02 JST.
					- user1 has two events (event1, and event2) with the same application title.
					- user2 has two events, but the application for event1 is the normal application while one for event2 is '先々行'
					- user3 has only one event (event1), optout for payment start notif
			*/
			//
			// @ before 10/2 or after 10/2
			// we set ndays = 1 so the notification should be sent at 10/02 only
			//
			// for _, sendDate := range []time.Time{
			// 	time.Date(2021, time.October, 1, 16, 0, 0, 0, timeutil.JST), // too early
			// 	time.Date(2021, time.October, 3, 16, 0, 0, 0, timeutil.JST), // too late
			// } {
			// 	notifications, _ := s.buildNotifications(appuser.WithAdmin(ctx), sendDate, 1, paymentStartQuery)
			// 	a.Equals(0, len(notifications))
			// }
			//
			// @ 10/02 16:00
			//
			sendDate := time.Date(2021, time.October, 2, 16, 0, 0, 0, timeutil.JST)
			notifications, _ := s.buildNotifications(appuser.WithAdmin(ctx), sendDate, 1, paymentStartQuery)
			// should be for "モーニング娘。'21 コンサートツアー秋" and モーニング娘。'21 コンサートツアー先々行.
			// but we don't ensure the order so use map for assertions
			a.Equals(2, len(notifications))
			notificationMap := slice.ToMap(notifications, func(i int, n push.Notification) string {
				msg, _ := n.Message(ctx)
				return msg.PushMessage.Body
			})
			notif := notificationMap["【モーニング娘。'21 コンサートツアー秋】の当落を確認しましょう。"]
			msg, _ := notif.Message(ctx)
			users, _ := notif.Receivers(ctx)
			a.Equals("当落が発表されています。", msg.PushMessage.Title)
			a.Equals("【モーニング娘。'21 コンサートツアー秋】の当落を確認しましょう。", msg.PushMessage.Body)
			a.Equals(2, len(users))
			a.Equals("ExponentPushToken[user1token]", users[0].Token)
			a.Equals("ExponentPushToken[user2token]", users[1].Token)
			//  user2 would also get another notification because they have multiple applications
			notif = notificationMap["【モーニング娘。'21 コンサートツアー秋 先々行】の当落を確認しましょう。"]
			msg, _ = notif.Message(ctx)
			users, _ = notif.Receivers(ctx)
			a.Equals("当落が発表されています。", msg.PushMessage.Title)
			a.Equals("【モーニング娘。'21 コンサートツアー秋 先々行】の当落を確認しましょう。", msg.PushMessage.Body)
			a.Equals(1, len(users))
			a.Equals("ExponentPushToken[user2token]", users[0].Token)

			// if user2 has already paid for モーニング娘。'21 コンサートツアー秋 先々行, then notification shouln't be sent
			// Only notification for "モーニング娘。'21 コンサートツアー秋" should be sent to both user1 and user2.
			assert.X(upsertFCEventTicket(appuser.WithUser(ctx, user2), upsertFCEventTicketParams{
				EventId:          event2.ID,
				UserId:           appuser.EntID(user2),
				MemberSha256:     "fcmemberid2",
				ApplicationTitle: "モーニング娘。'21 コンサートツアー秋 先々行",
				ApplicationID:    object.Nullable("mm21-2"),
				Num:              2,
				PaymentStartDate: &paymentStartDate,
				PaymentDueDate:   &paymentDueDate,
				Status:           enums.HPFCEventTicketApplicationStatusCompleted,
			}))
			notifications, _ = s.buildNotifications(appuser.WithAdmin(ctx), sendDate, 1, paymentStartQuery)
			a.Equals(1, len(notifications))
			msg, _ = notifications[0].Message(ctx)
			users, _ = notifications[0].Receivers(ctx)
			a.Equals("【モーニング娘。'21 コンサートツアー秋】の当落を確認しましょう。", msg.PushMessage.Body)
			a.Equals(2, len(users))
			a.Equals("ExponentPushToken[user1token]", users[0].Token)
			a.Equals("ExponentPushToken[user2token]", users[1].Token)

			// if user2 is rejected for モーニング娘。'21 コンサートツアー秋, then they shouln't get notification.
			// user1 should still get the notification
			assert.X(upsertFCEventTicket(appuser.WithUser(ctx, user2), upsertFCEventTicketParams{
				EventId:          event1.ID,
				UserId:           appuser.EntID(user2),
				MemberSha256:     "fcmemberid2",
				ApplicationTitle: "モーニング娘。'21 コンサートツアー秋",
				ApplicationID:    object.Nullable("mm21-1"),
				Num:              2,
				PaymentStartDate: &paymentStartDate,
				PaymentDueDate:   &paymentDueDate,
				Status:           enums.HPFCEventTicketApplicationStatusRejected,
			}))
			notifications, _ = s.buildNotifications(appuser.WithAdmin(ctx), sendDate, 1, paymentStartQuery)
			a.Equals(1, len(notifications))
			msg, _ = notifications[0].Message(ctx)
			users, _ = notifications[0].Receivers(ctx)
			a.Equals("【モーニング娘。'21 コンサートツアー秋】の当落を確認しましょう。", msg.PushMessage.Body)
			a.Equals(1, len(users))
			a.Equals("ExponentPushToken[user1token]", users[0].Token)
		})

		t.Run("Payment Due", func(t *testing.T) {
			a := assert.NewTestAssert(t)
			paymentStartDate := time.Date(2021, time.October, 2, 0, 0, 0, 0, timeutil.JST)
			paymentDueDate := time.Date(2021, time.October, 5, 0, 0, 0, 0, timeutil.JST)
			// now all user1, user2, and user3 has a ticket for event1 with pending payment status
			// The due date is 10/05 JST
			assert.X(upsertFCEventTicket(appuser.WithUser(ctx, user1), upsertFCEventTicketParams{
				EventId:          event1.ID,
				UserId:           appuser.EntID(user1),
				ApplicationSite:  enums.HPFCEventTicketApplicationSiteHelloProject,
				MemberSha256:     "fcmemberid",
				ApplicationTitle: "モーニング娘。'21 コンサートツアー秋",
				ApplicationID:    object.Nullable("mm21-1"),
				Num:              2,
				PaymentStartDate: &paymentStartDate,
				PaymentDueDate:   &paymentDueDate,
				Status:           enums.HPFCEventTicketApplicationStatusPendingPayment,
			}))
			assert.X(upsertFCEventTicket(appuser.WithUser(ctx, user2), upsertFCEventTicketParams{
				EventId:          event1.ID,
				UserId:           appuser.EntID(user2),
				ApplicationSite:  enums.HPFCEventTicketApplicationSiteHelloProject,
				MemberSha256:     "fcmemberid2",
				ApplicationTitle: "モーニング娘。'21 コンサートツアー秋",
				ApplicationID:    object.Nullable("mm21-1"),
				Num:              2,
				PaymentStartDate: &paymentStartDate,
				PaymentDueDate:   &paymentDueDate,
				Status:           enums.HPFCEventTicketApplicationStatusPendingPayment,
			}))
			assert.X(upsertFCEventTicket(appuser.WithUser(ctx, user3), upsertFCEventTicketParams{
				EventId:          event1.ID,
				UserId:           appuser.EntID(user3),
				ApplicationSite:  enums.HPFCEventTicketApplicationSiteHelloProject,
				MemberSha256:     "fcmemberid3",
				ApplicationTitle: "モーニング娘。'21 コンサートツアー秋",
				ApplicationID:    object.Nullable("mm21-1"),
				Num:              2,
				PaymentStartDate: &paymentStartDate,
				PaymentDueDate:   &paymentDueDate,
				Status:           enums.HPFCEventTicketApplicationStatusPendingPayment,
			}))
			/*
				3 applications, all of which starts payment at 2021/10/02 JST and the due is at 2021/10/05 JST
				we set ndays = 2 so the notification should be sent at 10/04 and 10/05
			*/
			ndays := 2

			// out of range
			for _, sendDate := range []time.Time{
				time.Date(2021, time.October, 1, 7, 0, 0, 0, timeutil.JST), // too early
				time.Date(2021, time.October, 2, 7, 0, 0, 0, timeutil.JST), // too early
				time.Date(2021, time.October, 3, 7, 0, 0, 0, timeutil.JST), // too early
				time.Date(2021, time.October, 6, 7, 0, 0, 0, timeutil.JST), // too late
			} {
				notifications, _ := s.buildNotifications(appuser.WithAdmin(ctx), sendDate, ndays, paymentDueQuery)
				a.Equals(0, len(notifications))
			}
			//
			// @ 10/04
			//
			sendDate := time.Date(2021, time.October, 4, 7, 0, 0, 0, timeutil.JST)
			notifications, _ := s.buildNotifications(appuser.WithAdmin(ctx), sendDate, ndays, paymentDueQuery)
			a.Equals(1, len(notifications))
			msg, _ := notifications[0].Message(ctx)
			receivers, _ := notifications[0].Receivers(ctx)
			a.Equals(1, len(notifications))
			a.Equals("【あと1日】入金期限が近づいています！！！", msg.PushMessage.Title)
			a.Equals("【モーニング娘。'21 コンサートツアー秋】が未入金です。急いで入金してください。", msg.PushMessage.Body)
			a.Equals(2, len(receivers))
			a.Equals("ExponentPushToken[user1token]", receivers[0].Token)
			a.Equals("ExponentPushToken[user3token]", receivers[1].Token)
			nlog, err := push.Deliver(appuser.WithAdmin(ctx), notifications[0])
			a.Nil(err)
			a.Equals("helloproject.upfc.notificaiton.payment_due", nlog.Key)
			a.Equals("send: 2021-10-04, due: 2021-10-05 - モーニング娘。'21 コンサートツアー秋", nlog.Trigger)

			//
			// @ 10/05
			//
			sendDate = time.Date(2021, time.October, 5, 7, 0, 0, 0, timeutil.JST)
			notifications, _ = s.buildNotifications(appuser.WithAdmin(ctx), sendDate, ndays, paymentDueQuery)
			msg, _ = notifications[0].Message(ctx)
			receivers, _ = notifications[0].Receivers(ctx)
			a.Equals(1, len(notifications))
			a.Equals("【本日締切】入金期限が近づいています！！！", msg.PushMessage.Title)
			a.Equals("【モーニング娘。'21 コンサートツアー秋】が未入金です。急いで入金してください。", msg.PushMessage.Body)
			a.Equals(2, len(receivers))
			a.Equals("ExponentPushToken[user1token]", receivers[0].Token)
			a.Equals("ExponentPushToken[user3token]", receivers[1].Token)
			nlog, err = push.Deliver(appuser.WithAdmin(ctx), notifications[0])
			a.Nil(err)
			a.Equals("helloproject.upfc.notificaiton.payment_due", nlog.Key)
			a.Equals("send: 2021-10-05, due: 2021-10-05 - モーニング娘。'21 コンサートツアー秋", nlog.Trigger)
		})
	})
}
