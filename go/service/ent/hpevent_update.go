// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"
	"errors"
	"fmt"
	"time"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/dialect/sql/sqljson"
	"entgo.io/ent/schema/field"
	"github.com/yssk22/hpapp/go/service/ent/hpartist"
	"github.com/yssk22/hpapp/go/service/ent/hpevent"
	"github.com/yssk22/hpapp/go/service/ent/hpfceventticket"
	"github.com/yssk22/hpapp/go/service/ent/hpmember"
	"github.com/yssk22/hpapp/go/service/ent/predicate"
	"github.com/yssk22/hpapp/go/service/schema/enums"
)

// HPEventUpdate is the builder for updating HPEvent entities.
type HPEventUpdate struct {
	config
	hooks    []Hook
	mutation *HPEventMutation
}

// Where appends a list predicates to the HPEventUpdate builder.
func (heu *HPEventUpdate) Where(ps ...predicate.HPEvent) *HPEventUpdate {
	heu.mutation.Where(ps...)
	return heu
}

// SetUpdatedAt sets the "updated_at" field.
func (heu *HPEventUpdate) SetUpdatedAt(t time.Time) *HPEventUpdate {
	heu.mutation.SetUpdatedAt(t)
	return heu
}

// SetNillableUpdatedAt sets the "updated_at" field if the given value is not nil.
func (heu *HPEventUpdate) SetNillableUpdatedAt(t *time.Time) *HPEventUpdate {
	if t != nil {
		heu.SetUpdatedAt(*t)
	}
	return heu
}

// ClearUpdatedAt clears the value of the "updated_at" field.
func (heu *HPEventUpdate) ClearUpdatedAt() *HPEventUpdate {
	heu.mutation.ClearUpdatedAt()
	return heu
}

// SetKey sets the "key" field.
func (heu *HPEventUpdate) SetKey(s string) *HPEventUpdate {
	heu.mutation.SetKey(s)
	return heu
}

// SetDisplayTitles sets the "display_titles" field.
func (heu *HPEventUpdate) SetDisplayTitles(s []string) *HPEventUpdate {
	heu.mutation.SetDisplayTitles(s)
	return heu
}

// AppendDisplayTitles appends s to the "display_titles" field.
func (heu *HPEventUpdate) AppendDisplayTitles(s []string) *HPEventUpdate {
	heu.mutation.AppendDisplayTitles(s)
	return heu
}

// SetOpenAt sets the "open_at" field.
func (heu *HPEventUpdate) SetOpenAt(t time.Time) *HPEventUpdate {
	heu.mutation.SetOpenAt(t)
	return heu
}

// SetNillableOpenAt sets the "open_at" field if the given value is not nil.
func (heu *HPEventUpdate) SetNillableOpenAt(t *time.Time) *HPEventUpdate {
	if t != nil {
		heu.SetOpenAt(*t)
	}
	return heu
}

// ClearOpenAt clears the value of the "open_at" field.
func (heu *HPEventUpdate) ClearOpenAt() *HPEventUpdate {
	heu.mutation.ClearOpenAt()
	return heu
}

// SetStartAt sets the "start_at" field.
func (heu *HPEventUpdate) SetStartAt(t time.Time) *HPEventUpdate {
	heu.mutation.SetStartAt(t)
	return heu
}

// SetVenue sets the "venue" field.
func (heu *HPEventUpdate) SetVenue(s string) *HPEventUpdate {
	heu.mutation.SetVenue(s)
	return heu
}

// SetPrefecture sets the "prefecture" field.
func (heu *HPEventUpdate) SetPrefecture(s string) *HPEventUpdate {
	heu.mutation.SetPrefecture(s)
	return heu
}

// SetSource sets the "source" field.
func (heu *HPEventUpdate) SetSource(ees enums.HPEventSource) *HPEventUpdate {
	heu.mutation.SetSource(ees)
	return heu
}

// SetNillableSource sets the "source" field if the given value is not nil.
func (heu *HPEventUpdate) SetNillableSource(ees *enums.HPEventSource) *HPEventUpdate {
	if ees != nil {
		heu.SetSource(*ees)
	}
	return heu
}

// AddMemberIDs adds the "members" edge to the HPMember entity by IDs.
func (heu *HPEventUpdate) AddMemberIDs(ids ...int) *HPEventUpdate {
	heu.mutation.AddMemberIDs(ids...)
	return heu
}

// AddMembers adds the "members" edges to the HPMember entity.
func (heu *HPEventUpdate) AddMembers(h ...*HPMember) *HPEventUpdate {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return heu.AddMemberIDs(ids...)
}

// AddArtistIDs adds the "artists" edge to the HPArtist entity by IDs.
func (heu *HPEventUpdate) AddArtistIDs(ids ...int) *HPEventUpdate {
	heu.mutation.AddArtistIDs(ids...)
	return heu
}

// AddArtists adds the "artists" edges to the HPArtist entity.
func (heu *HPEventUpdate) AddArtists(h ...*HPArtist) *HPEventUpdate {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return heu.AddArtistIDs(ids...)
}

// AddHpfcEventTicketIDs adds the "hpfc_event_tickets" edge to the HPFCEventTicket entity by IDs.
func (heu *HPEventUpdate) AddHpfcEventTicketIDs(ids ...int) *HPEventUpdate {
	heu.mutation.AddHpfcEventTicketIDs(ids...)
	return heu
}

// AddHpfcEventTickets adds the "hpfc_event_tickets" edges to the HPFCEventTicket entity.
func (heu *HPEventUpdate) AddHpfcEventTickets(h ...*HPFCEventTicket) *HPEventUpdate {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return heu.AddHpfcEventTicketIDs(ids...)
}

// Mutation returns the HPEventMutation object of the builder.
func (heu *HPEventUpdate) Mutation() *HPEventMutation {
	return heu.mutation
}

// ClearMembers clears all "members" edges to the HPMember entity.
func (heu *HPEventUpdate) ClearMembers() *HPEventUpdate {
	heu.mutation.ClearMembers()
	return heu
}

// RemoveMemberIDs removes the "members" edge to HPMember entities by IDs.
func (heu *HPEventUpdate) RemoveMemberIDs(ids ...int) *HPEventUpdate {
	heu.mutation.RemoveMemberIDs(ids...)
	return heu
}

// RemoveMembers removes "members" edges to HPMember entities.
func (heu *HPEventUpdate) RemoveMembers(h ...*HPMember) *HPEventUpdate {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return heu.RemoveMemberIDs(ids...)
}

// ClearArtists clears all "artists" edges to the HPArtist entity.
func (heu *HPEventUpdate) ClearArtists() *HPEventUpdate {
	heu.mutation.ClearArtists()
	return heu
}

// RemoveArtistIDs removes the "artists" edge to HPArtist entities by IDs.
func (heu *HPEventUpdate) RemoveArtistIDs(ids ...int) *HPEventUpdate {
	heu.mutation.RemoveArtistIDs(ids...)
	return heu
}

// RemoveArtists removes "artists" edges to HPArtist entities.
func (heu *HPEventUpdate) RemoveArtists(h ...*HPArtist) *HPEventUpdate {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return heu.RemoveArtistIDs(ids...)
}

// ClearHpfcEventTickets clears all "hpfc_event_tickets" edges to the HPFCEventTicket entity.
func (heu *HPEventUpdate) ClearHpfcEventTickets() *HPEventUpdate {
	heu.mutation.ClearHpfcEventTickets()
	return heu
}

// RemoveHpfcEventTicketIDs removes the "hpfc_event_tickets" edge to HPFCEventTicket entities by IDs.
func (heu *HPEventUpdate) RemoveHpfcEventTicketIDs(ids ...int) *HPEventUpdate {
	heu.mutation.RemoveHpfcEventTicketIDs(ids...)
	return heu
}

// RemoveHpfcEventTickets removes "hpfc_event_tickets" edges to HPFCEventTicket entities.
func (heu *HPEventUpdate) RemoveHpfcEventTickets(h ...*HPFCEventTicket) *HPEventUpdate {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return heu.RemoveHpfcEventTicketIDs(ids...)
}

// Save executes the query and returns the number of nodes affected by the update operation.
func (heu *HPEventUpdate) Save(ctx context.Context) (int, error) {
	return withHooks[int, HPEventMutation](ctx, heu.sqlSave, heu.mutation, heu.hooks)
}

// SaveX is like Save, but panics if an error occurs.
func (heu *HPEventUpdate) SaveX(ctx context.Context) int {
	affected, err := heu.Save(ctx)
	if err != nil {
		panic(err)
	}
	return affected
}

// Exec executes the query.
func (heu *HPEventUpdate) Exec(ctx context.Context) error {
	_, err := heu.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (heu *HPEventUpdate) ExecX(ctx context.Context) {
	if err := heu.Exec(ctx); err != nil {
		panic(err)
	}
}

// check runs all checks and user-defined validators on the builder.
func (heu *HPEventUpdate) check() error {
	if v, ok := heu.mutation.Source(); ok {
		if err := hpevent.SourceValidator(v); err != nil {
			return &ValidationError{Name: "source", err: fmt.Errorf(`ent: validator failed for field "HPEvent.source": %w`, err)}
		}
	}
	return nil
}

func (heu *HPEventUpdate) sqlSave(ctx context.Context) (n int, err error) {
	if err := heu.check(); err != nil {
		return n, err
	}
	_spec := sqlgraph.NewUpdateSpec(hpevent.Table, hpevent.Columns, sqlgraph.NewFieldSpec(hpevent.FieldID, field.TypeInt))
	if ps := heu.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if heu.mutation.CreatedAtCleared() {
		_spec.ClearField(hpevent.FieldCreatedAt, field.TypeTime)
	}
	if value, ok := heu.mutation.UpdatedAt(); ok {
		_spec.SetField(hpevent.FieldUpdatedAt, field.TypeTime, value)
	}
	if heu.mutation.UpdatedAtCleared() {
		_spec.ClearField(hpevent.FieldUpdatedAt, field.TypeTime)
	}
	if value, ok := heu.mutation.Key(); ok {
		_spec.SetField(hpevent.FieldKey, field.TypeString, value)
	}
	if value, ok := heu.mutation.DisplayTitles(); ok {
		_spec.SetField(hpevent.FieldDisplayTitles, field.TypeJSON, value)
	}
	if value, ok := heu.mutation.AppendedDisplayTitles(); ok {
		_spec.AddModifier(func(u *sql.UpdateBuilder) {
			sqljson.Append(u, hpevent.FieldDisplayTitles, value)
		})
	}
	if value, ok := heu.mutation.OpenAt(); ok {
		_spec.SetField(hpevent.FieldOpenAt, field.TypeTime, value)
	}
	if heu.mutation.OpenAtCleared() {
		_spec.ClearField(hpevent.FieldOpenAt, field.TypeTime)
	}
	if value, ok := heu.mutation.StartAt(); ok {
		_spec.SetField(hpevent.FieldStartAt, field.TypeTime, value)
	}
	if value, ok := heu.mutation.Venue(); ok {
		_spec.SetField(hpevent.FieldVenue, field.TypeString, value)
	}
	if value, ok := heu.mutation.Prefecture(); ok {
		_spec.SetField(hpevent.FieldPrefecture, field.TypeString, value)
	}
	if value, ok := heu.mutation.Source(); ok {
		_spec.SetField(hpevent.FieldSource, field.TypeEnum, value)
	}
	if heu.mutation.MembersCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   hpevent.MembersTable,
			Columns: []string{hpevent.MembersColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpmember.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := heu.mutation.RemovedMembersIDs(); len(nodes) > 0 && !heu.mutation.MembersCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   hpevent.MembersTable,
			Columns: []string{hpevent.MembersColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpmember.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := heu.mutation.MembersIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   hpevent.MembersTable,
			Columns: []string{hpevent.MembersColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpmember.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if heu.mutation.ArtistsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   hpevent.ArtistsTable,
			Columns: []string{hpevent.ArtistsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpartist.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := heu.mutation.RemovedArtistsIDs(); len(nodes) > 0 && !heu.mutation.ArtistsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   hpevent.ArtistsTable,
			Columns: []string{hpevent.ArtistsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpartist.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := heu.mutation.ArtistsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   hpevent.ArtistsTable,
			Columns: []string{hpevent.ArtistsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpartist.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if heu.mutation.HpfcEventTicketsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   hpevent.HpfcEventTicketsTable,
			Columns: []string{hpevent.HpfcEventTicketsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpfceventticket.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := heu.mutation.RemovedHpfcEventTicketsIDs(); len(nodes) > 0 && !heu.mutation.HpfcEventTicketsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   hpevent.HpfcEventTicketsTable,
			Columns: []string{hpevent.HpfcEventTicketsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpfceventticket.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := heu.mutation.HpfcEventTicketsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   hpevent.HpfcEventTicketsTable,
			Columns: []string{hpevent.HpfcEventTicketsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpfceventticket.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if n, err = sqlgraph.UpdateNodes(ctx, heu.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{hpevent.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return 0, err
	}
	heu.mutation.done = true
	return n, nil
}

// HPEventUpdateOne is the builder for updating a single HPEvent entity.
type HPEventUpdateOne struct {
	config
	fields   []string
	hooks    []Hook
	mutation *HPEventMutation
}

// SetUpdatedAt sets the "updated_at" field.
func (heuo *HPEventUpdateOne) SetUpdatedAt(t time.Time) *HPEventUpdateOne {
	heuo.mutation.SetUpdatedAt(t)
	return heuo
}

// SetNillableUpdatedAt sets the "updated_at" field if the given value is not nil.
func (heuo *HPEventUpdateOne) SetNillableUpdatedAt(t *time.Time) *HPEventUpdateOne {
	if t != nil {
		heuo.SetUpdatedAt(*t)
	}
	return heuo
}

// ClearUpdatedAt clears the value of the "updated_at" field.
func (heuo *HPEventUpdateOne) ClearUpdatedAt() *HPEventUpdateOne {
	heuo.mutation.ClearUpdatedAt()
	return heuo
}

// SetKey sets the "key" field.
func (heuo *HPEventUpdateOne) SetKey(s string) *HPEventUpdateOne {
	heuo.mutation.SetKey(s)
	return heuo
}

// SetDisplayTitles sets the "display_titles" field.
func (heuo *HPEventUpdateOne) SetDisplayTitles(s []string) *HPEventUpdateOne {
	heuo.mutation.SetDisplayTitles(s)
	return heuo
}

// AppendDisplayTitles appends s to the "display_titles" field.
func (heuo *HPEventUpdateOne) AppendDisplayTitles(s []string) *HPEventUpdateOne {
	heuo.mutation.AppendDisplayTitles(s)
	return heuo
}

// SetOpenAt sets the "open_at" field.
func (heuo *HPEventUpdateOne) SetOpenAt(t time.Time) *HPEventUpdateOne {
	heuo.mutation.SetOpenAt(t)
	return heuo
}

// SetNillableOpenAt sets the "open_at" field if the given value is not nil.
func (heuo *HPEventUpdateOne) SetNillableOpenAt(t *time.Time) *HPEventUpdateOne {
	if t != nil {
		heuo.SetOpenAt(*t)
	}
	return heuo
}

// ClearOpenAt clears the value of the "open_at" field.
func (heuo *HPEventUpdateOne) ClearOpenAt() *HPEventUpdateOne {
	heuo.mutation.ClearOpenAt()
	return heuo
}

// SetStartAt sets the "start_at" field.
func (heuo *HPEventUpdateOne) SetStartAt(t time.Time) *HPEventUpdateOne {
	heuo.mutation.SetStartAt(t)
	return heuo
}

// SetVenue sets the "venue" field.
func (heuo *HPEventUpdateOne) SetVenue(s string) *HPEventUpdateOne {
	heuo.mutation.SetVenue(s)
	return heuo
}

// SetPrefecture sets the "prefecture" field.
func (heuo *HPEventUpdateOne) SetPrefecture(s string) *HPEventUpdateOne {
	heuo.mutation.SetPrefecture(s)
	return heuo
}

// SetSource sets the "source" field.
func (heuo *HPEventUpdateOne) SetSource(ees enums.HPEventSource) *HPEventUpdateOne {
	heuo.mutation.SetSource(ees)
	return heuo
}

// SetNillableSource sets the "source" field if the given value is not nil.
func (heuo *HPEventUpdateOne) SetNillableSource(ees *enums.HPEventSource) *HPEventUpdateOne {
	if ees != nil {
		heuo.SetSource(*ees)
	}
	return heuo
}

// AddMemberIDs adds the "members" edge to the HPMember entity by IDs.
func (heuo *HPEventUpdateOne) AddMemberIDs(ids ...int) *HPEventUpdateOne {
	heuo.mutation.AddMemberIDs(ids...)
	return heuo
}

// AddMembers adds the "members" edges to the HPMember entity.
func (heuo *HPEventUpdateOne) AddMembers(h ...*HPMember) *HPEventUpdateOne {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return heuo.AddMemberIDs(ids...)
}

// AddArtistIDs adds the "artists" edge to the HPArtist entity by IDs.
func (heuo *HPEventUpdateOne) AddArtistIDs(ids ...int) *HPEventUpdateOne {
	heuo.mutation.AddArtistIDs(ids...)
	return heuo
}

// AddArtists adds the "artists" edges to the HPArtist entity.
func (heuo *HPEventUpdateOne) AddArtists(h ...*HPArtist) *HPEventUpdateOne {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return heuo.AddArtistIDs(ids...)
}

// AddHpfcEventTicketIDs adds the "hpfc_event_tickets" edge to the HPFCEventTicket entity by IDs.
func (heuo *HPEventUpdateOne) AddHpfcEventTicketIDs(ids ...int) *HPEventUpdateOne {
	heuo.mutation.AddHpfcEventTicketIDs(ids...)
	return heuo
}

// AddHpfcEventTickets adds the "hpfc_event_tickets" edges to the HPFCEventTicket entity.
func (heuo *HPEventUpdateOne) AddHpfcEventTickets(h ...*HPFCEventTicket) *HPEventUpdateOne {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return heuo.AddHpfcEventTicketIDs(ids...)
}

// Mutation returns the HPEventMutation object of the builder.
func (heuo *HPEventUpdateOne) Mutation() *HPEventMutation {
	return heuo.mutation
}

// ClearMembers clears all "members" edges to the HPMember entity.
func (heuo *HPEventUpdateOne) ClearMembers() *HPEventUpdateOne {
	heuo.mutation.ClearMembers()
	return heuo
}

// RemoveMemberIDs removes the "members" edge to HPMember entities by IDs.
func (heuo *HPEventUpdateOne) RemoveMemberIDs(ids ...int) *HPEventUpdateOne {
	heuo.mutation.RemoveMemberIDs(ids...)
	return heuo
}

// RemoveMembers removes "members" edges to HPMember entities.
func (heuo *HPEventUpdateOne) RemoveMembers(h ...*HPMember) *HPEventUpdateOne {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return heuo.RemoveMemberIDs(ids...)
}

// ClearArtists clears all "artists" edges to the HPArtist entity.
func (heuo *HPEventUpdateOne) ClearArtists() *HPEventUpdateOne {
	heuo.mutation.ClearArtists()
	return heuo
}

// RemoveArtistIDs removes the "artists" edge to HPArtist entities by IDs.
func (heuo *HPEventUpdateOne) RemoveArtistIDs(ids ...int) *HPEventUpdateOne {
	heuo.mutation.RemoveArtistIDs(ids...)
	return heuo
}

// RemoveArtists removes "artists" edges to HPArtist entities.
func (heuo *HPEventUpdateOne) RemoveArtists(h ...*HPArtist) *HPEventUpdateOne {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return heuo.RemoveArtistIDs(ids...)
}

// ClearHpfcEventTickets clears all "hpfc_event_tickets" edges to the HPFCEventTicket entity.
func (heuo *HPEventUpdateOne) ClearHpfcEventTickets() *HPEventUpdateOne {
	heuo.mutation.ClearHpfcEventTickets()
	return heuo
}

// RemoveHpfcEventTicketIDs removes the "hpfc_event_tickets" edge to HPFCEventTicket entities by IDs.
func (heuo *HPEventUpdateOne) RemoveHpfcEventTicketIDs(ids ...int) *HPEventUpdateOne {
	heuo.mutation.RemoveHpfcEventTicketIDs(ids...)
	return heuo
}

// RemoveHpfcEventTickets removes "hpfc_event_tickets" edges to HPFCEventTicket entities.
func (heuo *HPEventUpdateOne) RemoveHpfcEventTickets(h ...*HPFCEventTicket) *HPEventUpdateOne {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return heuo.RemoveHpfcEventTicketIDs(ids...)
}

// Where appends a list predicates to the HPEventUpdate builder.
func (heuo *HPEventUpdateOne) Where(ps ...predicate.HPEvent) *HPEventUpdateOne {
	heuo.mutation.Where(ps...)
	return heuo
}

// Select allows selecting one or more fields (columns) of the returned entity.
// The default is selecting all fields defined in the entity schema.
func (heuo *HPEventUpdateOne) Select(field string, fields ...string) *HPEventUpdateOne {
	heuo.fields = append([]string{field}, fields...)
	return heuo
}

// Save executes the query and returns the updated HPEvent entity.
func (heuo *HPEventUpdateOne) Save(ctx context.Context) (*HPEvent, error) {
	return withHooks[*HPEvent, HPEventMutation](ctx, heuo.sqlSave, heuo.mutation, heuo.hooks)
}

// SaveX is like Save, but panics if an error occurs.
func (heuo *HPEventUpdateOne) SaveX(ctx context.Context) *HPEvent {
	node, err := heuo.Save(ctx)
	if err != nil {
		panic(err)
	}
	return node
}

// Exec executes the query on the entity.
func (heuo *HPEventUpdateOne) Exec(ctx context.Context) error {
	_, err := heuo.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (heuo *HPEventUpdateOne) ExecX(ctx context.Context) {
	if err := heuo.Exec(ctx); err != nil {
		panic(err)
	}
}

// check runs all checks and user-defined validators on the builder.
func (heuo *HPEventUpdateOne) check() error {
	if v, ok := heuo.mutation.Source(); ok {
		if err := hpevent.SourceValidator(v); err != nil {
			return &ValidationError{Name: "source", err: fmt.Errorf(`ent: validator failed for field "HPEvent.source": %w`, err)}
		}
	}
	return nil
}

func (heuo *HPEventUpdateOne) sqlSave(ctx context.Context) (_node *HPEvent, err error) {
	if err := heuo.check(); err != nil {
		return _node, err
	}
	_spec := sqlgraph.NewUpdateSpec(hpevent.Table, hpevent.Columns, sqlgraph.NewFieldSpec(hpevent.FieldID, field.TypeInt))
	id, ok := heuo.mutation.ID()
	if !ok {
		return nil, &ValidationError{Name: "id", err: errors.New(`ent: missing "HPEvent.id" for update`)}
	}
	_spec.Node.ID.Value = id
	if fields := heuo.fields; len(fields) > 0 {
		_spec.Node.Columns = make([]string, 0, len(fields))
		_spec.Node.Columns = append(_spec.Node.Columns, hpevent.FieldID)
		for _, f := range fields {
			if !hpevent.ValidColumn(f) {
				return nil, &ValidationError{Name: f, err: fmt.Errorf("ent: invalid field %q for query", f)}
			}
			if f != hpevent.FieldID {
				_spec.Node.Columns = append(_spec.Node.Columns, f)
			}
		}
	}
	if ps := heuo.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if heuo.mutation.CreatedAtCleared() {
		_spec.ClearField(hpevent.FieldCreatedAt, field.TypeTime)
	}
	if value, ok := heuo.mutation.UpdatedAt(); ok {
		_spec.SetField(hpevent.FieldUpdatedAt, field.TypeTime, value)
	}
	if heuo.mutation.UpdatedAtCleared() {
		_spec.ClearField(hpevent.FieldUpdatedAt, field.TypeTime)
	}
	if value, ok := heuo.mutation.Key(); ok {
		_spec.SetField(hpevent.FieldKey, field.TypeString, value)
	}
	if value, ok := heuo.mutation.DisplayTitles(); ok {
		_spec.SetField(hpevent.FieldDisplayTitles, field.TypeJSON, value)
	}
	if value, ok := heuo.mutation.AppendedDisplayTitles(); ok {
		_spec.AddModifier(func(u *sql.UpdateBuilder) {
			sqljson.Append(u, hpevent.FieldDisplayTitles, value)
		})
	}
	if value, ok := heuo.mutation.OpenAt(); ok {
		_spec.SetField(hpevent.FieldOpenAt, field.TypeTime, value)
	}
	if heuo.mutation.OpenAtCleared() {
		_spec.ClearField(hpevent.FieldOpenAt, field.TypeTime)
	}
	if value, ok := heuo.mutation.StartAt(); ok {
		_spec.SetField(hpevent.FieldStartAt, field.TypeTime, value)
	}
	if value, ok := heuo.mutation.Venue(); ok {
		_spec.SetField(hpevent.FieldVenue, field.TypeString, value)
	}
	if value, ok := heuo.mutation.Prefecture(); ok {
		_spec.SetField(hpevent.FieldPrefecture, field.TypeString, value)
	}
	if value, ok := heuo.mutation.Source(); ok {
		_spec.SetField(hpevent.FieldSource, field.TypeEnum, value)
	}
	if heuo.mutation.MembersCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   hpevent.MembersTable,
			Columns: []string{hpevent.MembersColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpmember.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := heuo.mutation.RemovedMembersIDs(); len(nodes) > 0 && !heuo.mutation.MembersCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   hpevent.MembersTable,
			Columns: []string{hpevent.MembersColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpmember.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := heuo.mutation.MembersIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   hpevent.MembersTable,
			Columns: []string{hpevent.MembersColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpmember.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if heuo.mutation.ArtistsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   hpevent.ArtistsTable,
			Columns: []string{hpevent.ArtistsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpartist.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := heuo.mutation.RemovedArtistsIDs(); len(nodes) > 0 && !heuo.mutation.ArtistsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   hpevent.ArtistsTable,
			Columns: []string{hpevent.ArtistsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpartist.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := heuo.mutation.ArtistsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   hpevent.ArtistsTable,
			Columns: []string{hpevent.ArtistsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpartist.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if heuo.mutation.HpfcEventTicketsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   hpevent.HpfcEventTicketsTable,
			Columns: []string{hpevent.HpfcEventTicketsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpfceventticket.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := heuo.mutation.RemovedHpfcEventTicketsIDs(); len(nodes) > 0 && !heuo.mutation.HpfcEventTicketsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   hpevent.HpfcEventTicketsTable,
			Columns: []string{hpevent.HpfcEventTicketsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpfceventticket.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := heuo.mutation.HpfcEventTicketsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   hpevent.HpfcEventTicketsTable,
			Columns: []string{hpevent.HpfcEventTicketsColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpfceventticket.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	_node = &HPEvent{config: heuo.config}
	_spec.Assign = _node.assignValues
	_spec.ScanValues = _node.scanValues
	if err = sqlgraph.UpdateNode(ctx, heuo.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{hpevent.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return nil, err
	}
	heuo.mutation.done = true
	return _node, nil
}
