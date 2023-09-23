package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"hpapp.yssk22.dev/go/service/ent/privacy"
	"hpapp.yssk22.dev/go/service/schema/mixin"
)

// HPMember holds the schema definition for the HPMember entity.
type HPMember struct {
	ent.Schema
}

func (HPMember) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Crawler{},
		mixin.Timestamp{},
	}
}

// Fields of the HPMember.
func (HPMember) Fields() []ent.Field {
	return []ent.Field{
		field.String("key").Unique(),
		field.String("artist_key"),
		field.String("name"),
		field.String("name_kana"),
		field.String("thumbnail_url"),
		field.Time("date_of_birth"),
		field.String("blood_type"),
		field.String("hometown"),
		field.Time("join_at").Optional().Nillable(),
		field.Time("graduate_at").Optional().Nillable(),

		field.Int("artist_id").StorageKey("hp_artist_members").Nillable().Optional(),
	}
}

// Edges of the HPMember.
func (HPMember) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("assets", HPAsset.Type),
		edge.From("artist", HPArtist.Type).
			Ref("members").
			Field("artist_id").
			Unique(),

		// Edges to owning/tagged contents
		// we don't want to expose content edge to GraphQL but provide it via HPFeedItem query.

		edge.To("owning_feed", HPFeedItem.Type).Annotations(
			entgql.Skip(entgql.SkipAll),
		),
		edge.To("tagged_feed", HPFeedItem.Type).StorageKey(
			edge.Table("hp_member_feed"),
			edge.Columns("hp_member_id", "hp_feed_item_id"),
		).Annotations(
			entgql.Skip(entgql.SkipAll),
		),

		edge.To("owning_ig_posts", HPIgPost.Type).Annotations(
			entgql.Skip(entgql.SkipAll),
		),
		edge.To("tagged_ig_posts", HPIgPost.Type).Annotations(
			entgql.Skip(entgql.SkipAll),
		),

		edge.To("owning_ameblo_posts", HPAmebloPost.Type).Annotations(
			entgql.Skip(entgql.SkipAll),
		),
		edge.To("tagged_ameblo_posts", HPAmebloPost.Type).Annotations(
			entgql.Skip(entgql.SkipAll),
		),

		edge.To("tagged_elineup_mall_items", HPElineupMallItem.Type).StorageKey(
			edge.Table("hp_member_elineup_mall_items"),
			edge.Columns("hp_member_id", "hp_elineup_mall_item_id"),
		).Annotations(entgql.Skip(entgql.SkipAll)),

		edge.From("followed_by", HPFollow.Type).Annotations(entgql.Skip(entgql.SkipAll)).Ref("member"),
	}
}

func (HPMember) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.RelayConnection(),
	}
}

func (HPMember) Policy() ent.Policy {
	return privacy.Policy{}
}
