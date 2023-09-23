package schema

import (
	"time"

	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/field"
	"hpapp.yssk22.dev/go/service/schema/enums"
	"hpapp.yssk22.dev/go/service/schema/jsonfields"
)

// TestEnt is a test table to implement tests for ent related stuff
type TestEnt struct {
	ent.Schema
}

// Mixin of the TestEnt
func (TestEnt) Mixin() []ent.Mixin {
	return []ent.Mixin{}
}

// Fields of the TestEnt.
func (TestEnt) Fields() []ent.Field {
	return []ent.Field{
		field.String("string_field").Optional().Nillable().Default("test_string"),
		field.Text("text_field").Optional().Nillable().Default("test_text"),
		field.Bytes("bytes_field").Optional().Nillable().Default([]byte("test_bytes")),
		field.Bool("bool_field").Optional().Nillable().Default(true),
		field.Time("time_field").Optional().Nillable().Default(time.Date(1996, 10, 30, 1, 2, 3, 4, time.UTC)),
		field.Int("int_field").Optional().Nillable().Default(10),
		field.Int64("int64_field").Optional().Nillable().Default(30),
		field.Float("float_field").Optional().Nillable().Default(19.96),

		field.JSON("json_field", &jsonfields.TestJSON{}).Optional().Default(&jsonfields.TestJSON{
			String:   "string_field",
			Int:      10,
			DateTime: time.Date(1996, 10, 30, 1, 2, 3, 4, time.UTC),
		}),
		field.Enum("enum_field").GoType(enums.TestEnumA).Optional().Default(string(enums.TestEnumB)),
	}
}

// Edges of the TestEnt.
func (TestEnt) Edges() []ent.Edge {
	return []ent.Edge{}
}

func (TestEnt) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Skip(entgql.SkipAll),
	}
}
