package member

import (
	"context"
	"testing"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/object"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/bootstrap/test"
	"github.com/yssk22/hpapp/go/service/ent/hpmember"
	"github.com/yssk22/hpapp/go/service/ent/usernotificationsetting"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/helloproject/user"
	"github.com/yssk22/hpapp/go/service/push"
	"github.com/yssk22/hpapp/go/service/schema/enums"
)

func TestMember(t *testing.T) {
	test.New(
		"Followers",
		test.WithHPMaster(),
		test.WithAdmin(),
	).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		entClient := entutil.NewClient(ctx)
		mizuki := entClient.HPMember.Query().Where(hpmember.KeyEQ("mizuki_fukumura")).FirstX(ctx)

		userA := test.MakeTestUser(ctx)
		userB := test.MakeTestUser(ctx)
		userC := test.MakeTestUser(ctx)
		a.NotNil(user.UpsertFollow(ctx, appuser.EntID(userA), user.HPFollowUpsertParams{
			MemberId:   mizuki.ID,
			FollowType: enums.HPFollowTypeFollowWithNotification,
		}))
		a.NotNil(user.UpsertFollow(ctx, appuser.EntID(userB), user.HPFollowUpsertParams{
			MemberId:   mizuki.ID,
			FollowType: enums.HPFollowTypeFollowWithNotification,
		}))
		a.NotNil(user.UpsertFollow(ctx, appuser.EntID(userC), user.HPFollowUpsertParams{
			MemberId:   mizuki.ID,
			FollowType: enums.HPFollowTypeFollow,
		}))

		_, err := push.UpsertNotificationSettings(ctx, appuser.EntID(userA), "token1", push.NotificationSettings{
			Name: "my token",
			Slug: "hpapp",
		})
		a.Nil(err)
		_, err = push.UpsertNotificationSettings(ctx, appuser.EntID(userB), "token2", push.NotificationSettings{
			Name:           "my token",
			Slug:           "hpapp",
			EnableNewPosts: object.NullableFalse,
		})
		a.Nil(err)

		t.Run("GetFollowers", func(t *testing.T) {
			a := assert.NewTestAssert(t)
			followers, _ := GetFollowers(ctx, mizuki.ID, enums.HPFollowTypeFollowWithNotification)
			a.Equals(2, len(followers))
			followers, _ = GetFollowers(ctx, mizuki.ID, enums.HPFollowTypeFollow)
			a.Equals(1, len(followers))
			t.Run("Policy", func(t *testing.T) {
				a := assert.NewTestAssert(t)
				// userA should be able to see their own records, and they shouldn't see follow by others.
				followers, _ := GetFollowers(appuser.WithUser(ctx, userA), mizuki.ID, enums.HPFollowTypeFollowWithNotification)
				a.Equals(1, len(followers))
				followers, _ = GetFollowers(appuser.WithUser(ctx, userA), mizuki.ID, enums.HPFollowTypeFollow)
				a.Equals(0, len(followers))
			})
		})

		t.Run("GetFolllowerNotificationSettings", func(t *testing.T) {
			a := assert.NewTestAssert(t)
			settings, _ := GetFollowerNotificationSettings(ctx, mizuki.ID)
			a.Equals(2, len(settings))

			settings, _ = GetFollowerNotificationSettings(ctx, mizuki.ID, usernotificationsetting.EnableNewPosts(true))
			a.Equals(1, len(settings))

			t.Run("Policy", func(t *testing.T) {
				a := assert.NewTestAssert(t)
				settings, _ := GetFollowerNotificationSettings(appuser.WithUser(ctx, userA), mizuki.ID)
				a.Equals(1, len(settings))

				settings, _ = GetFollowerNotificationSettings(appuser.WithUser(ctx, userA), mizuki.ID, usernotificationsetting.EnableNewPosts(true))
				a.Equals(1, len(settings))

				settings, _ = GetFollowerNotificationSettings(appuser.WithUser(ctx, userB), mizuki.ID, usernotificationsetting.EnableNewPosts(true))
				a.Equals(0, len(settings))
			})
		})
	})

}
