package test

import (
	"context"
	"testing"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/ent/hpmember"
	"github.com/yssk22/hpapp/go/service/entutil"
)

func TestRun(t *testing.T) {
	New("no-master").Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		entclient := entutil.NewClient(ctx)
		a.Equals(0, entclient.HPArtist.Query().CountX(ctx))
		a.Equals(0, entclient.HPMember.Query().CountX(ctx))
		a.Equals(0, entclient.HPAsset.Query().CountX(ctx))
	})

	New("with-hp-master", WithHPMaster()).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		entclient := entutil.NewClient(ctx)
		a.OK(entclient.HPArtist.Query().CountX(ctx) > 0)
		a.OK(entclient.HPMember.Query().CountX(ctx) > 0)
		a.OK(entclient.HPAsset.Query().CountX(ctx) > 0)

		// edge is created
		mizuki := entclient.HPMember.Query().WithAssets().Where(hpmember.KeyEQ("mizuki_fukumura")).FirstX(ctx)
		a.NotNil(mizuki)
		a.OK(len(mizuki.Edges.Assets) > 0)
	})
}

func TestMakeUser(t *testing.T) {
	New("create").Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		u := MakeTestUser(ctx)
		a.NotNil(u)
		entclient := entutil.NewClient(ctx)
		a.Equals(1, entclient.User.Query().CountX(appuser.WithAdmin(ctx)))
	})

	New("no-user").Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		entclient := entutil.NewClient(ctx)
		a.Equals(0, entclient.User.Query().CountX(appuser.WithAdmin(ctx)))
	})

	New("default user").Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		a.OK(appuser.CurrentUser(ctx).IsGuest(appuser.WithAdmin(ctx)))
	})

	New("with-user", WithUser()).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		a.OK(!appuser.CurrentUser(ctx).IsGuest(ctx))
	})

	New("with-admin", WithAdmin()).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		a.OK(appuser.CurrentUser(ctx).IsAdmin(ctx))
	})

}
