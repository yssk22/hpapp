package upfc

import (
	"context"
	"testing"
	"time"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/foundation/object"
	"hpapp.yssk22.dev/go/foundation/timeutil"
	"hpapp.yssk22.dev/go/service/auth/appuser"
	"hpapp.yssk22.dev/go/service/bootstrap/test"
	"hpapp.yssk22.dev/go/service/ent"
	"hpapp.yssk22.dev/go/service/ent/hpfceventticket"
	"hpapp.yssk22.dev/go/service/entutil"
	"hpapp.yssk22.dev/go/service/schema/enums"
)

func TestUPFCMutation(t *testing.T) {
	test.New(
		"UpsertEventsAndApplications",
		test.WithHPMaster(),
		test.WithUser(),
	).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		entclient := entutil.NewClient(ctx)
		startAt := time.Date(2022, 10, 18, 18, 30, 0, 0, timeutil.JST)
		uid := appuser.CurrentEntUserID(ctx)

		// first application
		_, err := UpsertEventsAndApplications(ctx, UpsertEventsParams{
			FCMemberSha256: "dummysha256",
			UserId:         uid,
			Applications: []EventTicketApplication{
				{
					Title:                   "Juice=Juice 入江里咲バースデーイベント2022",
					FullyQualifiedVenueName: "神奈川県 LANDMARK HALL",
					StartAt:                 startAt,
					Num:                     1,
					Status:                  enums.HPEventFCTicketStatusSubmitted,
					ApplicationID:           object.Nullable("A123"),
				},
			},
		})
		a.Nil(err)
		event := entclient.HPEvent.Query().WithHpfcEventTickets(func(q *ent.HPFCEventTicketQuery) {
			q.Order(ent.Asc(hpfceventticket.FieldStatus))
		}).OnlyX(ctx)
		a.Equals("神奈川県", event.Prefecture)
		a.Equals("LANDMARK HALL", event.Venue)
		a.Equals(1, len(event.Edges.HpfcEventTickets))
		a.Equals(enums.HPEventFCTicketStatusSubmitted, event.Edges.HpfcEventTickets[0].Status)

		// now the application is rejected so trying to submit 2次受付
		_, err = UpsertEventsAndApplications(ctx, UpsertEventsParams{
			FCMemberSha256: "dummysha256",
			UserId:         uid,
			Applications: []EventTicketApplication{
				{
					Title:                   "Juice=Juice 入江里咲バースデーイベント2022",
					FullyQualifiedVenueName: "神奈川県 LANDMARK HALL",
					StartAt:                 startAt,
					Num:                     1,
					Status:                  enums.HPEventFCTicketStatusRejected,
					ApplicationID:           object.Nullable("A123"),
				},
				{
					Title:                   "【二次受付】 Juice=Juice 入江里咲バースデーイベント2022",
					FullyQualifiedVenueName: "神奈川県 LANDMARK HALL",
					StartAt:                 startAt,
					Num:                     1,
					Status:                  enums.HPEventFCTicketStatusSubmitted,
					ApplicationID:           object.Nullable("A124"),
				},
			},
		})
		a.Nil(err)
		event = entclient.HPEvent.Query().WithHpfcEventTickets(func(q *ent.HPFCEventTicketQuery) {
			q.Order(ent.Asc(hpfceventticket.FieldStatus))
		}).OnlyX(ctx)
		a.Equals("神奈川県", event.Prefecture)
		a.Equals("LANDMARK HALL", event.Venue)
		a.Equals(2, len(event.Edges.HpfcEventTickets))
		a.Equals(enums.HPEventFCTicketStatusRejected, event.Edges.HpfcEventTickets[0].Status)
		a.Equals(enums.HPEventFCTicketStatusSubmitted, event.Edges.HpfcEventTickets[1].Status)

		// the second one now gets pending payment
		_, err = UpsertEventsAndApplications(ctx, UpsertEventsParams{
			FCMemberSha256: "dummysha256",
			UserId:         uid,
			Applications: []EventTicketApplication{
				{
					Title:                   "Juice=Juice 入江里咲バースデーイベント2022",
					FullyQualifiedVenueName: "神奈川県 LANDMARK HALL",
					StartAt:                 startAt,
					Num:                     1,
					Status:                  enums.HPEventFCTicketStatusRejected,
					ApplicationID:           object.Nullable("A123"),
				},
				{
					Title:                   "【二次受付】 Juice=Juice 入江里咲バースデーイベント2022",
					FullyQualifiedVenueName: "神奈川県 LANDMARK HALL",
					StartAt:                 startAt,
					Num:                     1,
					Status:                  enums.HPEventFCTicketStatusPendingPayment,
					ApplicationID:           object.Nullable("A124"),
				},
			},
		})
		a.Nil(err)
		event = entclient.HPEvent.Query().WithHpfcEventTickets(func(q *ent.HPFCEventTicketQuery) {
			q.Order(ent.Asc(hpfceventticket.FieldStatus))
		}).OnlyX(ctx)
		a.Equals("神奈川県", event.Prefecture)
		a.Equals("LANDMARK HALL", event.Venue)
		a.Equals(2, len(event.Edges.HpfcEventTickets))
		a.Equals(enums.HPEventFCTicketStatusPendingPayment, event.Edges.HpfcEventTickets[0].Status)
		a.Equals(enums.HPEventFCTicketStatusRejected, event.Edges.HpfcEventTickets[1].Status)

		// complete payment
		_, err = UpsertEventsAndApplications(ctx, UpsertEventsParams{
			FCMemberSha256: "dummysha256",
			UserId:         uid,
			Applications: []EventTicketApplication{
				{
					Title:                   "Juice=Juice 入江里咲バースデーイベント2022",
					FullyQualifiedVenueName: "神奈川県 LANDMARK HALL",
					StartAt:                 startAt,
					Num:                     1,
					Status:                  enums.HPEventFCTicketStatusRejected,
					ApplicationID:           object.Nullable("A123"),
				},
				{
					Title:                   "【二次受付】 Juice=Juice 入江里咲バースデーイベント2022",
					FullyQualifiedVenueName: "神奈川県 LANDMARK HALL",
					StartAt:                 startAt,
					Num:                     1,
					Status:                  enums.HPEventFCTicketStatusCompleted,
					ApplicationID:           object.Nullable("A124"),
				},
			},
		})
		a.Nil(err)
		event = entclient.HPEvent.Query().WithHpfcEventTickets(func(q *ent.HPFCEventTicketQuery) {
			q.WithUser().Order(ent.Asc(hpfceventticket.FieldStatus))
		}).OnlyX(ctx)
		a.Equals("神奈川県", event.Prefecture)
		a.Equals("LANDMARK HALL", event.Venue)
		a.Equals(2, len(event.Edges.HpfcEventTickets))
		a.Equals(enums.HPEventFCTicketStatusCompleted, event.Edges.HpfcEventTickets[0].Status)
		a.Equals(enums.HPEventFCTicketStatusRejected, event.Edges.HpfcEventTickets[1].Status)
		a.Equals(uid, event.Edges.HpfcEventTickets[0].Edges.User.ID)
		a.Equals(uid, event.Edges.HpfcEventTickets[1].Edges.User.ID)

		t.Run("Policy", func(t *testing.T) {
			// otherUser should not be able to see the ticket records submitted by the user.
			otherUser := test.MakeTestUser(ctx)
			ctx := appuser.WithUser(ctx, otherUser)
			event = entclient.HPEvent.Query().WithHpfcEventTickets(func(q *ent.HPFCEventTicketQuery) {
				q.Order(ent.Asc(hpfceventticket.FieldStatus))
			}).OnlyX(ctx)
			a.Equals(0, len(event.Edges.HpfcEventTickets))

			// admin should should be able to see the ticket records submitted by the user.
			// This is required to send the notification
			event = entclient.HPEvent.Query().WithHpfcEventTickets(func(q *ent.HPFCEventTicketQuery) {
				q.Order(ent.Asc(hpfceventticket.FieldStatus))
			}).OnlyX(appuser.WithAdmin(ctx))
			a.Equals(2, len(event.Edges.HpfcEventTickets))

			// Even admin should not be able to upsert the records by the user.
			// This is a protect mechanism for the accidental mutation.
			// they has to use appuser.WithUser(ctx) before calling UpsertEventsAndApplications
			_, err = UpsertEventsAndApplications(appuser.WithAdmin(ctx), UpsertEventsParams{
				FCMemberSha256: "dummysha256",
				UserId:         uid,
				Applications: []EventTicketApplication{
					{
						Title:                   "Juice=Juice 入江里咲バースデーイベント2022",
						FullyQualifiedVenueName: "神奈川県 LANDMARK HALL",
						StartAt:                 startAt,
						Num:                     1,
						Status:                  enums.HPEventFCTicketStatusCompleted,
						ApplicationID:           object.Nullable("A123"),
					},
					{
						Title:                   "【二次受付】 Juice=Juice 入江里咲バースデーイベント2022",
						FullyQualifiedVenueName: "神奈川県 LANDMARK HALL",
						StartAt:                 startAt,
						Num:                     1,
						Status:                  enums.HPEventFCTicketStatusCompleted,
						ApplicationID:           object.Nullable("A124"),
					},
				},
			})
			a.Equals(appuser.ErrNotAuthorized, err)
		})
	})
}
