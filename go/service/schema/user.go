package schema

import (
	"context"
	"fmt"
	"strconv"

	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/entql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	myent "github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/privacy"
	"github.com/yssk22/hpapp/go/service/errors"
	"github.com/yssk22/hpapp/go/service/schema/mixin"
)

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

// Mixin of the User
func (User) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Timestamp{},
	}
}

// Fields of the User.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("username").Comment("unique identifier with [a-z0-9][a-z0-9_.]+").Unique(),
		field.String("access_token").Unique().Comment("access token for the first party clients to access"),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("auth", Auth.Type).Annotations(entsql.Annotation{
			OnDelete: entsql.Cascade,
		}),
		edge.To("notification_settings", UserNotificationSetting.Type).Annotations(entsql.Annotation{
			OnDelete: entsql.Cascade,
		}),
		// edge.To("profile_settings", UserProfileSettings.Type).Annotations(entsql.Annotation{
		// 	OnDelete: entsql.Cascade,
		// }),
		edge.To("hpview_history", HPViewHistory.Type).Annotations(entsql.Annotation{
			OnDelete: entsql.Cascade,
		}),
		edge.To("hpmember_following", HPFollow.Type).Annotations(entsql.Annotation{
			OnDelete: entsql.Cascade,
		}),
		edge.To("hpsort_history", HPSortHistory.Type).Annotations(entsql.Annotation{
			OnDelete: entsql.Cascade,
		}),
		// edge.To("hpfc_ticket_info", HPFCTicketInfo.Type).Annotations(entsql.Annotation{
		// 	OnDelete: entsql.Cascade,
		// }),
		edge.To("hpfc_event_tickets", HPFCEventTicket.Type).Annotations(entsql.Annotation{
			OnDelete: entsql.Cascade,
		}),

		edge.To("elineup_mall_purchase_histories", HPElineupMallItemPurchaseHistory.Type).Annotations(entsql.Annotation{
			OnDelete: entsql.Cascade,
		}),
	}
}

func (User) Annotations() []schema.Annotation {
	return []schema.Annotation{}
}

func (User) Policy() ent.Policy {
	return privacy.Policy{
		Query: privacy.QueryPolicy{
			appuser.AlloIfAdmin(),
			canSeeOnlyMe(),
		},
	}
}

func canSeeOnlyMe() privacy.QueryRule {
	return privacy.FilterFunc(func(ctx context.Context, f privacy.Filter) error {
		uid, err := strconv.Atoi(appuser.CurrentUser(ctx).ID())
		if err != nil {
			return appuser.ErrAuthenticationRequired
		}
		af, ok := f.(*myent.UserFilter)
		if !ok {
			return errors.Wrap(ctx, fmt.Errorf("invalid filter applied: %#v", f))
		}
		af.WhereID(entql.IntEQ(uid))
		return privacy.Skip
	})
}
