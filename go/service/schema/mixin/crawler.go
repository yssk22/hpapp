package mixin

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/mixin"

	"github.com/yssk22/hpapp/go/service/schema/jsonfields"
)

// Crawler implements the ent.Mixin for tables inserted/updated by cralwer
// Fields added:
//    - crawled *time.Time (optional)
//    - error_count Int
//    - last_error_message *String
//    - recrawl_required Bool
type Crawler struct {
	mixin.Schema
}

func (Crawler) Fields() []ent.Field {
	return []ent.Field{
		field.Time("crawled_at").Optional().Nillable(),
		field.Int("error_count").Default(0),

		field.JSON("manually_modified", &jsonfields.ManuallyModified{}).Optional().Annotations(
			entgql.Skip(entgql.SkipAll),
		),
		field.Text("last_error_message").Optional().Nillable(),
		field.Bool("recrawl_required").Optional().Default(false),
	}
}

func (Crawler) Edges() []ent.Edge {
	return nil
}

func (Crawler) Indexes() []ent.Index {
	return nil
}

func (Crawler) Hooks() []ent.Hook {
	return nil
}
