package user

import (
	"context"
	"testing"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/service/auth/appuser"
	"hpapp.yssk22.dev/go/service/auth/client"
	"hpapp.yssk22.dev/go/service/bootstrap/test"
	"hpapp.yssk22.dev/go/service/entutil"
)

func TestHPSortHistory(t *testing.T) {
	test.New(
		"CreateSortHistory",
		test.WithHPMaster(),
		test.WithUser(),
	).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		myId := appuser.CurrentEntUserID(ctx)
		_, err := CreateSortHistory(ctx, myId, HPSortHistoryCreateParams{})
		a.Nil(err)

		entclient := entutil.NewClient(ctx)
		num := entclient.HPSortHistory.Query().CountX(ctx)
		a.Equals(1, num)

		t.Run("policy", func(t *testing.T) {
			t.Run("ownership", func(t *testing.T) {
				a := assert.NewTestAssert(t)
				ctx := client.WithClient(ctx, client.Anonymous())
				userA := test.MakeTestUser(ctx)
				_, err = CreateSortHistory(ctx, appuser.EntID(userA), HPSortHistoryCreateParams{})
				a.NotNil(err)

				// userA shouldn't be able to read the sort result by the current user.
				num := entclient.HPSortHistory.Query().CountX(appuser.WithUser(ctx, userA))
				a.Equals(0, num)
			})
			t.Run("anonymous client", func(t *testing.T) {
				a := assert.NewTestAssert(t)
				ctx := client.WithClient(ctx, client.Anonymous())
				_, err = CreateSortHistory(ctx, myId, HPSortHistoryCreateParams{})
				a.NotNil(err)
			})
		})
	})
}
