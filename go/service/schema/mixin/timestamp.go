package mixin

import (
	"context"
	"time"

	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/mixin"
	"github.com/yssk22/hpapp/go/system/clock"
)

// Timestamp implements the ent.Mixin for adding timestamps into fields
// Fields added:
//    - created_at time.Time (immutable)
//    - updated_at time.Time
type Timestamp struct {
	mixin.Schema
}

func (Timestamp) Fields() []ent.Field {
	return []ent.Field{
		field.Time("created_at").
			Immutable().
			Optional(),
		field.Time("updated_at").
			Optional(),
	}
}

func (Timestamp) Edges() []ent.Edge {
	return nil
}

func (Timestamp) Indexes() []ent.Index {
	return nil
}

func (Timestamp) Hooks() []ent.Hook {
	return []ent.Hook{
		func(next ent.Mutator) ent.Mutator {
			return ent.MutateFunc(func(ctx context.Context, m ent.Mutation) (ent.Value, error) {
				now := clock.Now(ctx)
				if m.Op().Is(ent.OpCreate) {
					if s, ok := m.(interface{ SetCreatedAt(time.Time) }); ok {
						s.SetCreatedAt(now)
					}
				}
				if s, ok := m.(interface{ SetUpdatedAt(time.Time) }); ok {
					s.SetUpdatedAt(now)
				}
				return next.Mutate(ctx, m)
			})
		},
	}
}

func (Crawler) Annotation() []schema.Annotation {
	return []schema.Annotation{
		entgql.QueryField(),
	}
}
