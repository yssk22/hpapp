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

// Auth holds the schema definition for the Auth entity.
type Auth struct {
	ent.Schema
}

func (Auth) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("provider_name", "provider_user_id").Unique(),
	}
}

func (Auth) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Timestamp{},
	}
}

func (Auth) Fields() []ent.Field {
	return []ent.Field{
		field.String("provider_name").Comment("oauth provider name").Annotations(),
		field.String("provider_user_id").Unique().Comment("user id that the provider uses").Annotations(
			entgql.Skip(entgql.SkipAll),
		),
		field.Text("access_token").Sensitive().Comment("access token"),
		field.Text("refresh_token").Sensitive().Optional().Comment("refresh token"),
		field.Time("expire_at").Optional().Comment("token expire").Annotations(
			entgql.Skip(entgql.SkipAll),
		),
		field.JSON("scope", []string{}).Optional().Comment("oauth scope").Annotations(
			entgql.Skip(entgql.SkipAll),
		),
		field.Int("owner_user_id").StorageKey("user_auth").Optional().Comment("owner user id").Annotations(
			entgql.Skip(entgql.SkipAll),
		),
	}
}

func (Auth) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Field("owner_user_id").
			Ref("auth").
			Unique().Annotations(entgql.Skip(entgql.SkipAll)),
	}
}

func (Auth) Annotations() []schema.Annotation {
	return []schema.Annotation{}
}

func (Auth) Policy() ent.Policy {
	return privacy.Policy{
		Query: privacy.QueryPolicy{
			appuser.AlloIfAdmin(),
			appuser.CanSeeOnlyMine(),
		},
	}
}
