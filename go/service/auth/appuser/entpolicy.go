package appuser

import (
	"context"
	"fmt"
	"strconv"

	"entgo.io/ent/entql"
	"hpapp.yssk22.dev/go/service/ent"
	"hpapp.yssk22.dev/go/service/ent/privacy"
	"hpapp.yssk22.dev/go/service/errors"
)

func AlwaysAllow() privacy.QueryMutationRule {
	return privacy.ContextQueryMutationRule(func(ctx context.Context) error {
		return privacy.Allow
	})
}

func AlwaysDeny() privacy.QueryMutationRule {
	return privacy.ContextQueryMutationRule(func(ctx context.Context) error {
		return privacy.Deny
	})
}

func AlloIfAdmin() privacy.QueryMutationRule {
	return privacy.ContextQueryMutationRule(func(ctx context.Context) error {
		current := CurrentUser(ctx)
		if current.IsAdmin(ctx) {
			return privacy.Allow
		}
		return privacy.Skip
	})
}

func DenyIfGuest() privacy.QueryMutationRule {
	return privacy.ContextQueryMutationRule(func(ctx context.Context) error {
		current := CurrentUser(ctx)
		if current.IsGuest(ctx) {
			return ErrNotAuthorized
		}
		return privacy.Skip
	})
}

// CanSeeOnlyMine is a privacy filter rule that ensure the current user access the records that belongs to them.
// This rule requires "owner_user_id" filed in the schema
func CanSeeOnlyMine() privacy.QueryRule {
	return privacy.FilterFunc(func(ctx context.Context, f privacy.Filter) error {
		uid, err := strconv.Atoi(CurrentUser(ctx).ID())
		if err != nil {
			return ErrAuthenticationRequired
		}
		af, ok := f.(interface {
			WhereOwnerUserID(entql.IntP)
		})
		if !ok {
			return errors.Wrap(ctx, fmt.Errorf("invalid filter applied: %#v", f))
		}
		af.WhereOwnerUserID(entql.IntEQ(uid))
		return privacy.Skip
	})
}

// CanMutateOnlyMine is a mutation rule that checks `userIdField`` value is equals to the current user id.
// `userIdField` has to be a storage key, not a virtual edge field name.
func CanMutateOnlyMine(userIdField string) privacy.MutationRule {
	return privacy.MutationRuleFunc(func(ctx context.Context, m ent.Mutation) error {
		v, ok := m.Field(userIdField)
		if !ok {
			return privacy.Deny
		}
		uid := CurrentEntUserID(ctx)
		if v != uid {
			return ErrNotAuthorized
		}
		return privacy.Allow
	})
}
