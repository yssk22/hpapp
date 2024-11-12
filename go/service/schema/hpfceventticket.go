package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/auth/client"
	"github.com/yssk22/hpapp/go/service/ent/privacy"
	"github.com/yssk22/hpapp/go/service/schema/enums"
	"github.com/yssk22/hpapp/go/service/schema/mixin"
)

// HPFCEventTicket schema defines the FC event ticket submission status.
// Each record row holds the status of event application of each user / occurrence
type HPFCEventTicket struct {
	ent.Schema
}

func (HPFCEventTicket) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Timestamp{},
	}
}

func (HPFCEventTicket) Indexes() []ent.Index {
	return []ent.Index{
		index.Edges("user", "event"),
	}
}

// Fields of the HPFCEventTicket.
func (HPFCEventTicket) Fields() []ent.Field {
	return []ent.Field{
		field.Int("num"),
		field.Enum("status").
			GoType(enums.HPFCEventTicketApplicationStatusSubmitted).
			Default(string(enums.HPFCEventTicketApplicationStatusSubmitted)),
		// Note that we don't have member id but have SHA256 version of member id as we don't want to collect memberid,
		// which is used as a part of login credential.
		// we just use this field to handle multi accounts scenario
		field.String("fc_member_sha256"),
		// The following fields are denormalized since it could be `somehow` updated by upfc during the application window !!
		// and normalization didn't work well.
		field.String("application_title"),
		field.String("application_id").Nillable().Optional(),
		field.Enum("application_site").
			GoType(enums.HPFCEventTicketSiteHelloProject).
			Default(string(enums.HPFCEventTicketSiteHelloProject)),

		// field.String("application_id").Nillable().Optional(),
		field.Time("application_start_date").Nillable().Optional(),
		field.Time("application_due_date").Nillable().Optional(),
		field.Time("payment_start_date").Nillable().Optional(),
		field.Time("payment_due_date").Nillable().Optional(),

		// user edge to be defined as explicit field edge to apply policy
		field.Int("owner_user_id").StorageKey("user_hpfc_event_tickets").Annotations(
			entgql.Skip(entgql.SkipAll),
		),
	}
}

// Edges of the HPFCEventTicket.
func (HPFCEventTicket) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("event", HPEvent.Type).
			Annotations(entgql.Skip(entgql.SkipAll)).
			Ref("hpfc_event_tickets").
			Annotations(entgql.Skip(entgql.SkipAll)).
			Unique(),
		edge.From("user", User.Type).
			Field("owner_user_id").
			Annotations(entgql.Skip(entgql.SkipAll)).
			Required().
			Ref("hpfc_event_tickets").
			Annotations(entgql.Skip(entgql.SkipAll)).
			Unique(),
	}
}

func (HPFCEventTicket) Policy() ent.Policy {
	return privacy.Policy{
		Query: privacy.QueryPolicy{
			appuser.AlloIfAdmin(),
			appuser.CanSeeOnlyMine(),
		},
		Mutation: privacy.MutationPolicy{
			client.DenyIfNonVerifiedClient(),
			appuser.CanMutateOnlyMine("user_hpfc_event_tickets"),
		},
	}
}
