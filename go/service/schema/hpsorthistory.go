package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/auth/client"
	"github.com/yssk22/hpapp/go/service/ent/privacy"
	"github.com/yssk22/hpapp/go/service/schema/jsonfields"
	"github.com/yssk22/hpapp/go/service/schema/mixin"
)

// HPSortHistory holds the schema definition for the historical records for HPSort
type HPSortHistory struct {
	ent.Schema
}

func (HPSortHistory) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Timestamp{},
	}
}

// Fields of the HPSortHistory.
func (HPSortHistory) Fields() []ent.Field {
	// we just embed the sort result into a single row and procses the json on the client side.
	return []ent.Field{
		field.JSON("sort_result", jsonfields.HPSortResult{}).Immutable(),

		// Edge field
		field.Int("owner_user_id").StorageKey("user_hpsort_history").Nillable().Optional().Annotations(
			entgql.Skip(entgql.SkipAll),
		),
	}
}

// Edges of the HPSortHistory.
func (HPSortHistory) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("owner", User.Type).
			Ref("hpsort_history").
			Field("owner_user_id").
			Unique(),
	}
}

func (HPSortHistory) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.RelayConnection(),
	}
}

func (HPSortHistory) Policy() ent.Policy {
	return privacy.Policy{
		Query: privacy.QueryPolicy{
			appuser.AlloIfAdmin(),
			appuser.CanSeeOnlyMine(),
		},
		Mutation: privacy.MutationPolicy{
			appuser.AlloIfAdmin(),
			client.DenyIfNonVerifiedClient(),
			appuser.CanMutateOnlyMine("user_hpsort_history"),
		},
	}
}
