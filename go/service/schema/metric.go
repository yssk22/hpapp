package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/ent/privacy"
	"github.com/yssk22/hpapp/go/service/schema/mixin"
)

// Metric holds the schema definition for the Metric entity.
type Metric struct {
	ent.Schema
}

func (Metric) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("metric_name", "date").Unique(),
	}
}

func (Metric) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Timestamp{},
	}
}

func (Metric) Fields() []ent.Field {
	return []ent.Field{
		field.String("metric_name").Comment("metric name").Annotations(),
		field.String("date").Comment("date string").Annotations(), // we dont use Time as we want to put 'yyyy-mm-dd' string or something else for non trend metrics
		field.Float(("value")).Comment("metric value").Annotations(),

		field.Int("owner_user_id").Optional().Comment("owner user id").Annotations(
			entgql.Skip(entgql.SkipAll),
		),
	}
}

func (Metric) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Field("owner_user_id").
			Ref("metrics").
			Unique().Annotations(entgql.Skip(entgql.SkipAll)),
	}
}

func (Metric) Annotations() []schema.Annotation {
	return []schema.Annotation{}
}

func (Metric) Policy() ent.Policy {
	return privacy.Policy{
		Query: privacy.QueryPolicy{
			appuser.AlloIfAdmin(),
			appuser.CanSeeOnlyMineOrPublic(),
		},
		Mutation: privacy.MutationPolicy{
			appuser.AlloIfAdmin(),
		},
	}
}
