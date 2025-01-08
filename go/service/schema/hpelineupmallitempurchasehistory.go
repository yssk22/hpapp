package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/auth/client"
	"github.com/yssk22/hpapp/go/service/ent/privacy"
	"github.com/yssk22/hpapp/go/service/schema/mixin"
)

// HPElineupMallItemPurchaseHistory holds the schema definition for the historical records for elineupmall item purchase
type HPElineupMallItemPurchaseHistory struct {
	ent.Schema
}

func (HPElineupMallItemPurchaseHistory) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Timestamp{},
	}
}

func (HPElineupMallItemPurchaseHistory) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("permalink", "owner_user_id", "order_id").Unique(), // for upsert

		index.Fields("purchased_item_id", "ordered_at"),                  // to get history for an item
		index.Fields("purchased_item_id", "owner_user_id", "ordered_at"), // to get history for an item and a user

		index.Fields("owner_user_id", "ordered_at"), // to get history for a user
	}
}

// Fields of the HPElineupMallItemPurchaseHistory.
func (HPElineupMallItemPurchaseHistory) Fields() []ent.Field {
	return []ent.Field{
		field.String("order_id"),
		field.Int("num"),
		field.Int("price"),
		field.Time("ordered_at").Annotations(entgql.OrderField("orderedAt")),

		// for denormalization and/or history without HPElineupMallItem reference
		field.String("permalink"),
		field.String("name"),

		// Edge fields
		field.Int("purchased_item_id").Optional().Nillable(), // item reference may be nil if it has not been scraped.
		field.Int("owner_user_id"),
	}
}

// Edges of the HPElineupMallItemPurchaseHistory.
func (HPElineupMallItemPurchaseHistory) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("elineup_mall_item", HPElineupMallItem.Type).
			Field("purchased_item_id").
			Annotations(entgql.Skip(entgql.SkipAll)).
			Ref("purchase_histories").
			Annotations(entgql.Skip(entgql.SkipAll)).
			Unique(),
		edge.From("owner", User.Type).
			Required().
			Field("owner_user_id").
			Annotations(entgql.Skip(entgql.SkipAll)).
			Required().
			Ref("elineup_mall_purchase_histories").
			Annotations(entgql.Skip(entgql.SkipAll)).
			Unique(),
	}
}

func (HPElineupMallItemPurchaseHistory) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.RelayConnection(),
	}
}

func (HPElineupMallItemPurchaseHistory) Hooks() []ent.Hook {
	return []ent.Hook{}
}

func (HPElineupMallItemPurchaseHistory) Policy() ent.Policy {
	return privacy.Policy{
		Query: privacy.QueryPolicy{
			appuser.AlloIfAdmin(),
			appuser.CanSeeOnlyMine(),
		},
		Mutation: privacy.MutationPolicy{
			client.DenyIfNonVerifiedClient(),
			appuser.CanMutateOnlyMine("owner_user_id"),
		},
	}
}
