package push

import (
	"context"

	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/hpartist"
	"github.com/yssk22/hpapp/go/service/ent/hpfollow"
	"github.com/yssk22/hpapp/go/service/ent/hpmember"
	"github.com/yssk22/hpapp/go/service/ent/predicate"
	"github.com/yssk22/hpapp/go/service/ent/user"
	"github.com/yssk22/hpapp/go/service/ent/usernotificationsetting"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/errors"
	"github.com/yssk22/hpapp/go/service/schema/enums"
)

type NotificationSettings struct {
	Name               string
	Slug               string
	EnableNewPosts     *bool
	EnablePaymentStart *bool
	EnablePaymentDue   *bool
}

// GetNoficationSettings returns the all notification settings for the pair of userId and slug.
func GetNotificationSettings(ctx context.Context, userId int, slug string) ([]*ent.UserNotificationSetting, error) {
	entclient := entutil.NewClient(ctx)
	all, err := entclient.UserNotificationSetting.Query().Where(
		usernotificationsetting.SlugEQ(slug),
		usernotificationsetting.HasUserWith(user.IDEQ(userId)),
	).All(ctx)
	return all, errors.Wrap(ctx, err)
}

// GetFollowerNotifications returns the all notification settings for the people who follow the member or the artist.
func GetFollowerNotifications(ctx context.Context, artistIdOrMemberId int, ps ...predicate.UserNotificationSetting) ([]*ent.UserNotificationSetting, error) {
	entclient := entutil.NewClient(ctx)
	users, err := entclient.User.Query().WithNotificationSettings(
		// a user might have multiple settings with different configurations so make sure to apply the ps condition not to take unnecessary settings.
		func(q *ent.UserNotificationSettingQuery) {
			q.Where(ps...)
		},
	).Where(
		user.HasHpfollowWith(
			hpfollow.Or(
				hpfollow.And(
					hpfollow.HasMemberWith(hpmember.IDEQ(artistIdOrMemberId)),
					hpfollow.TypeEQ(enums.HPFollowTypeFollowWithNotification),
				),
				hpfollow.And(
					hpfollow.HasArtistWith(hpartist.IDEQ(artistIdOrMemberId)),
					hpfollow.TypeEQ(enums.HPFollowTypeFollowWithNotification),
				),
			),
		),
		user.HasNotificationSettingsWith(ps...),
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

// UpsertNotification upserts the notification settings record for the pair of userId and slug.
func UpsertNotificationSettings(ctx context.Context, uid int, token string, params NotificationSettings) (*ent.UserNotificationSetting, error) {
	entclient := entutil.NewClient(ctx)
	create := entclient.UserNotificationSetting.Create().
		SetUserID(uid).
		SetToken(token).
		SetName(params.Name).
		SetSlug(params.Slug)
	if params.EnableNewPosts != nil {
		create.SetEnableNewPosts(*params.EnableNewPosts)
	} else {
		create.SetEnableNewPosts(true)
	}
	if params.EnablePaymentStart != nil {
		create.SetEnablePaymentStart(*params.EnablePaymentStart)
	} else {
		create.SetEnablePaymentStart(true)
	}
	if params.EnablePaymentDue != nil {
		create.SetEnablePaymentDue(*params.EnablePaymentDue)
	} else {
		create.SetEnablePaymentDue(true)
	}

	upsert := create.OnConflictColumns(usernotificationsetting.FieldToken).
		SetOwnerUserID(uid).
		SetName(params.Name)
	if params.EnableNewPosts != nil {
		upsert.SetEnableNewPosts(*params.EnableNewPosts)
	}
	if params.EnablePaymentStart != nil {
		upsert.SetEnablePaymentStart(*params.EnablePaymentStart)
	}
	if params.EnablePaymentDue != nil {
		upsert.SetEnablePaymentDue(*params.EnablePaymentDue)
	}
	tokenId, err := upsert.ID(ctx)
	if err != nil {
		return nil, errors.Wrap(ctx, err)
	}
	s, err := entclient.UserNotificationSetting.Get(ctx, tokenId)
	return s, errors.Wrap(ctx, err)
}

// RemoveNotificationSettings removes the notification settings completely.
// Users can opt out notification by OS settings so this function is just for cleaning up purpose.
func RemoveNotificationSettings(ctx context.Context, uid int, tokenId int) (*ent.UserNotificationSetting, error) {
	entclient := entutil.NewClient(ctx)
	ent, err := entclient.UserNotificationSetting.Get(ctx, tokenId)
	if err != nil {
		return nil, err
	}
	err = entclient.UserNotificationSetting.DeleteOne(ent).Exec(ctx)
	return ent, err
}
