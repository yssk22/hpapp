package me

import (
	"context"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/foundation/object"
	"hpapp.yssk22.dev/go/foundation/slice"
	"hpapp.yssk22.dev/go/graphql/common"
	"hpapp.yssk22.dev/go/service/auth/appuser"
	"hpapp.yssk22.dev/go/service/auth/client"
	"hpapp.yssk22.dev/go/service/ent"
	"hpapp.yssk22.dev/go/service/ent/hpevent"
	"hpapp.yssk22.dev/go/service/ent/hpfceventticket"
	"hpapp.yssk22.dev/go/service/ent/hpfeeditem"
	"hpapp.yssk22.dev/go/service/ent/hpmember"
	"hpapp.yssk22.dev/go/service/ent/hpsorthistory"
	"hpapp.yssk22.dev/go/service/ent/hpviewhistory"
	"hpapp.yssk22.dev/go/service/ent/predicate"
	"hpapp.yssk22.dev/go/service/entutil"
	"hpapp.yssk22.dev/go/service/helloproject/user"
	"hpapp.yssk22.dev/go/service/schema/enums"
)

type MeQuery struct{}

func (h *MeQuery) ID(ctx context.Context) (string, error) {
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

func (h *MeQuery) Followings(ctx context.Context) ([]*ent.HPFollow, error) {
	return user.GetFollowings(ctx, appuser.CurrentEntUserID(ctx))
}

func (h *MeQuery) SortHistories(ctx context.Context, after *ent.Cursor, first *int, before *ent.Cursor, last *int) (*ent.HPSortHistoryConnection, error) {
	client := entutil.NewClient(ctx)
	return client.HPSortHistory.Query().
		Where(hpsorthistory.OwnerUserIDEQ(appuser.CurrentEntUserID(ctx))).
		Order(ent.Desc(hpsorthistory.FieldCreatedAt)).
		Paginate(ctx, after, first, before, last)
}

type HPEventQueryParams struct {
}

func (h *MeQuery) Events(ctx context.Context, after *ent.Cursor, first *int, before *ent.Cursor, last *int) (*ent.HPEventConnection, error) {
	client := entutil.NewClient(ctx)
	uid := appuser.CurrentEntUserID(ctx)
	first = common.First(first, 20)
	q := client.HPEvent.Query().WithHpfcEventTickets(func(q *ent.HPFCEventTicketQuery) {
		q.Where(hpfceventticket.OwnerUserIDEQ(uid))
	}).Where(hpevent.HasHpfcEventTicketsWith(hpfceventticket.OwnerUserIDEQ(uid))).Order(ent.Desc(hpevent.FieldStartAt), ent.Asc(hpevent.FieldPrefecture))
	return q.Paginate(ctx, after, first, before, last)
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
	q := client.HPFeedItem.Query().Where(ps...).Order(ent.Desc(hpfeeditem.FieldPostAt))
	return q.Paginate(ctx, after, first, before, last)
}
