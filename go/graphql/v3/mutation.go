package v3

import (
	"context"

	"hpapp.yssk22.dev/go/graphql/v3/me"
	"hpapp.yssk22.dev/go/service/auth/appuser"
	"hpapp.yssk22.dev/go/service/ent"
)

type Mutation struct{}

func (m *Mutation) Authenticate(ctx context.Context) (*ent.User, error) {
	return appuser.Authenticate(ctx)
}

func (m *Mutation) Me(ctx context.Context) (*me.MeMutation, error) {
	return me.NewMutation(ctx)
}
