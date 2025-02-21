package me

import (
	"context"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/object"
	"github.com/yssk22/hpapp/go/foundation/slice"
	"github.com/yssk22/hpapp/go/graphql/common"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/auth/client"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/hpelineupmallitempurchasehistory"
	"github.com/yssk22/hpapp/go/service/ent/hpevent"
	"github.com/yssk22/hpapp/go/service/ent/hpfceventticket"
	"github.com/yssk22/hpapp/go/service/ent/hpfeeditem"
	"github.com/yssk22/hpapp/go/service/ent/hpmember"
	"github.com/yssk22/hpapp/go/service/ent/hpsorthistory"
	"github.com/yssk22/hpapp/go/service/ent/hpviewhistory"
	"github.com/yssk22/hpapp/go/service/ent/predicate"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/helloproject/user"
	"github.com/yssk22/hpapp/go/service/push"
	"github.com/yssk22/hpapp/go/service/schema/enums"
)

type MeQuery struct{}

func (h *MeQuery) IsNode() {}

func (h *MeQuery) ID() string {
	return "me"
}

func (h *MeQuery) UserID(ctx context.Context) (string, error) {
	return appuser.CurrentUser(ctx).ID(), nil
}

func (h *MeQuery) Username(ctx context.Context) (string, error) {
	return appuser.CurrentUser(ctx).Username(), nil
}

func (h *MeQuery) ClientID(ctx context.Context) *string {
	c := client.CurrentClient(ctx)
	if c == nil {
		return nil
	}
	return object.Nullable(c.ID())
}

func (h *MeQuery) ClientName(ctx context.Context) *string {
	c := client.CurrentClient(ctx)
	if c == nil {
		return nil
	}
	return object.Nullable(c.Name())
}

func (h *MeQuery) ClientIsVerified(ctx context.Context) *bool {
	c := client.CurrentClient(ctx)
	if c == nil {
		return nil
	}
	return object.Nullable(c.IsVerified(ctx))
}

func (h *MeQuery) Authentications(ctx context.Context) ([]*ent.Auth, error) {
	return appuser.ListAuthentication(ctx, appuser.CurrentEntUserID(ctx))
}

func (h *MeQuery) NotificationSettings(ctx context.Context, slug string) ([]*ent.UserNotificationSetting, error) {
	return push.GetNotificationSettings(ctx, appuser.CurrentEntUserID(ctx), slug)
}

func (h *MeQuery) Followings(ctx context.Context) ([]*ent.HPFollow, error) {
	return user.GetFollowings(ctx, appuser.CurrentEntUserID(ctx))
}

func (h *MeQuery) SortHistories(ctx context.Context, after *ent.Cursor, first *int, before *ent.Cursor, last *int) (*ent.HPSortHistoryConnection, error) {
	client := entutil.NewClient(ctx)
	return client.HPSortHistory.Query().
		Where(hpsorthistory.OwnerUserIDEQ(appuser.CurrentEntUserID(ctx))).
		Paginate(ctx, after, first, before, last, ent.WithHPSortHistoryOrder(&ent.HPSortHistoryOrder{
			Direction: "DESC",
			Field:     ent.HPSortHistoryOrderFieldCreatedAt,
		}))
}

func (h *MeQuery) ElineupMallPurchaseHistories(ctx context.Context, after *ent.Cursor, first *int, before *ent.Cursor, last *int) (*ent.HPElineupMallItemPurchaseHistoryConnection, error) {
	client := entutil.NewClient(ctx)
	return client.HPElineupMallItemPurchaseHistory.Query().
		Where(hpelineupmallitempurchasehistory.OwnerUserIDEQ(appuser.CurrentEntUserID(ctx))).
		Paginate(ctx, after, first, before, last,
			ent.WithHPElineupMallItemPurchaseHistoryOrder(&ent.HPElineupMallItemPurchaseHistoryOrder{
				Direction: "DESC",
				Field:     ent.HPElineupMallItemPurchaseHistoryOrderFieldOrderedAt,
			}))
}

type HPEventQueryParams struct {
}

func (h *MeQuery) Events(ctx context.Context, after *ent.Cursor, first *int, before *ent.Cursor, last *int) (*ent.HPEventConnection, error) {
	client := entutil.NewClient(ctx)
	uid := appuser.CurrentEntUserID(ctx)
	first = common.First(first, 20)
	q := client.HPEvent.Query().WithHpfcEventTickets(func(q *ent.HPFCEventTicketQuery) {
		q.Where(hpfceventticket.OwnerUserIDEQ(uid))
	}).Where(hpevent.HasHpfcEventTicketsWith(hpfceventticket.OwnerUserIDEQ(uid)))
	return q.Paginate(ctx, after, first, before, last, ent.WithHPEventOrder(&ent.HPEventOrder{
		Direction: "DESC",
		Field:     ent.HPEventOrderFieldStartAt,
	}))
}

type MeFavoriteQueryParams struct {
	MemberIDs  []string
	AssetTypes []enums.HPAssetType
}

func (h *MeQuery) Favorites(ctx context.Context, params MeFavoriteQueryParams, after *ent.Cursor, first *int, before *ent.Cursor, last *int) (*ent.HPFeedItemConnection, error) {
	client := entutil.NewClient(ctx)
	uid := appuser.CurrentEntUserID(ctx)
	first = common.First(first, 20)
	ps := []predicate.HPFeedItem{
		hpfeeditem.HasViewHistoriesWith(hpviewhistory.OwnerUserIDEQ(uid), hpviewhistory.IsFavorite(true)),
	}
	if len(params.MemberIDs) > 0 {
		memberIds := assert.X(slice.MapStringToInt(params.MemberIDs))
		ps = append(ps, hpfeeditem.HasOwnerMemberWith(hpmember.IDIn(memberIds...)))
	}
	if len(params.AssetTypes) > 0 {
		ps = append(ps, hpfeeditem.AssetTypeIn(params.AssetTypes...))
	}
	q := client.HPFeedItem.Query().Where(ps...)
	return q.Paginate(ctx, after, first, before, last, ent.WithHPFeedItemOrder(&ent.HPFeedItemOrder{
		Direction: "DESC",
		Field:     ent.HPFeedItemOrderFieldPostAt,
	}))
}
