package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/yssk22/hpapp/go/service/schema/jsonfields"
	"github.com/yssk22/hpapp/go/service/schema/mixin"
)

type HPIgPost struct {
	ent.Schema
}

func (HPIgPost) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Crawler{},
		mixin.Timestamp{},
	}
}

// Fields of the HPIgPost.
func (HPIgPost) Fields() []ent.Field {
	return []ent.Field{
		field.String("shortcode").Unique(),
		field.Text("description"),
		field.Time("post_at"),
		field.JSON("media", []jsonfields.Media{}),
		field.Int("likes"),
		field.Int("comments"),

		field.JSON("recrawl_args", &jsonfields.HPIgCrawlArgs{}).Optional(),

		field.Int("owner_artist_id").StorageKey("hp_artist_ig_posts").Nillable().Optional(),
		field.Int("owner_member_id").StorageKey("hp_member_ig_posts").Nillable().Optional(),
	}
}

func (HPIgPost) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("owner_artist", HPArtist.Type).
			Ref("owning_ig_posts").
			Field("owner_artist_id").
			Unique(),
		edge.From("owner_member", HPMember.Type).
			Ref("owning_ig_posts").
			Field("owner_member_id").
			Unique(),
		edge.From("asset", HPAsset.Type).
			Ref("ig_posts").
			Unique(),
		edge.From("tagged_artists", HPArtist.Type).Ref("tagged_ig_posts"),
		edge.From("tagged_members", HPMember.Type).Ref("tagged_ig_posts"),

		edge.To("blobs", HPBlob.Type).Annotations(entsql.Annotation{
			OnDelete: entsql.Cascade,
		}),
	}
}

func (HPIgPost) Hooks() []ent.Hook {
	return []ent.Hook{}
}

func (HPIgPost) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.RelayConnection(),
	}
}
