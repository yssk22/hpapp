package resolver

import (
	"context"
	"strconv"

	"github.com/yssk22/hpapp/go/foundation/slice"
	v3 "github.com/yssk22/hpapp/go/graphql/v3"
	"github.com/yssk22/hpapp/go/graphql/v3/generated"
	"github.com/yssk22/hpapp/go/graphql/v3/helloproject"
	"github.com/yssk22/hpapp/go/graphql/v3/me"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/entutil"
)

type Resolver struct{}

func (r *queryResolver) Node(ctx context.Context, id string) (ent.Noder, error) {
	entid, err := strconv.Atoi(id)
	if err != nil {
		return nil, err
	}
	return entutil.NewClient(ctx).Noder(ctx, entid)
}

func (r *queryResolver) Nodes(ctx context.Context, ids []string) ([]ent.Noder, error) {
	entids, err := slice.Map(ids, func(_ int, id string) (int, error) {
		return strconv.Atoi(id)
	})
	if err != nil {
		return nil, err
	}
	return entutil.NewClient(ctx).Noders(ctx, entids)
}

func (r *queryResolver) Helloproject(ctx context.Context) (*helloproject.HelloProjectQuery, error) {
	return &helloproject.HelloProjectQuery{}, nil
}

func (r *queryResolver) Me(ctx context.Context) (*me.MeQuery, error) {
	return &me.MeQuery{}, nil
}

// Query returns QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver           { return &queryResolver{r} }
func (r *Resolver) Mutation() generated.MutationResolver     { return &v3.Mutation{} }
func (r *Resolver) HPEvent() generated.HPEventResolver       { return &HPEventResolver{} }
func (r *Resolver) HPFeedItem() generated.HPFeedItemResolver { return &HPFeedItemResolver{} }

type queryResolver struct{ *Resolver }
