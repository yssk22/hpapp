package resolver

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/hpfceventticket"
)

// HPEventResolver is a custom resolver to cusotmize the edge between HPEvent and HPFCEventTicket.
// HPFCEventTicket can contain the ticket submission status by other users and usually it is restricted by entpolicy.
// but admins can pass the policy so that they would get the all tickets information via GraphQL, which is not useful.
// To resolve that issue, we define a custom resolver here to enforce "owner_user_id = {current_user_id}" when loading the edge.
type HPEventResolver struct{}

func (r *HPEventResolver) Tickets(ctx context.Context, obj *ent.HPEvent) (result []*ent.HPFCEventTicket, err error) {
	if fc := graphql.GetFieldContext(ctx); fc != nil && fc.Field.Alias != "" {
		result, err = obj.NamedHpfcEventTickets(graphql.GetFieldContext(ctx).Field.Alias)
	} else {
		result, err = obj.Edges.HpfcEventTicketsOrErr()
	}
	if ent.IsNotLoaded(err) {
		uid := appuser.CurrentEntUserID(ctx)
		result, err = obj.QueryHpfcEventTickets().Where(hpfceventticket.OwnerUserIDEQ(uid)).All(ctx)
	}
	return result, err
}
