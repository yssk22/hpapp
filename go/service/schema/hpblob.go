package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"github.com/yssk22/hpapp/go/service/schema/enums"
	"github.com/yssk22/hpapp/go/service/schema/jsonfields"
	"github.com/yssk22/hpapp/go/service/schema/mixin"
)

// HPBlob holds the schema definition for the HPBlob entity.
type HPBlob struct {
	ent.Schema
}

func (HPBlob) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Timestamp{},
	}
}

func (HPBlob) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("storage_path"),
	}
}

// Fields of the HPBlob.
func (HPBlob) Fields() []ent.Field {
	return []ent.Field{
		field.String("storage_path").Unique().MaxLen(768),
		field.String("source_url").MaxLen(2048),
		field.String("source_html_url").MaxLen(2048),
		field.Enum("status").GoType(enums.HPBlobStatusUnknown),
		field.Text("status_message").Optional(),
		field.Int("status_error_count").Optional(),
		field.Enum("type").GoType(enums.HPBlobTypeUnknown),
		field.Enum("sub_type").GoType(enums.HPBlobSubTypeUnknown),

		// optional metadata
		field.Int("width").Optional(),
		field.Int("height").Optional(),
		field.Int64("size").Optional(),

		// edge fields
		field.Int("owner_artist_id").Optional(),
		field.Int("owner_member_id").Optional(),

		// image only
		field.Int("num_faces").Optional(),
		field.JSON("faces", jsonfields.HPBlobImageFace{}).Optional().Annotations(entgql.Skip(entgql.SkipAll)),
		field.Enum("face_recognition_status").GoType(enums.HPBlobFaceRecognitionStatusUnknown).Optional().Default(string(enums.HPBlobFaceRecognitionStatusUnknown)),

		// video only
		field.JSON("thumbnail", &jsonfields.HPBlobThumbnail{}).Optional(),
		field.Float("duration_seconds").Optional(),
	}
}

// Edges of the HPBlob.
func (HPBlob) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("owner_artist", HPArtist.Type).
			Field("owner_artist_id").
			Unique(),
		edge.To("owner_member", HPMember.Type).
			Field("owner_member_id").
			Unique(),

		edge.From("ameblo_posts", HPAmebloPost.Type).Ref("blobs"),
		edge.From("ig_posts", HPIgPost.Type).Ref("blobs"),
	}
}
