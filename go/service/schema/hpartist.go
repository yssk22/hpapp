package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/yssk22/hpapp/go/service/ent/privacy"
	"github.com/yssk22/hpapp/go/service/schema/mixin"
)

// HPArtist holds the schema definition for the HPArtist entity.
type HPArtist struct {
	ent.Schema
}

func (HPArtist) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Crawler{},
		mixin.Timestamp{},
	}
}

// Fields of the HPArtist.
func (HPArtist) Fields() []ent.Field {
	return []ent.Field{
		field.String("key").Unique(),
		field.String("name").Unique(),
		field.String("thumbnail_url"),
		field.Int("index"),
	}
}

// Edges of the HPArtist.
func (HPArtist) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("members", HPMember.Type).Annotations(),
		edge.To("assets", HPAsset.Type),

		// Edges to owning/tagged contents
		// we don't want to expose content edge to GraphQL but provide it via HPFeedItem query etc as
		// we need a custom logic rather than running SQL directly so these edges should haev entgql.SkipAll annotations

		edge.To("owning_feed", HPFeedItem.Type).Annotations(
			entgql.Skip(entgql.SkipAll),
		),
		edge.To("tagged_feed", HPFeedItem.Type).StorageKey(
			// keep this storagekey for legacy compatibility
			edge.Table("hp_artist_feed"),
			edge.Columns("hp_artist_id", "hp_feed_item_id"),
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
			edge.Table("hp_artist_elineup_mall_items"),
			edge.Columns("hp_artist_id", "hp_elineup_mall_item_id"),
		).Annotations(entgql.Skip(entgql.SkipAll)),

		edge.To("followed_by", HPFollow.Type).StorageKey(
			edge.Column("hp_follow_artist"),
		).Annotations(entsql.Annotation{
			OnDelete: entsql.Cascade,
		}, entgql.Skip(entgql.SkipAll),
		),
	}
}

func (HPArtist) Annotations() []schema.Annotation {
	return []schema.Annotation{}
}

func (HPArtist) Policy() ent.Policy {
	return privacy.Policy{}
}
