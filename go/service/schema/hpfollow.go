package schema

import (
	"entgo.io/ent"
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
		index.Edges("user", "artist").Unique(),
		// index.Edges("user", "member", "artist").Unique(), // for upsert
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

		// follow types for elineupmall
		field.Enum("elineupmall_other").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeUnknown)),

		field.Enum("elineupmall_photo_daily").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeUnknown)),
		field.Enum("elineupmall_photo_a4").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeUnknown)),
		field.Enum("elineupmall_photo_a5").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeUnknown)),
		field.Enum("elineupmall_photo_2l").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeUnknown)),
		field.Enum("elineupmall_photo_other").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeUnknown)),

		field.Enum("elineupmall_photo_album").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeUnknown)),
		field.Enum("elineupmall_photo_album_other").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeUnknown)),

		field.Enum("elineupmall_photo_book").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeUnknown)),

		field.Enum("elineupmall_photo_book_other").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeUnknown)),

		field.Enum("elineupmall_dvd").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeUnknown)),
		field.Enum("elineupmall_dvd_magazine").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeUnknown)),
		field.Enum("elineupmall_dvd_magazine_other").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeUnknown)),
		field.Enum("elineupmall_blueray").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeUnknown)),

		field.Enum("elineupmall_penlight").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeUnknown)),

		field.Enum("elineupmall_collection_pinnap_poster").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeUnknown)),
		field.Enum("elineupmall_collection_photo").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeUnknown)),
		field.Enum("elineupmall_collection_other").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeUnknown)),

		field.Enum("elineupmall_tshirt").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeUnknown)),

		field.Enum("elineupmall_microfiber_towel").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeUnknown)),
		field.Enum("elineupmall_muffler_towel").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeUnknown)),

		field.Enum("elineupmall_fsk").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeUnknown)),

		field.Enum("elineupmall_keyring_other").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeUnknown)),

		field.Enum("elineupmall_clear_file").
			GoType(enums.HPFollowTypeFollowWithNotification).
			Default(string(enums.HPFollowTypeUnknown)),
	}
}

func (HPFollow) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).Ref("hpfollow").Unique().Required(),

		edge.From("member", HPMember.Type).Ref("followed_by").Unique(),
		edge.From("artist", HPArtist.Type).Ref("followed_by").Unique(),
	}
}
