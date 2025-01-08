package elineupmall

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/yssk22/hpapp/go/foundation/slice"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/hpelineupmallitem"
	"github.com/yssk22/hpapp/go/service/ent/hpelineupmallitempurchasehistory"
	"github.com/yssk22/hpapp/go/service/ent/predicate"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/errors"
	"github.com/yssk22/hpapp/go/system/slog"
)

type HPElineupMallItemPurchaseHistoryUpsertParams struct {
	UserId int
	Orders []HPElineupMallItemPurchasedItemOrderDetails
}

type HPElineupMallItemPurchasedItemOrderDetails struct {
	Permalink string
	Name      string
	OrderId   string
	OrderedAt time.Time
	Num       int
	Price     int
}

func UpsertPurchaseHistories(ctx context.Context, params HPElineupMallItemPurchaseHistoryUpsertParams) ([]*ent.HPElineupMallItemPurchaseHistory, error) {
	type PurchasedItem struct {
		Item  *ent.HPElineupMallItem
		Order HPElineupMallItemPurchasedItemOrderDetails
	}

	client := entutil.NewClient(ctx)
	// convert permalink to HPElineupMallItem id
	var permalinks []string
	var purchasedItems map[string]*PurchasedItem = make(map[string]*PurchasedItem)
	for _, r := range params.Orders {
		permalinks = append(permalinks, r.Permalink)
		purchasedItems[r.Permalink] = &PurchasedItem{
			Order: r,
		}
	}
	// fill item references
	items, err := client.HPElineupMallItem.Query().Where(hpelineupmallitem.PermalinkIn(permalinks...)).All(ctx)
	if err != nil {
		return nil, errors.Wrap(ctx, err)
	}
	for _, item := range items {
		purchasedItems[item.Permalink].Item = item
	}

	// do bulk upsert
	var creates []*ent.HPElineupMallItemPurchaseHistoryCreate
	var orderItemPredicate []predicate.HPElineupMallItemPurchaseHistory
	// iterate with params.Orders to keep the list order
	for _, r := range params.Orders {
		purchased := purchasedItems[r.Permalink]
		c := client.HPElineupMallItemPurchaseHistory.Create()
		if purchased.Item != nil {
			c.SetElineupMallItem(purchased.Item)
		}
		c.SetPermalink(purchased.Order.Permalink)
		c.SetOwnerID(params.UserId)
		c.SetOrderID(purchased.Order.OrderId)
		c.SetName(purchased.Order.Name)
		c.SetPrice(purchased.Order.Price)
		c.SetNum(purchased.Order.Num)
		c.SetOrderedAt(purchased.Order.OrderedAt)
		creates = append(creates, c)
		orderItemPredicate = append(orderItemPredicate,
			hpelineupmallitempurchasehistory.And(
				hpelineupmallitempurchasehistory.OrderIDEQ(purchased.Order.OrderId),
				hpelineupmallitempurchasehistory.PermalinkEQ(purchased.Order.Permalink),
			),
		)
	}
	err = client.HPElineupMallItemPurchaseHistory.CreateBulk(creates...).OnConflictColumns(
		hpelineupmallitempurchasehistory.FieldPermalink,
		hpelineupmallitempurchasehistory.FieldOwnerUserID,
		hpelineupmallitempurchasehistory.FieldOrderID,
	).UpdateNewValues().Exec(ctx)
	if err != nil {
		slog.Error(ctx, "failed to upsert items",
			slog.Name("services.helloproject.elineupmall.UpsertPurchaseHistories"),
			slog.Attribute("error", err.Error()))
		return nil, err
	}
	histories, err := client.HPElineupMallItemPurchaseHistory.Query().Where(
		hpelineupmallitempurchasehistory.OwnerUserIDEQ(params.UserId),
		hpelineupmallitempurchasehistory.Or(orderItemPredicate...),
	).All(ctx)
	if err != nil {
		log.Println(err)
		slog.Error(ctx, "failed to fetch upserted items",
			slog.Name("services.helloproject.elineupmall.UpsertPurchaseHistories"),
			slog.Attribute("error", err.Error()))
		return nil, err
	}
	// reorder histories
	var historiesMap map[string]*ent.HPElineupMallItemPurchaseHistory = make(map[string]*ent.HPElineupMallItemPurchaseHistory)
	for _, hist := range histories {
		historiesMap[fmt.Sprintf("%s.%s", hist.OrderID, hist.Permalink)] = hist
	}
	return slice.Map(params.Orders, func(i int, order HPElineupMallItemPurchasedItemOrderDetails) (*ent.HPElineupMallItemPurchaseHistory, error) {
		return historiesMap[fmt.Sprintf("%s.%s", order.OrderId, order.Permalink)], nil
	})
}
