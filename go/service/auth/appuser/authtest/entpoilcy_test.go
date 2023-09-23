package authtest

import (
	"context"
	"testing"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/bootstrap/test"
	"github.com/yssk22/hpapp/go/service/entutil"
)

func TestEntPolicy(t *testing.T) {
	test.New("canSeeOnlyMe").Run(t, func(ctx context.Context, t *testing.T) {
		// This rule is a special rule for ent.User only. see implemntation in the schema fire but we test here.
		a := assert.NewTestAssert(t)
		client := entutil.NewClient(ctx)
		mizuki, _ := appuser.ToEnt(test.MakeTestUser(ctx))
		miuzkiCtx := appuser.WithUser(ctx, appuser.EntUser(mizuki))
		risa, _ := appuser.ToEnt(test.MakeTestUser(ctx))

		_, err := client.User.Get(ctx, mizuki.ID)
		a.NotNil(err)
		_, err = client.User.Get(ctx, risa.ID)
		a.NotNil(err)

		obj, err := client.User.Get(miuzkiCtx, mizuki.ID)
		a.Nil(err)
		a.Equals(mizuki.ID, obj.ID)

		_, err = client.User.Get(miuzkiCtx, risa.ID)
		a.NotNil(err)

		adminCtx := appuser.WithAdmin(ctx)
		_, err = client.User.Get(adminCtx, mizuki.ID)
		a.Nil(err)
		_, err = client.User.Get(adminCtx, risa.ID)
		a.Nil(err)
	})

	test.New("CanSeeOnlyMine").Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		adminCtx := appuser.WithAdmin(ctx)
		mizuki, _ := appuser.ToEnt(test.MakeTestUser(ctx))
		risa, _ := appuser.ToEnt(test.MakeTestUser(ctx))
		mizukiCtx := appuser.WithUser(ctx, appuser.EntUser(mizuki))
		risaCtx := appuser.WithUser(ctx, appuser.EntUser(risa))

		client := entutil.NewClient(ctx)
		authrecord := client.Auth.Create().
			SetProviderName("test").
			SetProviderUserID("me").
			SetAccessToken("access").
			SetRefreshToken("refresh").
			SetUserID(mizuki.ID).
			SaveX(ctx)

		_, err := client.Auth.Get(mizukiCtx, authrecord.ID)
		a.Nil(err)
		a.Equals(1, client.Auth.Query().CountX(mizukiCtx))

		_, err = client.Auth.Get(adminCtx, authrecord.ID)
		a.Nil(err)
		a.Equals(1, client.Auth.Query().CountX(adminCtx))

		_, err = client.Auth.Get(risaCtx, authrecord.ID)
		a.NotNil(err)
		a.Equals(0, client.Auth.Query().CountX(risaCtx))
	})
}
