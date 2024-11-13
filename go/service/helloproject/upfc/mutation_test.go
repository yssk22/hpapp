package upfc

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
	"github.com/yssk22/hpapp/go/service/ent/hpfceventticket"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/schema/enums"
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
		_, err := UpsertEventsAndApplications(ctx, HPFCEventTicketApplicationUpsertParams{
			UserId: uid,
			Applications: []HPFCEventTicketApplication{
				{
					MemberSha256:            "dummysha256",
					Title:                   "Juice=Juice 入江里咲バースデーイベント2022",
					FullyQualifiedVenueName: "神奈川県 LANDMARK HALL",
					StartAt:                 startAt,
					Num:                     1,
					Status:                  enums.HPFCEventTicketApplicationStatusSubmitted,
					ApplicationID:           object.Nullable("A123"),
					ApplicationSite:         enums.HPFCEventTicketApplicationSiteHelloProject,
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
		a.Equals(enums.HPFCEventTicketApplicationStatusSubmitted, event.Edges.HpfcEventTickets[0].Status)
		a.Equals(enums.HPFCEventTicketApplicationSiteHelloProject, event.Edges.HpfcEventTickets[0].ApplicationSite)

		// now the application is rejected so trying to submit 2次受付
		_, err = UpsertEventsAndApplications(ctx, HPFCEventTicketApplicationUpsertParams{
			UserId: uid,
			Applications: []HPFCEventTicketApplication{
				{
					MemberSha256:            "dummysha256",
					Title:                   "Juice=Juice 入江里咲バースデーイベント2022",
					FullyQualifiedVenueName: "神奈川県 LANDMARK HALL",
					StartAt:                 startAt,
					Num:                     1,
					Status:                  enums.HPFCEventTicketApplicationStatusRejected,
					ApplicationID:           object.Nullable("A123"),
					ApplicationSite:         enums.HPFCEventTicketApplicationSiteHelloProject,
				},
				{
					MemberSha256:            "dummysha256",
					Title:                   "【二次受付】 Juice=Juice 入江里咲バースデーイベント2022",
					FullyQualifiedVenueName: "神奈川県 LANDMARK HALL",
					StartAt:                 startAt,
					Num:                     1,
					Status:                  enums.HPFCEventTicketApplicationStatusSubmitted,
					ApplicationID:           object.Nullable("A124"),
					ApplicationSite:         enums.HPFCEventTicketApplicationSiteHelloProject,
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
		a.Equals(enums.HPFCEventTicketApplicationStatusRejected, event.Edges.HpfcEventTickets[0].Status)
		a.Equals(enums.HPFCEventTicketApplicationStatusSubmitted, event.Edges.HpfcEventTickets[1].Status)

		// the second one now gets pending payment
		_, err = UpsertEventsAndApplications(ctx, HPFCEventTicketApplicationUpsertParams{
			UserId: uid,
			Applications: []HPFCEventTicketApplication{
				{
					MemberSha256:            "dummysha256",
					Title:                   "Juice=Juice 入江里咲バースデーイベント2022",
					FullyQualifiedVenueName: "神奈川県 LANDMARK HALL",
					StartAt:                 startAt,
					Num:                     1,
					Status:                  enums.HPFCEventTicketApplicationStatusRejected,
					ApplicationID:           object.Nullable("A123"),
					ApplicationSite:         enums.HPFCEventTicketApplicationSiteHelloProject,
				},
				{
					MemberSha256:            "dummysha256",
					Title:                   "【二次受付】 Juice=Juice 入江里咲バースデーイベント2022",
					FullyQualifiedVenueName: "神奈川県 LANDMARK HALL",
					StartAt:                 startAt,
					Num:                     1,
					Status:                  enums.HPFCEventTicketApplicationStatusPendingPayment,
					ApplicationID:           object.Nullable("A124"),
					ApplicationSite:         enums.HPFCEventTicketApplicationSiteHelloProject,
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
		a.Equals(enums.HPFCEventTicketApplicationStatusPendingPayment, event.Edges.HpfcEventTickets[0].Status)
		a.Equals(enums.HPFCEventTicketApplicationStatusRejected, event.Edges.HpfcEventTickets[1].Status)

		// complete payment
		_, err = UpsertEventsAndApplications(ctx, HPFCEventTicketApplicationUpsertParams{
			UserId: uid,
			Applications: []HPFCEventTicketApplication{
				{
					MemberSha256:            "dummysha256",
					Title:                   "Juice=Juice 入江里咲バースデーイベント2022",
					FullyQualifiedVenueName: "神奈川県 LANDMARK HALL",
					StartAt:                 startAt,
					Num:                     1,
					Status:                  enums.HPFCEventTicketApplicationStatusRejected,
					ApplicationID:           object.Nullable("A123"),
					ApplicationSite:         enums.HPFCEventTicketApplicationSiteHelloProject,
				},
				{
					MemberSha256:            "dummysha256",
					Title:                   "【二次受付】 Juice=Juice 入江里咲バースデーイベント2022",
					FullyQualifiedVenueName: "神奈川県 LANDMARK HALL",
					StartAt:                 startAt,
					Num:                     1,
					Status:                  enums.HPFCEventTicketApplicationStatusCompleted,
					ApplicationID:           object.Nullable("A124"),
					ApplicationSite:         enums.HPFCEventTicketApplicationSiteHelloProject,
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
		a.Equals(enums.HPFCEventTicketApplicationStatusCompleted, event.Edges.HpfcEventTickets[0].Status)
		a.Equals(enums.HPFCEventTicketApplicationStatusRejected, event.Edges.HpfcEventTickets[1].Status)
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
			_, err = UpsertEventsAndApplications(appuser.WithAdmin(ctx), HPFCEventTicketApplicationUpsertParams{
				UserId: uid,
				Applications: []HPFCEventTicketApplication{
					{
						MemberSha256:            "dummysha256",
						Title:                   "Juice=Juice 入江里咲バースデーイベント2022",
						FullyQualifiedVenueName: "神奈川県 LANDMARK HALL",
						StartAt:                 startAt,
						Num:                     1,
						Status:                  enums.HPFCEventTicketApplicationStatusCompleted,
						ApplicationID:           object.Nullable("A123"),
						ApplicationSite:         enums.HPFCEventTicketApplicationSiteHelloProject,
					},
					{
						MemberSha256:            "dummysha256",
						Title:                   "【二次受付】 Juice=Juice 入江里咲バースデーイベント2022",
						FullyQualifiedVenueName: "神奈川県 LANDMARK HALL",
						StartAt:                 startAt,
						Num:                     1,
						Status:                  enums.HPFCEventTicketApplicationStatusCompleted,
						ApplicationID:           object.Nullable("A124"),
						ApplicationSite:         enums.HPFCEventTicketApplicationSiteHelloProject,
					},
				},
			})
			a.Equals(appuser.ErrNotAuthorized, err)
		})
	})
}
