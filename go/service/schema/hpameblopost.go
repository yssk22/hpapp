package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/yssk22/hpapp/go/service/schema/jsonfields"
	"github.com/yssk22/hpapp/go/service/schema/mixin"
)

// HPAmebloPost holds the schema definition for the HPAmebloPost entity.
type HPAmebloPost struct {
	ent.Schema
}

func (HPAmebloPost) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Crawler{},
		mixin.Timestamp{},
	}
}

// Fields of the HPAmebloPost.
func (HPAmebloPost) Fields() []ent.Field {
	return []ent.Field{
		field.String("path").Unique(),
		field.String("next_path").Optional().Nillable(),
		field.String("prev_path").Optional().Nillable(),
		field.String("artist_key").Optional().Nillable(),
		field.String("member_key").Optional().Nillable(),
		field.String("title"),
		field.Text("description"),
		field.String("theme").Optional().Nillable(),
		field.Time("post_at"),
		field.Enum("source").Values("rss", "list", "entry"),

		// fields filled by content crawlers
		field.JSON("images", []jsonfields.Media{}).Optional(),
		field.Int("likes").Optional().Nillable(),
		field.Int("comments").Optional().Nillable(),
		field.Int("reblogs").Optional().Nillable(),

		field.Int("owner_artist_id").StorageKey("hp_artist_ameblo_posts").Nillable().Optional(),
		field.Int("owner_member_id").StorageKey("hp_member_ameblo_posts").Nillable().Optional(),
	}
}

// Edges of the HPAmebloPost.
func (HPAmebloPost) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("owner_artist", HPArtist.Type).
			Ref("owning_ameblo_posts").
			Field("owner_artist_id").
			Unique(),
		edge.From("owner_member", HPMember.Type).
			Ref("owning_ameblo_posts").
			Field("owner_member_id").
			Unique(),
		edge.From("tagged_artists", HPArtist.Type).Ref("tagged_ameblo_posts"),
		edge.From("tagged_members", HPMember.Type).Ref("tagged_ameblo_posts"),

		edge.From("asset", HPAsset.Type).
			Ref("ameblo_posts").
			Unique(),

		edge.To("blobs", HPBlob.Type).Annotations(entsql.Annotation{
			OnDelete: entsql.Cascade,
		}),
	}
}

func (HPAmebloPost) Hooks() []ent.Hook {
	return []ent.Hook{}
}
