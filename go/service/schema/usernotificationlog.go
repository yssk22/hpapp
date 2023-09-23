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

// UserNotificationLog holds the schema definition for the UserNotificationLog entity.
type UserNotificationLog struct {
	ent.Schema
}

func (UserNotificationLog) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Timestamp{},
	}
}

func (UserNotificationLog) Fields() []ent.Field {
	return []ent.Field{
		field.String("key").Immutable().Comment("unique key to identify the notification source"),
		field.String("trigger").Immutable().Comment("ocurrence of the notification. the pair of the key and trigger has to be unique"),
		field.Bool("is_test").Comment("true if the notification is generated for the test").Annotations(entgql.Skip(entgql.SkipAll)),
		field.JSON("react_navigation_message", jsonfields.ReactNavigationPush{}).Comment("Message payload for client to handle the notification"),
		field.Time("expected_delivery_time").Comment("expected time for the notification to be sent"),
		field.Enum("status").GoType(enums.UserNotificationStatusPrepared).Default(string(enums.UserNotificationStatusPrepared)).Annotations(entgql.Skip(entgql.SkipAll)),
		field.String("status_message").Comment("error message if happens").Default("").Annotations(entgql.Skip(entgql.SkipAll)),
	}
}

func (UserNotificationLog) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("key", "trigger").Unique(),
	}
}

func (UserNotificationLog) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("receivers", UserNotificationSetting.Type),
	}
}

func (UserNotificationLog) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Skip(entgql.SkipAll),
	}
}
