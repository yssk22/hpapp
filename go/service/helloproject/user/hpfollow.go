package user

import (
	"context"

	"hpapp.yssk22.dev/go/service/ent"
	"hpapp.yssk22.dev/go/service/ent/hpfollow"
	"hpapp.yssk22.dev/go/service/ent/user"
	"hpapp.yssk22.dev/go/service/entutil"
	"hpapp.yssk22.dev/go/service/errors"
	"hpapp.yssk22.dev/go/service/schema/enums"
)

// GetFollowings returns HPFollow which the user follows
func GetFollowings(ctx context.Context, userId int) ([]*ent.HPFollow, error) {
	entclient := entutil.NewClient(ctx)
	// TODO: cache
	follows, err := entclient.HPFollow.Query().WithMember().Where(hpfollow.HasUserWith(user.IDEQ(userId))).All(ctx)
	return follows, errors.Wrap(ctx, err)
}

type HPFollowUpsertParams struct {
	MemberId   int
	FollowType enums.HPFollowType
}

// UpsertFollow upserts the follow record for the given userid. This function can be used to update the follow type.
func UpsertFollow(ctx context.Context, userId int, params HPFollowUpsertParams) (*ent.HPFollow, error) {
	entclient := entutil.NewClient(ctx)
	followId, err := entclient.HPFollow.Create().
		SetUserID(userId).
		SetMemberID(params.MemberId).
		SetType(params.FollowType).
		OnConflictColumns(hpfollow.UserColumn, hpfollow.MemberColumn).
		SetType(params.FollowType).ID(ctx)
	if err != nil {
		return nil, errors.Wrap(ctx, err)
	}
	follow, err := entclient.HPFollow.Get(ctx, followId)
	return follow, errors.Wrap(ctx, err)
}
