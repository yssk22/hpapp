package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"github.com/yssk22/hpapp/go/service/schema/enums"
	"github.com/yssk22/hpapp/go/service/schema/jsonfields"
	"github.com/yssk22/hpapp/go/service/schema/mixin"
)

// HPElineupMallItem holds the schema definition for the HPElineupMallItem entity.
type HPElineupMallItem struct {
	ent.Schema
}

func (HPElineupMallItem) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Crawler{},
		mixin.Timestamp{},
	}
}

func (HPElineupMallItem) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("permalink").
			Unique(),
		index.Fields("order_end_at"),
	}
}

// Fields of the HPElineupMallItem.
func (HPElineupMallItem) Fields() []ent.Field {
	return []ent.Field{
		field.String("permalink").Unique(),
		field.String("name"),
		field.Text("description").Default(""),
		field.String("supplier"),
		field.Int("price"),
		field.Bool("is_limited_to_fc"),
		field.Bool("is_out_of_stock"),
		field.JSON("images", []jsonfields.Media{}),
		field.Enum("category").
			GoType(enums.HPElineupMallItemCategoryOther).
			Default(string(enums.HPElineupMallItemCategoryOther)),

		field.Time("order_start_at").Optional().Nillable(),
		field.Time("order_end_at").Optional().Nillable(),
	}
}

// Edges of the HPElineupMallItem.
func (HPElineupMallItem) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("tagged_artists", HPArtist.Type).Ref("tagged_elineup_mall_items"),
		edge.From("tagged_members", HPMember.Type).Ref("tagged_elineup_mall_items"),
	}
}
