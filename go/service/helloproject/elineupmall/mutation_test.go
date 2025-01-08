package elineupmall

import (
	"context"
	"testing"
	"time"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/timeutil"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/bootstrap/test"
	"github.com/yssk22/hpapp/go/service/entutil"
)

func TestElineupMallMutation(t *testing.T) {
	test.New(
		"UpsertPurchaseHistories",
		test.WithHPMaster(),
		test.WithUser(),
	).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		entclient := entutil.NewClient(ctx)
		uid := appuser.CurrentEntUserID(ctx)

		item1 := entclient.HPElineupMallItem.Create().
			SetPermalink("https://www.elineupmall.com/item1/").
			SetName("item1").
			SetSupplier("supplier").
			SetPrice(100).
			SetIsLimitedToFc(false).
			SetIsOutOfStock(false).
			SetImages(nil).
			SaveX(ctx)
		item2 := entclient.HPElineupMallItem.Create().
			SetPermalink("https://www.elineupmall.com/item2/").
			SetName("item2").
			SetSupplier("supplier").
			SetPrice(100).
			SetIsLimitedToFc(false).
			SetIsOutOfStock(false).
			SetImages(nil).
			SaveX(ctx)

		created, err := UpsertPurchaseHistories(ctx, HPElineupMallItemPurchaseHistoryUpsertParams{
			UserId: uid,
			Orders: []HPElineupMallItemPurchasedItemOrderDetails{
				{
					Permalink: "https://www.elineupmall.com/item1/",
					Name:      "item1",
					OrderId:   "order1",
					OrderedAt: time.Date(2024, 10, 18, 18, 30, 0, 0, timeutil.JST),
					Num:       1,
					Price:     100,
				},
				{
					Permalink: "https://www.elineupmall.com/item2/",
					Name:      "item2",
					OrderId:   "order1",
					OrderedAt: time.Date(2024, 10, 18, 18, 30, 0, 0, timeutil.JST),
					Num:       2,
					Price:     200,
				},
				{
					Permalink: "https://www.elineupmall.com/item3/",
					Name:      "item3 uncralwed",
					OrderId:   "order1",
					OrderedAt: time.Date(2024, 10, 18, 18, 30, 0, 0, timeutil.JST),
					Num:       3,
					Price:     300,
				},
			},
		})
		a.Nil(err)
		a.Equals(3, len(created))

		a.Equals(item1.ID, *created[0].PurchasedItemID)
		a.Equals(1, created[0].Num)
		a.Equals(100, created[0].Price)
		a.Equals("order1", created[0].OrderID)
		a.Equals("item1", created[0].Name)
		a.Equals(uid, created[0].OwnerUserID)
		a.Equals("https://www.elineupmall.com/item1/", created[0].Permalink)
		a.Equals(time.Date(2024, 10, 18, 18, 30, 0, 0, timeutil.JST), created[0].OrderedAt)

		a.Equals(item2.ID, *created[1].PurchasedItemID)
		a.Equals(2, created[1].Num)
		a.Equals(200, created[1].Price) // it's not same as item2.Price since ordreed price might be different from the latest item price.
		a.Equals("order1", created[1].OrderID)
		a.Equals("item2", created[1].Name)
		a.Equals(uid, created[1].OwnerUserID)
		a.Equals("https://www.elineupmall.com/item2/", created[1].Permalink)
		a.Equals(time.Date(2024, 10, 18, 18, 30, 0, 0, timeutil.JST), created[1].OrderedAt)

		a.Nil(created[2].PurchasedItemID)
		a.Equals(3, created[2].Num)
		a.Equals(300, created[2].Price)
		a.Equals("order1", created[2].OrderID)
		a.Equals("item3 uncralwed", created[2].Name)
		a.Equals(uid, created[2].OwnerUserID)
		a.Equals("https://www.elineupmall.com/item3/", created[2].Permalink)
		a.Equals(time.Date(2024, 10, 18, 18, 30, 0, 0, timeutil.JST), created[2].OrderedAt)

		// upserts
		item3 := entclient.HPElineupMallItem.Create().
			SetPermalink("https://www.elineupmall.com/item3/").
			SetName("item3").
			SetSupplier("supplier").
			SetPrice(100).
			SetIsLimitedToFc(false).
			SetIsOutOfStock(false).
			SetImages(nil).
			SaveX(ctx)

		upserted, err := UpsertPurchaseHistories(ctx, HPElineupMallItemPurchaseHistoryUpsertParams{
			UserId: uid,
			Orders: []HPElineupMallItemPurchasedItemOrderDetails{
				{
					Permalink: "https://www.elineupmall.com/item1/",
					Name:      "item1",
					OrderId:   "order2", // different order id so a new record will be created.
					OrderedAt: time.Date(2024, 10, 18, 18, 30, 0, 0, timeutil.JST),
					Num:       1,
					Price:     100,
				},
				{
					Permalink: "https://www.elineupmall.com/item2/",
					Name:      "item2 updated",
					OrderId:   "order1",
					OrderedAt: time.Date(2024, 10, 18, 18, 30, 0, 0, timeutil.JST),
					Num:       4, // update the number
					Price:     400,
				},
				{
					Permalink: "https://www.elineupmall.com/item3/",
					Name:      "item3",
					OrderId:   "order1",
					OrderedAt: time.Date(2024, 10, 18, 18, 30, 0, 0, timeutil.JST),
					Num:       3,
					Price:     300,
				},
			},
		})
		a.Nil(err)
		a.Equals(3, len(upserted))

		a.OK(upserted[0].ID != created[0].ID)
		a.Equals("order2", upserted[0].OrderID)

		a.Equals(created[1].ID, upserted[1].ID)
		a.Equals("item2 updated", upserted[1].Name)
		a.Equals(4, upserted[1].Num)
		a.Equals(400, upserted[1].Price)

		a.Equals(created[2].ID, upserted[2].ID)
		a.Equals(item3.ID, *upserted[2].PurchasedItemID)

		t.Run("Mutation Policy", func(tt *testing.T) {
			a := assert.NewTestAssert(tt)
			_, err := UpsertPurchaseHistories(appuser.WithAdmin(ctx), HPElineupMallItemPurchaseHistoryUpsertParams{
				UserId: uid,
				Orders: []HPElineupMallItemPurchasedItemOrderDetails{
					{
						Permalink: "https://www.elineupmall.com/item1/",
						Name:      "item1",
						OrderId:   "order1",
						OrderedAt: time.Date(2024, 10, 18, 18, 30, 0, 0, timeutil.JST),
						Num:       1,
						Price:     100,
					},
				},
			})
			a.NotNil(err)
		})
	})

}
