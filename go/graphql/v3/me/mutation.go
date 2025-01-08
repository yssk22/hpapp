package me

import (
	"context"

	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/helloproject/elineupmall"
	"github.com/yssk22/hpapp/go/service/helloproject/feed"
	"github.com/yssk22/hpapp/go/service/helloproject/upfc"
	"github.com/yssk22/hpapp/go/service/helloproject/user"
	"github.com/yssk22/hpapp/go/service/push"
)

type MeMutation struct{}

func NewMutation(ctx context.Context) (*MeMutation, error) {
	_, err := appuser.Validate(ctx, appuser.Required())
	if err != nil {
		return nil, err
	}
	return &MeMutation{}, nil
}

func (h *MeMutation) Authenticate(ctx context.Context) (*ent.User, error) {
	return appuser.Authenticate(ctx)
}

func (h *MeMutation) RemoveAuthentication(ctx context.Context) (*ent.Auth, error) {
	return appuser.RemoveAuthentication(ctx)
}

func (h *MeMutation) Delete(ctx context.Context) (bool, error) {
	err := appuser.DeleteUser(ctx, appuser.CurrentUser(ctx).ID())
	return err == nil, err
}

func (h *MeMutation) UpsertNotificationToken(ctx context.Context, token string, params push.NotificationSettings) (*ent.UserNotificationSetting, error) {
	return push.UpsertNotificationSettings(ctx, appuser.EntID(appuser.CurrentUser(ctx)), token, params)
}

func (h *MeMutation) RemoveNotificationToken(ctx context.Context, tokenId int) (*ent.UserNotificationSetting, error) {
	return push.RemoveNotificationSettings(ctx, appuser.EntID(appuser.CurrentUser(ctx)), tokenId)
}

func (h *MeMutation) UpsertFollow(ctx context.Context, params user.HPFollowUpsertParams) (*ent.HPFollow, error) {
	return user.UpsertFollow(ctx, appuser.EntID(appuser.CurrentUser(ctx)), params)
}

func (h *MeMutation) UpsertEvents(ctx context.Context, params upfc.HPFCEventTicketApplicationUpsertParams) ([]*ent.HPEvent, error) {
	return upfc.UpsertEventsAndApplications(ctx, params)
}

func (h *MeMutation) UpsertViewHistory(ctx context.Context, params feed.HPViewHistoryUpsertParams) (*ent.HPViewHistory, error) {
	return feed.UpsertViewHistory(ctx, params)
}

func (h *MeMutation) UpsertElineupmallPurchaseHistories(ctx context.Context, params elineupmall.HPElineupMallItemPurchaseHistoryUpsertParams) ([]*ent.HPElineupMallItemPurchaseHistory, error) {
	return elineupmall.UpsertPurchaseHistories(ctx, params)
}

func (h *MeMutation) CreateSortHistory(ctx context.Context, params user.HPSortHistoryCreateParams) (*ent.HPSortHistory, error) {
	return user.CreateSortHistory(ctx, appuser.EntID(appuser.CurrentUser(ctx)), params)
}
