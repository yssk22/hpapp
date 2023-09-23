package user

import (
	"context"
	"testing"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/service/auth/appuser"
	"hpapp.yssk22.dev/go/service/bootstrap/test"
	"hpapp.yssk22.dev/go/service/ent/hpmember"
	"hpapp.yssk22.dev/go/service/entutil"
	"hpapp.yssk22.dev/go/service/schema/enums"
)

func TestHPFollow(t *testing.T) {
	test.New(
		"GetFollowings",
		test.WithHPMaster(),
		test.WithUser(),
	).Run(t, func(ctx context.Context, tt *testing.T) {
		a := assert.NewTestAssert(tt)
		myId := appuser.CurrentEntUserID(ctx)
		followings, _ := GetFollowings(ctx, myId)
		a.Equals(0, len(followings))

		entclient := entutil.NewClient(ctx)
		mizuki := entclient.HPMember.Query().Where(hpmember.KeyEQ("mizuki_fukumura")).FirstX(ctx)
		risa := entclient.HPMember.Query().Where(hpmember.KeyEQ("risa_irie")).FirstX(ctx)
		reina := entclient.HPMember.Query().Where(hpmember.KeyEQ("reina_yokoyama")).FirstX(ctx)
		a.NotNil(UpsertFollow(ctx, myId, HPFollowUpsertParams{
			MemberId:   mizuki.ID,
			FollowType: enums.HPFollowTypeFollowWithNotification,
		}))
		a.NotNil(UpsertFollow(ctx, myId, HPFollowUpsertParams{
			MemberId:   risa.ID,
			FollowType: enums.HPFollowTypeFollowWithNotification,
		}))
		a.NotNil(UpsertFollow(ctx, myId, HPFollowUpsertParams{
			MemberId:   reina.ID,
			FollowType: enums.HPFollowTypeFollow,
		}))
		followings, _ = GetFollowings(ctx, myId)
		a.Equals(3, len(followings))
	})

	test.New(
		"UpsertFollow",
		test.WithHPMaster(),
		test.WithUser(),
	).Run(t, func(ctx context.Context, tt *testing.T) {
		a := assert.NewTestAssert(tt)
		entclient := entutil.NewClient(ctx)
		mizuki := entclient.HPMember.Query().Where(hpmember.KeyEQ("mizuki_fukumura")).FirstX(ctx)
		myId := appuser.CurrentEntUserID(ctx)

		// create a follow record
		a.Equals(0, mizuki.QueryFollowedBy().CountX(ctx))
		_, err := UpsertFollow(ctx, myId, HPFollowUpsertParams{
			MemberId:   mizuki.ID,
			FollowType: enums.HPFollowTypeFollowWithNotification,
		})
		a.Nil(err)
		a.Equals(1, mizuki.QueryFollowedBy().CountX(ctx))
		follow := mizuki.QueryFollowedBy().WithUser().FirstX(ctx)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.Type)
		a.Equals(myId, follow.Edges.User.ID)

		// if the same type is passed, nothing updated
		_, err = UpsertFollow(ctx, myId, HPFollowUpsertParams{
			MemberId:   mizuki.ID,
			FollowType: enums.HPFollowTypeFollowWithNotification,
		})
		a.Nil(err)
		a.Nil(err)
		a.Equals(1, mizuki.QueryFollowedBy().CountX(ctx))
		follow = mizuki.QueryFollowedBy().WithUser().FirstX(ctx)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.Type)
		a.Equals(myId, follow.Edges.User.ID)

		// change the type
		_, err = UpsertFollow(ctx, myId, HPFollowUpsertParams{
			MemberId:   mizuki.ID,
			FollowType: enums.HPFollowTypeFollow,
		})
		a.Nil(err)
		a.Equals(1, mizuki.QueryFollowedBy().CountX(ctx))
		follow = mizuki.QueryFollowedBy().WithUser().FirstX(ctx)
		a.Equals(enums.HPFollowTypeFollow, follow.Type)
		a.Equals(myId, follow.Edges.User.ID)
	})
}
