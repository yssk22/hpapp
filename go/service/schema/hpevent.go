package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"hpapp.yssk22.dev/go/service/schema/enums"
	"hpapp.yssk22.dev/go/service/schema/mixin"
)

// HPEvent holds the schema definition for the HPEvent entity.
type HPEvent struct {
	ent.Schema
}

func (HPEvent) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Timestamp{},
	}
}

func (HPEvent) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("key").
			Unique(),
	}
}

// Fields of the HPEvent.
func (HPEvent) Fields() []ent.Field {
	return []ent.Field{
		// For up-fc.jp EVENTS
		//   We use {pref}-{venue}@{timestamp of start_at} as a key for HPEvents since there used to be no explicit idnetifier of events in up-fc.jp and
		//   they shouldn't have the two or more events at the same timestamp and same venue.
		field.String("key").Unique(),
		field.Strings("display_titles"),
		field.Time("open_at").Optional(),
		field.Time("start_at"),
		field.String("venue"),
		field.String("prefecture"),
		field.Enum("source").
			GoType(enums.HPEventSourceFCScrape).
			Default(string(enums.HPEventSourceFCScrape)),
	}
}

// Edges of the HPEvent.
func (HPEvent) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("members", HPMember.Type).Annotations(
			entgql.Skip(),
		),
		edge.To("artists", HPArtist.Type).Annotations(
			entgql.Skip(),
		),
		edge.To("hpfc_event_tickets", HPFCEventTicket.Type).Annotations(
			// we don't expose this edge but expose 'tickets' via custom resolver
			entgql.Skip(),
		),
	}
}

func (HPEvent) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.RelayConnection(),
	}
}
