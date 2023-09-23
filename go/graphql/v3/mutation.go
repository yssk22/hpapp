package v3

import (
	"context"

	"github.com/yssk22/hpapp/go/graphql/v3/me"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/ent"
)

type Mutation struct{}

func (m *Mutation) Authenticate(ctx context.Context) (*ent.User, error) {
	return appuser.Authenticate(ctx)
}

func (m *Mutation) Me(ctx context.Context) (*me.MeMutation, error) {
	return me.NewMutation(ctx)
}
