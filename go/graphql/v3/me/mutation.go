package me

import (
	"context"

	"hpapp.yssk22.dev/go/service/auth/appuser"
	"hpapp.yssk22.dev/go/service/ent"
	"hpapp.yssk22.dev/go/service/helloproject/feed"
	"hpapp.yssk22.dev/go/service/helloproject/upfc"
	"hpapp.yssk22.dev/go/service/helloproject/user"
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

func (h *MeMutation) UpsertFollow(ctx context.Context, params user.HPFollowUpsertParams) (*ent.HPFollow, error) {
	return user.UpsertFollow(ctx, appuser.EntID(appuser.CurrentUser(ctx)), params)
}

func (h *MeMutation) UpsertEvents(ctx context.Context, params upfc.UpsertEventsParams) ([]*ent.HPEvent, error) {
	return upfc.UpsertEventsAndApplications(ctx, params)
}

func (h *MeMutation) UpsertViewHistory(ctx context.Context, params feed.HPViewHistoryUpsertParams) (*ent.HPViewHistory, error) {
	return feed.UpsertViewHistory(ctx, params)
}
