package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"hpapp.yssk22.dev/go/service/auth/appuser"
	"hpapp.yssk22.dev/go/service/auth/client"
	"hpapp.yssk22.dev/go/service/ent/privacy"
	"hpapp.yssk22.dev/go/service/schema/enums"
	"hpapp.yssk22.dev/go/service/schema/mixin"
)

// HPViewHistory holds the schema definition for the historical records for contents read
type HPViewHistory struct {
	ent.Schema
}

func (HPViewHistory) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("content_id").
			Edges("user").
			Unique(),
		index.Fields("content_post_at").
			Edges("user"),
	}
}

func (HPViewHistory) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Timestamp{},
	}
}

// Fields of the HPViewHistory.
func (HPViewHistory) Fields() []ent.Field {
	return []ent.Field{
		field.Int("content_id"),
		field.Time("content_post_at").Comment("post_at field value on content to query histories by post_at range"),
		field.Enum("asset_type").GoType(enums.HPAssetTypeAmeblo),
		field.Bool("is_favorite").Default(false),

		// user edge to be defined as explicit field edge to apply policy
		field.Int("owner_user_id").StorageKey("user_hpview_history").Annotations(
			entgql.Skip(entgql.SkipAll),
		),
	}
}

// Edges of the HPViewHistory.
func (HPViewHistory) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("feed", HPFeedItem.Type).Ref("view_histories").Unique(),

		edge.From("user", User.Type).
			Field("owner_user_id").
			Annotations(entgql.Skip(entgql.SkipAll)).
			Required().
			Ref("hpview_history").
			Annotations(entgql.Skip(entgql.SkipAll)).
			Unique(),
	}
}

func (HPViewHistory) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.RelayConnection(),
	}
}

func (HPViewHistory) Policy() ent.Policy {
	return privacy.Policy{
		Query: privacy.QueryPolicy{
			appuser.AlloIfAdmin(),
			appuser.CanSeeOnlyMine(),
		},
		Mutation: privacy.MutationPolicy{
			client.DenyIfNonVerifiedClient(),
			appuser.CanMutateOnlyMine("user_hpview_history"),
		},
	}
}
