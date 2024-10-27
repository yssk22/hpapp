package client

import (
	"context"
	"fmt"

	"github.com/yssk22/hpapp/go/service/ent/privacy"
)

func DenyIfNonVerifiedClient() privacy.QueryMutationRule {
	return privacy.ContextQueryMutationRule(func(ctx context.Context) error {
		current := CurrentClient(ctx)
		if !current.IsVerified(ctx) {
			return fmt.Errorf("invalid client (name:%s)", current.Name())
		}
		return privacy.Skip
	})
}
