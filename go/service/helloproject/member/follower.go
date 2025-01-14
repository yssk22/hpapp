package member

import (
	"context"

	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/hpfollow"
	"github.com/yssk22/hpapp/go/service/ent/hpmember"
	"github.com/yssk22/hpapp/go/service/ent/predicate"
	"github.com/yssk22/hpapp/go/service/ent/user"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/errors"
	"github.com/yssk22/hpapp/go/service/schema/enums"
)

// GetFollowers returns users who follows the member
func GetFollowers(ctx context.Context, memberId int, followType enums.HPFollowType) ([]*ent.User, error) {
	entclient := entutil.NewClient(ctx)
	followers, err := entclient.User.Query().Where(
		user.HasHpfollowWith(
			hpfollow.And(
				hpfollow.HasMemberWith(hpmember.IDEQ(memberId)),
				hpfollow.TypeEQ(followType),
			),
		),
	).All(ctx)
	return followers, errors.Wrap(ctx, err)
}

// GetFollowerNotificationSettings returns the all notification settings for the given user and the matched predicates.
// This function is intended to be utilzied for admins/systems to sent notification to their followers so you need to do `auth.WithAdmin(ctx)`
// before calling this function.
func GetFollowerNotificationSettings(ctx context.Context, memberId int, preds ...predicate.UserNotificationSetting) ([]*ent.UserNotificationSetting, error) {
	entclient := entutil.NewClient(ctx)
	users, err := entclient.User.Query().WithNotificationSettings(
		func(q *ent.UserNotificationSettingQuery) {
			q.Where(preds...)
		},
	).Where(
		user.HasHpfollowWith(
			hpfollow.And(
				hpfollow.HasMemberWith(hpmember.IDEQ(memberId)),
				hpfollow.TypeEQ(enums.HPFollowTypeFollowWithNotification),
			),
		),
		user.HasNotificationSettingsWith(preds...),
	).All(ctx)
	if err != nil {
		return nil, errors.Wrap(ctx, err)
	}
	var settings []*ent.UserNotificationSetting
	for _, user := range users {
		settings = append(settings, user.Edges.NotificationSettings...)
	}
	return settings, nil
}
