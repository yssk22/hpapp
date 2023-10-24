package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"github.com/yssk22/hpapp/go/service/schema/enums"
	"github.com/yssk22/hpapp/go/service/schema/jsonfields"
	"github.com/yssk22/hpapp/go/service/schema/mixin"
)

type HPFeedItem struct {
	ent.Schema
}

func (HPFeedItem) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Timestamp{},
	}
}
func (HPFeedItem) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("post_at"),
		index.Fields("post_at", "id"),
		index.Fields("owner_member_id", "asset_type", "post_at", "id"),
	}
}

// Fields of the HPFeedItem.
func (HPFeedItem) Fields() []ent.Field {
	return []ent.Field{
		field.Int("source_id").Unique(),
		field.Enum("asset_type").
			GoType(enums.HPAssetTypeAmeblo).
			Default(string(enums.HPAssetTypeAmeblo)),
		field.String("title"),
		field.Time("post_at").Annotations(entgql.OrderField("postAt")),
		field.String("source_url"),
		field.String("image_url").Nillable().Optional(),
		field.JSON("media", []jsonfields.Media{}),

		field.Int("owner_artist_id").Nillable().Optional(),
		field.Int("owner_member_id").Nillable().Optional(),
	}
}

func (HPFeedItem) Edges() []ent.Edge {
	return []ent.Edge{
		// we don't expose this edge to GraphQL but expose 'myviewhistory' via custom resolver
		edge.To("view_histories", HPViewHistory.Type).
			Annotations(entgql.Skip()),

		edge.From("owner_artist", HPArtist.Type).
			Ref("owning_feed").
			Field("owner_artist_id").
			Unique(),
		edge.From("owner_member", HPMember.Type).
			Ref("owning_feed").
			Field("owner_member_id").
			Unique(),

		edge.From("tagged_artists", HPArtist.Type).
			Ref("tagged_feed"),
		edge.From("tagged_members", HPMember.Type).
			Ref("tagged_feed"),
	}
}

func (HPFeedItem) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.RelayConnection(),
	}
}

func (HPFeedItem) Hooks() []ent.Hook {
	return []ent.Hook{}
}
