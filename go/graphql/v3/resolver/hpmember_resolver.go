package resolver

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/hpfollow"
	"github.com/yssk22/hpapp/go/service/ent/user"
)

// HPFeedItemResolver is a custom resolver to expose the follow status for the current user.
type HPMemberResolver struct{}

func (r *HPMemberResolver) MyFollowStatus(ctx context.Context, obj *ent.HPMember) (result *ent.HPFollow, err error) {
	var follow []*ent.HPFollow
	if fc := graphql.GetFieldContext(ctx); fc != nil && fc.Field.Alias != "" {
		follow, err = obj.NamedFollowedBy(graphql.GetFieldContext(ctx).Field.Alias)
	} else {
		follow, err = obj.Edges.FollowedByOrErr()
	}
	if ent.IsNotLoaded(err) {
		uid := appuser.CurrentEntUserID(ctx)
		follow, err = obj.QueryFollowedBy().Where(hpfollow.HasUserWith(user.IDEQ(uid))).All(ctx)
	}
	if len(follow) > 0 {
		return follow[0], nil
	}
	return nil, err
}
