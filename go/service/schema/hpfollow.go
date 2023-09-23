package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
	"github.com/yssk22/hpapp/go/service/schema/enums"
	"github.com/yssk22/hpapp/go/service/schema/mixin"
)

// HPFollow holds follower-followee relationship between User and HPMember
type HPFollow struct {
	ent.Schema
}

func (HPFollow) Indexes() []ent.Index {
	return []ent.Index{
		index.Edges("member"),
		index.Edges("user", "member").Unique(),
	}
}

func (HPFollow) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Timestamp{},
	}
}

func (HPFollow) Fields() []ent.Field {
	return []ent.Field{
		field.Enum("type").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeFollowWithNotification)),
	}
}

func (HPFollow) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).Ref("hpmember_following").Unique().Required().Annotations(entsql.Annotation{
			OnDelete: entsql.Cascade,
		}),
		edge.To("member", HPMember.Type).Unique().Required(),
	}
}
