package authtest

import (
	"context"
	"testing"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/service/auth/appuser"
	"hpapp.yssk22.dev/go/service/bootstrap/test"
)

func TestValidator(t *testing.T) {
	test.New("Required").Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		_, err := appuser.Validate(ctx, appuser.Required())
		a.Equals(appuser.ErrAuthenticationRequired, err)
		_, err = appuser.Validate(ctx, appuser.AdminRequired())
		a.Equals(appuser.ErrAdminAuthenticationRequired, err)

		mizuki := test.MakeTestUser(ctx)
		ctx = appuser.WithUser(ctx, mizuki)
		who, err := appuser.Validate(ctx, appuser.Required())
		a.Nil(err)
		a.Equals(mizuki, who)

		_, err = appuser.Validate(ctx, appuser.AdminRequired())
		a.Equals(appuser.ErrAdminAuthenticationRequired, err)
	})

	test.New("AdminRequired", test.WithAdmin()).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		_, err := appuser.Validate(ctx, appuser.AdminRequired())
		a.Nil(err)
	})

	test.New("Match", test.WithUser()).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		u := appuser.CurrentUser(ctx)
		_, err := appuser.Validate(ctx, appuser.MatchIDs("-1"))
		a.Equals(appuser.ErrNotAuthorized, err)
		_, err = appuser.Validate(ctx, appuser.MatchIDs(u.ID()))
		a.Nil(err)
	})

	test.New("Or", test.WithUser()).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		u := appuser.CurrentUser(ctx)
		_, err := appuser.Validate(ctx,
			appuser.AdminRequired(), appuser.Or(
				appuser.MatchIDs(u.ID()),
			),
		)
		a.Nil(err)
	})

}
