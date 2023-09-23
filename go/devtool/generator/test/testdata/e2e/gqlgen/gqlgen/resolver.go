package gqlgen

// THIS CODE IS A STARTING POINT ONLY. IT WILL NOT BE UPDATED WITH SCHEMA CHANGES.

import (
	"context"

	"github.com/yssk22/hpapp/go/devtool/generator/test/testdata/e2e/gqlgen"
	"github.com/yssk22/hpapp/go/devtool/generator/test/testdata/e2e/models"
)

type Resolver struct{}

// // foo
func (r *mutationResolver) ExampleMutation(ctx context.Context) (*models.MutationExample, error) {
	panic("not implemented")
}

// // foo
func (r *queryResolver) Node(ctx context.Context, id string) (models.Node, error) {
	panic("not implemented")
}

// // foo
func (r *queryResolver) QueryExample(ctx context.Context) (*models.TypeExample, error) {
	panic("not implemented")
}

// Mutation returns gqlgen.MutationResolver implementation.
func (r *Resolver) Mutation() gqlgen.MutationResolver { return &mutationResolver{r} }

// Query returns gqlgen.QueryResolver implementation.
func (r *Resolver) Query() gqlgen.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
