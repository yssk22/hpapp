package authtest

import (
	"context"
	"testing"
	"time"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/foundation/timeutil"
	"hpapp.yssk22.dev/go/service/auth/appuser"
	"hpapp.yssk22.dev/go/service/bootstrap/test"
	"hpapp.yssk22.dev/go/system/settings"
)

func TestTokenResolver(t *testing.T) {
	test.New(
		"Issue and Parse",
		test.WithContextTime(time.Date(2022, 10, 18, 0, 0, 0, 0, timeutil.JST)),
	).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		u := test.MakeTestUser(ctx)
		token, err := appuser.IssueToken(ctx, u)
		a.Nil(err)
		claims, err := appuser.ParseToken(ctx, token)
		a.Nil(err)
		a.Equals(u.ID(), claims.ID())
		a.Equals(u.Username(), claims.Username())
		a.Equals("JWT Token Provider", claims.ProviderName())
	})

	test.New(
		"expired token",
		test.WithContextTime(time.Date(2022, 10, 18, 0, 0, 0, 0, timeutil.JST)),
	).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		a.Nil(settings.Set(ctx, appuser.JWTExpiry, time.Duration(0)))
		u := test.MakeTestUser(ctx)
		token, err := appuser.IssueToken(ctx, u)
		a.Nil(err)
		// we cannot use clock.SetNow() as the jwt library is using time.Now() directly
		time.Sleep(1 * time.Second)
		_, err = appuser.ParseToken(ctx, token)
		a.NotNil(err)
		a.Equals(appuser.ErrInvalidToken, err)
	})

	test.New(
		"update the key",
		test.WithContextTime(time.Date(2022, 10, 18, 0, 0, 0, 0, timeutil.JST)),
	).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		u := test.MakeTestUser(ctx)
		token, err := appuser.IssueToken(ctx, u)
		a.Nil(err)
		a.Nil(settings.Set(ctx, appuser.JWTSignKey, "risa.irie.20051018"))
		_, err = appuser.ParseToken(ctx, token)
		a.NotNil(err)
		a.Equals(appuser.ErrInvalidToken, err)
	})

}
