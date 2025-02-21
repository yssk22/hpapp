// Code generated by ent, DO NOT EDIT.

package hook

import (
	"context"
	"fmt"

	"github.com/yssk22/hpapp/go/service/ent"
)

// The AuthFunc type is an adapter to allow the use of ordinary
// function as Auth mutator.
type AuthFunc func(context.Context, *ent.AuthMutation) (ent.Value, error)

// Mutate calls f(ctx, m).
func (f AuthFunc) Mutate(ctx context.Context, m ent.Mutation) (ent.Value, error) {
	if mv, ok := m.(*ent.AuthMutation); ok {
		return f(ctx, mv)
	}
	return nil, fmt.Errorf("unexpected mutation type %T. expect *ent.AuthMutation", m)
}

// The HPAmebloPostFunc type is an adapter to allow the use of ordinary
// function as HPAmebloPost mutator.
type HPAmebloPostFunc func(context.Context, *ent.HPAmebloPostMutation) (ent.Value, error)

// Mutate calls f(ctx, m).
func (f HPAmebloPostFunc) Mutate(ctx context.Context, m ent.Mutation) (ent.Value, error) {
	if mv, ok := m.(*ent.HPAmebloPostMutation); ok {
		return f(ctx, mv)
	}
	return nil, fmt.Errorf("unexpected mutation type %T. expect *ent.HPAmebloPostMutation", m)
}

// The HPArtistFunc type is an adapter to allow the use of ordinary
// function as HPArtist mutator.
type HPArtistFunc func(context.Context, *ent.HPArtistMutation) (ent.Value, error)

// Mutate calls f(ctx, m).
func (f HPArtistFunc) Mutate(ctx context.Context, m ent.Mutation) (ent.Value, error) {
	if mv, ok := m.(*ent.HPArtistMutation); ok {
		return f(ctx, mv)
	}
	return nil, fmt.Errorf("unexpected mutation type %T. expect *ent.HPArtistMutation", m)
}

// The HPAssetFunc type is an adapter to allow the use of ordinary
// function as HPAsset mutator.
type HPAssetFunc func(context.Context, *ent.HPAssetMutation) (ent.Value, error)

// Mutate calls f(ctx, m).
func (f HPAssetFunc) Mutate(ctx context.Context, m ent.Mutation) (ent.Value, error) {
	if mv, ok := m.(*ent.HPAssetMutation); ok {
		return f(ctx, mv)
	}
	return nil, fmt.Errorf("unexpected mutation type %T. expect *ent.HPAssetMutation", m)
}

// The HPBlobFunc type is an adapter to allow the use of ordinary
// function as HPBlob mutator.
type HPBlobFunc func(context.Context, *ent.HPBlobMutation) (ent.Value, error)

// Mutate calls f(ctx, m).
func (f HPBlobFunc) Mutate(ctx context.Context, m ent.Mutation) (ent.Value, error) {
	if mv, ok := m.(*ent.HPBlobMutation); ok {
		return f(ctx, mv)
	}
	return nil, fmt.Errorf("unexpected mutation type %T. expect *ent.HPBlobMutation", m)
}

// The HPElineupMallItemFunc type is an adapter to allow the use of ordinary
// function as HPElineupMallItem mutator.
type HPElineupMallItemFunc func(context.Context, *ent.HPElineupMallItemMutation) (ent.Value, error)

// Mutate calls f(ctx, m).
func (f HPElineupMallItemFunc) Mutate(ctx context.Context, m ent.Mutation) (ent.Value, error) {
	if mv, ok := m.(*ent.HPElineupMallItemMutation); ok {
		return f(ctx, mv)
	}
	return nil, fmt.Errorf("unexpected mutation type %T. expect *ent.HPElineupMallItemMutation", m)
}

// The HPElineupMallItemPurchaseHistoryFunc type is an adapter to allow the use of ordinary
// function as HPElineupMallItemPurchaseHistory mutator.
type HPElineupMallItemPurchaseHistoryFunc func(context.Context, *ent.HPElineupMallItemPurchaseHistoryMutation) (ent.Value, error)

// Mutate calls f(ctx, m).
func (f HPElineupMallItemPurchaseHistoryFunc) Mutate(ctx context.Context, m ent.Mutation) (ent.Value, error) {
	if mv, ok := m.(*ent.HPElineupMallItemPurchaseHistoryMutation); ok {
		return f(ctx, mv)
	}
	return nil, fmt.Errorf("unexpected mutation type %T. expect *ent.HPElineupMallItemPurchaseHistoryMutation", m)
}

// The HPEventFunc type is an adapter to allow the use of ordinary
// function as HPEvent mutator.
type HPEventFunc func(context.Context, *ent.HPEventMutation) (ent.Value, error)

// Mutate calls f(ctx, m).
func (f HPEventFunc) Mutate(ctx context.Context, m ent.Mutation) (ent.Value, error) {
	if mv, ok := m.(*ent.HPEventMutation); ok {
		return f(ctx, mv)
	}
	return nil, fmt.Errorf("unexpected mutation type %T. expect *ent.HPEventMutation", m)
}

// The HPFCEventTicketFunc type is an adapter to allow the use of ordinary
// function as HPFCEventTicket mutator.
type HPFCEventTicketFunc func(context.Context, *ent.HPFCEventTicketMutation) (ent.Value, error)

// Mutate calls f(ctx, m).
func (f HPFCEventTicketFunc) Mutate(ctx context.Context, m ent.Mutation) (ent.Value, error) {
	if mv, ok := m.(*ent.HPFCEventTicketMutation); ok {
		return f(ctx, mv)
	}
	return nil, fmt.Errorf("unexpected mutation type %T. expect *ent.HPFCEventTicketMutation", m)
}

// The HPFeedItemFunc type is an adapter to allow the use of ordinary
// function as HPFeedItem mutator.
type HPFeedItemFunc func(context.Context, *ent.HPFeedItemMutation) (ent.Value, error)

// Mutate calls f(ctx, m).
func (f HPFeedItemFunc) Mutate(ctx context.Context, m ent.Mutation) (ent.Value, error) {
	if mv, ok := m.(*ent.HPFeedItemMutation); ok {
		return f(ctx, mv)
	}
	return nil, fmt.Errorf("unexpected mutation type %T. expect *ent.HPFeedItemMutation", m)
}

// The HPFollowFunc type is an adapter to allow the use of ordinary
// function as HPFollow mutator.
type HPFollowFunc func(context.Context, *ent.HPFollowMutation) (ent.Value, error)

// Mutate calls f(ctx, m).
func (f HPFollowFunc) Mutate(ctx context.Context, m ent.Mutation) (ent.Value, error) {
	if mv, ok := m.(*ent.HPFollowMutation); ok {
		return f(ctx, mv)
	}
	return nil, fmt.Errorf("unexpected mutation type %T. expect *ent.HPFollowMutation", m)
}

// The HPIgPostFunc type is an adapter to allow the use of ordinary
// function as HPIgPost mutator.
type HPIgPostFunc func(context.Context, *ent.HPIgPostMutation) (ent.Value, error)

// Mutate calls f(ctx, m).
func (f HPIgPostFunc) Mutate(ctx context.Context, m ent.Mutation) (ent.Value, error) {
	if mv, ok := m.(*ent.HPIgPostMutation); ok {
		return f(ctx, mv)
	}
	return nil, fmt.Errorf("unexpected mutation type %T. expect *ent.HPIgPostMutation", m)
}

// The HPMemberFunc type is an adapter to allow the use of ordinary
// function as HPMember mutator.
type HPMemberFunc func(context.Context, *ent.HPMemberMutation) (ent.Value, error)

// Mutate calls f(ctx, m).
func (f HPMemberFunc) Mutate(ctx context.Context, m ent.Mutation) (ent.Value, error) {
	if mv, ok := m.(*ent.HPMemberMutation); ok {
		return f(ctx, mv)
	}
	return nil, fmt.Errorf("unexpected mutation type %T. expect *ent.HPMemberMutation", m)
}

// The HPSortHistoryFunc type is an adapter to allow the use of ordinary
// function as HPSortHistory mutator.
type HPSortHistoryFunc func(context.Context, *ent.HPSortHistoryMutation) (ent.Value, error)

// Mutate calls f(ctx, m).
func (f HPSortHistoryFunc) Mutate(ctx context.Context, m ent.Mutation) (ent.Value, error) {
	if mv, ok := m.(*ent.HPSortHistoryMutation); ok {
		return f(ctx, mv)
	}
	return nil, fmt.Errorf("unexpected mutation type %T. expect *ent.HPSortHistoryMutation", m)
}

// The HPViewHistoryFunc type is an adapter to allow the use of ordinary
// function as HPViewHistory mutator.
type HPViewHistoryFunc func(context.Context, *ent.HPViewHistoryMutation) (ent.Value, error)

// Mutate calls f(ctx, m).
func (f HPViewHistoryFunc) Mutate(ctx context.Context, m ent.Mutation) (ent.Value, error) {
	if mv, ok := m.(*ent.HPViewHistoryMutation); ok {
		return f(ctx, mv)
	}
	return nil, fmt.Errorf("unexpected mutation type %T. expect *ent.HPViewHistoryMutation", m)
}

// The MetricFunc type is an adapter to allow the use of ordinary
// function as Metric mutator.
type MetricFunc func(context.Context, *ent.MetricMutation) (ent.Value, error)

// Mutate calls f(ctx, m).
func (f MetricFunc) Mutate(ctx context.Context, m ent.Mutation) (ent.Value, error) {
	if mv, ok := m.(*ent.MetricMutation); ok {
		return f(ctx, mv)
	}
	return nil, fmt.Errorf("unexpected mutation type %T. expect *ent.MetricMutation", m)
}

// The MetricDryRunFunc type is an adapter to allow the use of ordinary
// function as MetricDryRun mutator.
type MetricDryRunFunc func(context.Context, *ent.MetricDryRunMutation) (ent.Value, error)

// Mutate calls f(ctx, m).
func (f MetricDryRunFunc) Mutate(ctx context.Context, m ent.Mutation) (ent.Value, error) {
	if mv, ok := m.(*ent.MetricDryRunMutation); ok {
		return f(ctx, mv)
	}
	return nil, fmt.Errorf("unexpected mutation type %T. expect *ent.MetricDryRunMutation", m)
}

// The TestEntFunc type is an adapter to allow the use of ordinary
// function as TestEnt mutator.
type TestEntFunc func(context.Context, *ent.TestEntMutation) (ent.Value, error)

// Mutate calls f(ctx, m).
func (f TestEntFunc) Mutate(ctx context.Context, m ent.Mutation) (ent.Value, error) {
	if mv, ok := m.(*ent.TestEntMutation); ok {
		return f(ctx, mv)
	}
	return nil, fmt.Errorf("unexpected mutation type %T. expect *ent.TestEntMutation", m)
}

// The UserFunc type is an adapter to allow the use of ordinary
// function as User mutator.
type UserFunc func(context.Context, *ent.UserMutation) (ent.Value, error)

// Mutate calls f(ctx, m).
func (f UserFunc) Mutate(ctx context.Context, m ent.Mutation) (ent.Value, error) {
	if mv, ok := m.(*ent.UserMutation); ok {
		return f(ctx, mv)
	}
	return nil, fmt.Errorf("unexpected mutation type %T. expect *ent.UserMutation", m)
}

// The UserNotificationLogFunc type is an adapter to allow the use of ordinary
// function as UserNotificationLog mutator.
type UserNotificationLogFunc func(context.Context, *ent.UserNotificationLogMutation) (ent.Value, error)

// Mutate calls f(ctx, m).
func (f UserNotificationLogFunc) Mutate(ctx context.Context, m ent.Mutation) (ent.Value, error) {
	if mv, ok := m.(*ent.UserNotificationLogMutation); ok {
		return f(ctx, mv)
	}
	return nil, fmt.Errorf("unexpected mutation type %T. expect *ent.UserNotificationLogMutation", m)
}

// The UserNotificationSettingFunc type is an adapter to allow the use of ordinary
// function as UserNotificationSetting mutator.
type UserNotificationSettingFunc func(context.Context, *ent.UserNotificationSettingMutation) (ent.Value, error)

// Mutate calls f(ctx, m).
func (f UserNotificationSettingFunc) Mutate(ctx context.Context, m ent.Mutation) (ent.Value, error) {
	if mv, ok := m.(*ent.UserNotificationSettingMutation); ok {
		return f(ctx, mv)
	}
	return nil, fmt.Errorf("unexpected mutation type %T. expect *ent.UserNotificationSettingMutation", m)
}

// Condition is a hook condition function.
type Condition func(context.Context, ent.Mutation) bool

// And groups conditions with the AND operator.
func And(first, second Condition, rest ...Condition) Condition {
	return func(ctx context.Context, m ent.Mutation) bool {
		if !first(ctx, m) || !second(ctx, m) {
			return false
		}
		for _, cond := range rest {
			if !cond(ctx, m) {
				return false
			}
		}
		return true
	}
}

// Or groups conditions with the OR operator.
func Or(first, second Condition, rest ...Condition) Condition {
	return func(ctx context.Context, m ent.Mutation) bool {
		if first(ctx, m) || second(ctx, m) {
			return true
		}
		for _, cond := range rest {
			if cond(ctx, m) {
				return true
			}
		}
		return false
	}
}

// Not negates a given condition.
func Not(cond Condition) Condition {
	return func(ctx context.Context, m ent.Mutation) bool {
		return !cond(ctx, m)
	}
}

// HasOp is a condition testing mutation operation.
func HasOp(op ent.Op) Condition {
	return func(_ context.Context, m ent.Mutation) bool {
		return m.Op().Is(op)
	}
}

// HasAddedFields is a condition validating `.AddedField` on fields.
func HasAddedFields(field string, fields ...string) Condition {
	return func(_ context.Context, m ent.Mutation) bool {
		if _, exists := m.AddedField(field); !exists {
			return false
		}
		for _, field := range fields {
			if _, exists := m.AddedField(field); !exists {
				return false
			}
		}
		return true
	}
}

// HasClearedFields is a condition validating `.FieldCleared` on fields.
func HasClearedFields(field string, fields ...string) Condition {
	return func(_ context.Context, m ent.Mutation) bool {
		if exists := m.FieldCleared(field); !exists {
			return false
		}
		for _, field := range fields {
			if exists := m.FieldCleared(field); !exists {
				return false
			}
		}
		return true
	}
}

// HasFields is a condition validating `.Field` on fields.
func HasFields(field string, fields ...string) Condition {
	return func(_ context.Context, m ent.Mutation) bool {
		if _, exists := m.Field(field); !exists {
			return false
		}
		for _, field := range fields {
			if _, exists := m.Field(field); !exists {
				return false
			}
		}
		return true
	}
}

// If executes the given hook under condition.
//
//	hook.If(ComputeAverage, And(HasFields(...), HasAddedFields(...)))
func If(hk ent.Hook, cond Condition) ent.Hook {
	return func(next ent.Mutator) ent.Mutator {
		return ent.MutateFunc(func(ctx context.Context, m ent.Mutation) (ent.Value, error) {
			if cond(ctx, m) {
				return hk(next).Mutate(ctx, m)
			}
			return next.Mutate(ctx, m)
		})
	}
}

// On executes the given hook only for the given operation.
//
//	hook.On(Log, ent.Delete|ent.Create)
func On(hk ent.Hook, op ent.Op) ent.Hook {
	return If(hk, HasOp(op))
}

// Unless skips the given hook only for the given operation.
//
//	hook.Unless(Log, ent.Update|ent.UpdateOne)
func Unless(hk ent.Hook, op ent.Op) ent.Hook {
	return If(hk, Not(HasOp(op)))
}

// FixedError is a hook returning a fixed error.
func FixedError(err error) ent.Hook {
	return func(ent.Mutator) ent.Mutator {
		return ent.MutateFunc(func(context.Context, ent.Mutation) (ent.Value, error) {
			return nil, err
		})
	}
}

// Reject returns a hook that rejects all operations that match op.
//
//	func (T) Hooks() []ent.Hook {
//		return []ent.Hook{
//			Reject(ent.Delete|ent.Update),
//		}
//	}
func Reject(op ent.Op) ent.Hook {
	hk := FixedError(fmt.Errorf("%s operation is not allowed", op))
	return On(hk, op)
}

// Chain acts as a list of hooks and is effectively immutable.
// Once created, it will always hold the same set of hooks in the same order.
type Chain struct {
	hooks []ent.Hook
}

// NewChain creates a new chain of hooks.
func NewChain(hooks ...ent.Hook) Chain {
	return Chain{append([]ent.Hook(nil), hooks...)}
}

// Hook chains the list of hooks and returns the final hook.
func (c Chain) Hook() ent.Hook {
	return func(mutator ent.Mutator) ent.Mutator {
		for i := len(c.hooks) - 1; i >= 0; i-- {
			mutator = c.hooks[i](mutator)
		}
		return mutator
	}
}

// Append extends a chain, adding the specified hook
// as the last ones in the mutation flow.
func (c Chain) Append(hooks ...ent.Hook) Chain {
	newHooks := make([]ent.Hook, 0, len(c.hooks)+len(hooks))
	newHooks = append(newHooks, c.hooks...)
	newHooks = append(newHooks, hooks...)
	return Chain{newHooks}
}

// Extend extends a chain, adding the specified chain
// as the last ones in the mutation flow.
func (c Chain) Extend(chain Chain) Chain {
	return c.Append(chain.hooks...)
}
