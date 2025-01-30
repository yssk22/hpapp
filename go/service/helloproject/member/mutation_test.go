package member

import (
	"context"
	"testing"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/bootstrap/test"
	"github.com/yssk22/hpapp/go/service/ent/hpmember"
	"github.com/yssk22/hpapp/go/service/entutil"
)

func TestUpdateMemberAttributes(t *testing.T) {
	test.New(
		"Policy",
		test.WithHPMaster(),
	).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		entClient := entutil.NewClient(ctx)
		mizuki := entClient.HPMember.Query().Where(hpmember.KeyEQ("mizuki_fukumura")).FirstX(ctx)
		_, err := UpdateMemberAttributes(appuser.WithUser(ctx, appuser.Guest()), HPMemberUpdateParams{
			MemberID:  mizuki.ID,
			ColorRGB:  "#ff69b4",
			ColorName: "ホットピンク",
		})
		a.NotNil(err)

		_, err = UpdateMemberAttributes(appuser.WithUser(ctx, appuser.SuperAdmin()), HPMemberUpdateParams{
			MemberID:  mizuki.ID,
			ColorRGB:  "#ff69b4",
			ColorName: "ホットピンク",
		})
		a.Nil(err)
	})
}
