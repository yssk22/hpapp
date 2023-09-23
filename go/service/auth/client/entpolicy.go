package client

import (
	"context"
	"errors"

	"github.com/yssk22/hpapp/go/service/ent/privacy"
)

var (
	ErrNotAuthorized = errors.New("not authorized")
)

func DenyIfNonVerifiedClient() privacy.QueryMutationRule {
	return privacy.ContextQueryMutationRule(func(ctx context.Context) error {
		current := CurrentClient(ctx)
		if !current.IsVerified(ctx) {
			return ErrNotAuthorized
		}
		return privacy.Skip
	})
}
