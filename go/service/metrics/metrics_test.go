package metrics

import (
	"context"
	"strconv"
	"testing"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/bootstrap/test"
	"github.com/yssk22/hpapp/go/service/entutil"
)

func TestMetricEnt(t *testing.T) {
	test.New(
		"Pulic Metric",
		test.WithHPMaster(),
		test.WithFixedTimestamp(),
	).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		adminCtx := appuser.WithAdmin(ctx)
		userCtx := appuser.WithUser(ctx, test.MakeTestUser(ctx))
		client := entutil.NewClient(ctx)
		created, err := client.Metric.Create().SetMetricName("test").SetDate("2020-01-01").SetValue(1.0).Save(adminCtx)
		a.Nil(err)

		// read
		_, err = client.Metric.Get(ctx, created.ID)
		a.NotNil(err) // guest cannot view.

		_, err = client.Metric.Get(userCtx, created.ID)
		a.Nil(err) // user can view view.

		_, err = client.Metric.Get(adminCtx, created.ID)
		a.Nil(err) // admin can view
	})

	test.New(
		"Private Metric",
		test.WithHPMaster(),
		test.WithFixedTimestamp(),
	).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		owner := test.MakeTestUser(ctx)
		oid, _ := strconv.Atoi(owner.ID())
		user := test.MakeTestUser(ctx)

		adminCtx := appuser.WithAdmin(ctx)
		ownerCtx := appuser.WithUser(ctx, owner)
		userCtx := appuser.WithUser(ctx, user)
		client := entutil.NewClient(ctx)
		created, err := client.Metric.Create().SetMetricName("test").SetDate("2020-01-01").SetValue(1.0).SetOwnerUserID(oid).Save(adminCtx)
		a.Nil(err)

		// read
		_, err = client.Metric.Get(ctx, created.ID)
		a.NotNil(err) // guest cannot view.

		_, err = client.Metric.Get(ownerCtx, created.ID)
		a.Nil(err) // owner can view.

		_, err = client.Metric.Get(userCtx, created.ID)
		a.NotNil(err) // other owner cannot view.

		_, err = client.Metric.Get(adminCtx, created.ID)
		a.Nil(err) // admin can view
	})

}
