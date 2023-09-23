package schema

import (
	"entgo.io/contrib/entgql"
	"entgo.io/ent"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/ent/privacy"
	"github.com/yssk22/hpapp/go/service/schema/mixin"
)

// UserNotificationSetting holds the schema definition for the UserNotificationSetting entity.
type UserNotificationSetting struct {
	ent.Schema
}

func (UserNotificationSetting) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Timestamp{},
	}
}

func (UserNotificationSetting) Fields() []ent.Field {
	return []ent.Field{
		field.String("token").Comment("expo token").Unique(),
		// if we sent multiple tokens from multiple projects, it would return an error so we need to keep a slug for the token
		// to avoid mising up of tokens.
		field.String("slug").Comment("expo slug value (project name)"),
		field.String("name").Comment("human friendly name (taken on client side)"),

		// per notification settings.
		field.Bool("enable_new_posts").Comment("notify when a new post is created"),
		field.Bool("enable_payment_start").Comment("notify when a payment is started"),
		field.Bool("enable_payment_due").Comment("notify when a payment due date is close"),

		// edge field
		field.Int("owner_user_id").StorageKey("user_notification_settings").Nillable().Optional().Annotations(
			entgql.Skip(entgql.SkipAll),
		),
	}
}

func (UserNotificationSetting) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("token").Edges("user"),
	}
}

func (UserNotificationSetting) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Ref("notification_settings").
			Field("owner_user_id").
			Unique(),

		edge.From("notification_logs", UserNotificationLog.Type).
			Ref("receivers"),
	}
}

func (UserNotificationSetting) Policy() ent.Policy {
	return privacy.Policy{
		Query: privacy.QueryPolicy{
			appuser.AlloIfAdmin(),
			appuser.CanSeeOnlyMine(),
		},
	}
}

func (UserNotificationSetting) Annotations() []schema.Annotation {
	return []schema.Annotation{}
}
