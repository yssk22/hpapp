package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"hpapp.yssk22.dev/go/service/schema/enums"
)

// HPAsset holds the schema definition for the HPAsset entity.
type HPAsset struct {
	ent.Schema
}

func (HPAsset) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("key", "asset_type").Unique(),
	}
}

// Fields of the HPAsset.
func (HPAsset) Fields() []ent.Field {
	return []ent.Field{
		field.String("key"),
		field.Enum("asset_type").GoType(enums.HPAssetTypeAmeblo),
	}
}

// Edges of the HPAsset.
func (HPAsset) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("artist", HPArtist.Type).
			Ref("assets").
			Unique(),
		edge.From("members", HPMember.Type).
			Ref("assets"),

		edge.To("ameblo_posts", HPAmebloPost.Type).Annotations(
			entgql.Skip(entgql.SkipAll),
		),
		edge.To("ig_posts", HPIgPost.Type).Annotations(
			entgql.Skip(entgql.SkipAll),
		),
	}
}

func (HPAsset) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Skip(entgql.SkipAll),
	}
}
