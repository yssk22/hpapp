package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/ent/privacy"
	"github.com/yssk22/hpapp/go/service/schema/mixin"
)

// MetricDryRun holds the schema definition for the MetricDryRun entity.
// This must be the same schema as Metric, but we want to keep them to hold data for dryrun.
type MetricDryRun struct {
	ent.Schema
}

func (MetricDryRun) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("metric_name", "date").Unique(),
	}
}

func (MetricDryRun) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Timestamp{},
	}
}

func (MetricDryRun) Fields() []ent.Field {
	return []ent.Field{
		field.String("metric_name").Comment("metric name").Annotations(),
		field.String("date").Comment("date string").Annotations(), // we dont use Time as we want to put 'yyyy-mm-dd' string or something else for non trend MetricDryRuns
		field.Float(("value")).Comment("MetricDryRun value").Annotations(),

		field.Int("owner_user_id").Optional().Comment("owner user id").Annotations(
			entgql.Skip(entgql.SkipAll),
		),
	}
}

func (MetricDryRun) Edges() []ent.Edge {
	return []ent.Edge{} // no need to have edges since dry-run is not for production
}

func (MetricDryRun) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Skip(entgql.SkipAll),
	}
}

func (MetricDryRun) Policy() ent.Policy {
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
