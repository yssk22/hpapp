package resolver

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/hpviewhistory"
	"github.com/yssk22/hpapp/go/service/ent/user"
)

// HPFeedItemResolver is a custom resolver to cusotmize the edge between HPFeedItem and HPViewHistory not to leak view histories not owned by the current user.
type HPFeedItemResolver struct{}

func (r *HPFeedItemResolver) MyViewHistory(ctx context.Context, obj *ent.HPFeedItem) (result *ent.HPViewHistory, err error) {
	var histories []*ent.HPViewHistory
	if fc := graphql.GetFieldContext(ctx); fc != nil && fc.Field.Alias != "" {
		histories, err = obj.NamedViewHistories(graphql.GetFieldContext(ctx).Field.Alias)
	} else {
		histories, err = obj.Edges.ViewHistoriesOrErr()
	}
	if ent.IsNotLoaded(err) {
		uid := appuser.CurrentEntUserID(ctx)
		histories, err = obj.QueryViewHistories().Where(hpviewhistory.HasUserWith(user.IDEQ(uid))).All(ctx)
	}
	if len(histories) > 0 {
		return histories[0], nil
	}
	return nil, err
}
