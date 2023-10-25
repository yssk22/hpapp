package resolver

import (
	"context"
	"fmt"
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
	if id == "helloproject" {
		return &helloproject.HelloProjectQuery{}, nil
	}
	entid, err := strconv.Atoi(id)
	if err != nil {
		return nil, fmt.Errorf("not a valid node id")
	}
	return entutil.NewClient(ctx).Noder(ctx, entid)
}

// TODO: this might cause the performance issue if a client requests too many id
func (r *queryResolver) Nodes(ctx context.Context, ids []string) ([]ent.Noder, error) {
	return slice.Map(ids, func(_ int, id string) (ent.Noder, error) {
		return r.Node(ctx, id)
	})
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
