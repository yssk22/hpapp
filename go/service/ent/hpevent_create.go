// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"
	"errors"
	"fmt"
	"time"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
	"github.com/yssk22/hpapp/go/service/ent/hpartist"
	"github.com/yssk22/hpapp/go/service/ent/hpevent"
	"github.com/yssk22/hpapp/go/service/ent/hpfceventticket"
	"github.com/yssk22/hpapp/go/service/ent/hpmember"
	"github.com/yssk22/hpapp/go/service/schema/enums"
)

// HPEventCreate is the builder for creating a HPEvent entity.
type HPEventCreate struct {
	config
	mutation *HPEventMutation
	hooks    []Hook
	conflict []sql.ConflictOption
}

// SetCreatedAt sets the "created_at" field.
func (hec *HPEventCreate) SetCreatedAt(t time.Time) *HPEventCreate {
	hec.mutation.SetCreatedAt(t)
	return hec
}

// SetNillableCreatedAt sets the "created_at" field if the given value is not nil.
func (hec *HPEventCreate) SetNillableCreatedAt(t *time.Time) *HPEventCreate {
	if t != nil {
		hec.SetCreatedAt(*t)
	}
	return hec
}

// SetUpdatedAt sets the "updated_at" field.
func (hec *HPEventCreate) SetUpdatedAt(t time.Time) *HPEventCreate {
	hec.mutation.SetUpdatedAt(t)
	return hec
}

// SetNillableUpdatedAt sets the "updated_at" field if the given value is not nil.
func (hec *HPEventCreate) SetNillableUpdatedAt(t *time.Time) *HPEventCreate {
	if t != nil {
		hec.SetUpdatedAt(*t)
	}
	return hec
}

// SetKey sets the "key" field.
func (hec *HPEventCreate) SetKey(s string) *HPEventCreate {
	hec.mutation.SetKey(s)
	return hec
}

// SetDisplayTitles sets the "display_titles" field.
func (hec *HPEventCreate) SetDisplayTitles(s []string) *HPEventCreate {
	hec.mutation.SetDisplayTitles(s)
	return hec
}

// SetOpenAt sets the "open_at" field.
func (hec *HPEventCreate) SetOpenAt(t time.Time) *HPEventCreate {
	hec.mutation.SetOpenAt(t)
	return hec
}

// SetNillableOpenAt sets the "open_at" field if the given value is not nil.
func (hec *HPEventCreate) SetNillableOpenAt(t *time.Time) *HPEventCreate {
	if t != nil {
		hec.SetOpenAt(*t)
	}
	return hec
}

// SetStartAt sets the "start_at" field.
func (hec *HPEventCreate) SetStartAt(t time.Time) *HPEventCreate {
	hec.mutation.SetStartAt(t)
	return hec
}

// SetVenue sets the "venue" field.
func (hec *HPEventCreate) SetVenue(s string) *HPEventCreate {
	hec.mutation.SetVenue(s)
	return hec
}

// SetPrefecture sets the "prefecture" field.
func (hec *HPEventCreate) SetPrefecture(s string) *HPEventCreate {
	hec.mutation.SetPrefecture(s)
	return hec
}

// SetSource sets the "source" field.
func (hec *HPEventCreate) SetSource(ees enums.HPEventSource) *HPEventCreate {
	hec.mutation.SetSource(ees)
	return hec
}

// SetNillableSource sets the "source" field if the given value is not nil.
func (hec *HPEventCreate) SetNillableSource(ees *enums.HPEventSource) *HPEventCreate {
	if ees != nil {
		hec.SetSource(*ees)
	}
	return hec
}

// AddMemberIDs adds the "members" edge to the HPMember entity by IDs.
func (hec *HPEventCreate) AddMemberIDs(ids ...int) *HPEventCreate {
	hec.mutation.AddMemberIDs(ids...)
	return hec
}

// AddMembers adds the "members" edges to the HPMember entity.
func (hec *HPEventCreate) AddMembers(h ...*HPMember) *HPEventCreate {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return hec.AddMemberIDs(ids...)
}

// AddArtistIDs adds the "artists" edge to the HPArtist entity by IDs.
func (hec *HPEventCreate) AddArtistIDs(ids ...int) *HPEventCreate {
	hec.mutation.AddArtistIDs(ids...)
	return hec
}

// AddArtists adds the "artists" edges to the HPArtist entity.
func (hec *HPEventCreate) AddArtists(h ...*HPArtist) *HPEventCreate {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return hec.AddArtistIDs(ids...)
}

// AddHpfcEventTicketIDs adds the "hpfc_event_tickets" edge to the HPFCEventTicket entity by IDs.
func (hec *HPEventCreate) AddHpfcEventTicketIDs(ids ...int) *HPEventCreate {
	hec.mutation.AddHpfcEventTicketIDs(ids...)
	return hec
}

// AddHpfcEventTickets adds the "hpfc_event_tickets" edges to the HPFCEventTicket entity.
func (hec *HPEventCreate) AddHpfcEventTickets(h ...*HPFCEventTicket) *HPEventCreate {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return hec.AddHpfcEventTicketIDs(ids...)
}

// Mutation returns the HPEventMutation object of the builder.
func (hec *HPEventCreate) Mutation() *HPEventMutation {
	return hec.mutation
}

// Save creates the HPEvent in the database.
func (hec *HPEventCreate) Save(ctx context.Context) (*HPEvent, error) {
	if err := hec.defaults(); err != nil {
		return nil, err
	}
	return withHooks[*HPEvent, HPEventMutation](ctx, hec.sqlSave, hec.mutation, hec.hooks)
}

// SaveX calls Save and panics if Save returns an error.
func (hec *HPEventCreate) SaveX(ctx context.Context) *HPEvent {
	v, err := hec.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (hec *HPEventCreate) Exec(ctx context.Context) error {
	_, err := hec.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (hec *HPEventCreate) ExecX(ctx context.Context) {
	if err := hec.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (hec *HPEventCreate) defaults() error {
	if _, ok := hec.mutation.Source(); !ok {
		v := hpevent.DefaultSource
		hec.mutation.SetSource(v)
	}
	return nil
}

// check runs all checks and user-defined validators on the builder.
func (hec *HPEventCreate) check() error {
	if _, ok := hec.mutation.Key(); !ok {
		return &ValidationError{Name: "key", err: errors.New(`ent: missing required field "HPEvent.key"`)}
	}
	if _, ok := hec.mutation.DisplayTitles(); !ok {
		return &ValidationError{Name: "display_titles", err: errors.New(`ent: missing required field "HPEvent.display_titles"`)}
	}
	if _, ok := hec.mutation.StartAt(); !ok {
		return &ValidationError{Name: "start_at", err: errors.New(`ent: missing required field "HPEvent.start_at"`)}
	}
	if _, ok := hec.mutation.Venue(); !ok {
		return &ValidationError{Name: "venue", err: errors.New(`ent: missing required field "HPEvent.venue"`)}
	}
	if _, ok := hec.mutation.Prefecture(); !ok {
		return &ValidationError{Name: "prefecture", err: errors.New(`ent: missing required field "HPEvent.prefecture"`)}
	}
	if _, ok := hec.mutation.Source(); !ok {
		return &ValidationError{Name: "source", err: errors.New(`ent: missing required field "HPEvent.source"`)}
	}
	if v, ok := hec.mutation.Source(); ok {
		if err := hpevent.SourceValidator(v); err != nil {
			return &ValidationError{Name: "source", err: fmt.Errorf(`ent: validator failed for field "HPEvent.source": %w`, err)}
		}
	}
	return nil
}

func (hec *HPEventCreate) sqlSave(ctx context.Context) (*HPEvent, error) {
	if err := hec.check(); err != nil {
		return nil, err
	}
	_node, _spec := hec.createSpec()
	if err := sqlgraph.CreateNode(ctx, hec.driver, _spec); err != nil {
		if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return nil, err
	}
	id := _spec.ID.Value.(int64)
	_node.ID = int(id)
	hec.mutation.id = &_node.ID
	hec.mutation.done = true
	return _node, nil
}

func (hec *HPEventCreate) createSpec() (*HPEvent, *sqlgraph.CreateSpec) {
	var (
		_node = &HPEvent{config: hec.config}
		_spec = sqlgraph.NewCreateSpec(hpevent.Table, sqlgraph.NewFieldSpec(hpevent.FieldID, field.TypeInt))
	)
	_spec.OnConflict = hec.conflict
	if value, ok := hec.mutation.CreatedAt(); ok {
		_spec.SetField(hpevent.FieldCreatedAt, field.TypeTime, value)
		_node.CreatedAt = value
	}
	if value, ok := hec.mutation.UpdatedAt(); ok {
		_spec.SetField(hpevent.FieldUpdatedAt, field.TypeTime, value)
		_node.UpdatedAt = value
	}
	if value, ok := hec.mutation.Key(); ok {
		_spec.SetField(hpevent.FieldKey, field.TypeString, value)
		_node.Key = value
	}
	if value, ok := hec.mutation.DisplayTitles(); ok {
		_spec.SetField(hpevent.FieldDisplayTitles, field.TypeJSON, value)
		_node.DisplayTitles = value
	}
	if value, ok := hec.mutation.OpenAt(); ok {
		_spec.SetField(hpevent.FieldOpenAt, field.TypeTime, value)
		_node.OpenAt = value
	}
	if value, ok := hec.mutation.StartAt(); ok {
		_spec.SetField(hpevent.FieldStartAt, field.TypeTime, value)
		_node.StartAt = value
	}
	if value, ok := hec.mutation.Venue(); ok {
		_spec.SetField(hpevent.FieldVenue, field.TypeString, value)
		_node.Venue = value
	}
	if value, ok := hec.mutation.Prefecture(); ok {
		_spec.SetField(hpevent.FieldPrefecture, field.TypeString, value)
		_node.Prefecture = value
	}
	if value, ok := hec.mutation.Source(); ok {
		_spec.SetField(hpevent.FieldSource, field.TypeEnum, value)
		_node.Source = value
	}
	if nodes := hec.mutation.MembersIDs(); len(nodes) > 0 {
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
		_spec.Edges = append(_spec.Edges, edge)
	}
	if nodes := hec.mutation.ArtistsIDs(); len(nodes) > 0 {
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
		_spec.Edges = append(_spec.Edges, edge)
	}
	if nodes := hec.mutation.HpfcEventTicketsIDs(); len(nodes) > 0 {
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
		_spec.Edges = append(_spec.Edges, edge)
	}
	return _node, _spec
}

// OnConflict allows configuring the `ON CONFLICT` / `ON DUPLICATE KEY` clause
// of the `INSERT` statement. For example:
//
//	client.HPEvent.Create().
//		SetCreatedAt(v).
//		OnConflict(
//			// Update the row with the new values
//			// the was proposed for insertion.
//			sql.ResolveWithNewValues(),
//		).
//		// Override some of the fields with custom
//		// update values.
//		Update(func(u *ent.HPEventUpsert) {
//			SetCreatedAt(v+v).
//		}).
//		Exec(ctx)
func (hec *HPEventCreate) OnConflict(opts ...sql.ConflictOption) *HPEventUpsertOne {
	hec.conflict = opts
	return &HPEventUpsertOne{
		create: hec,
	}
}

// OnConflictColumns calls `OnConflict` and configures the columns
// as conflict target. Using this option is equivalent to using:
//
//	client.HPEvent.Create().
//		OnConflict(sql.ConflictColumns(columns...)).
//		Exec(ctx)
func (hec *HPEventCreate) OnConflictColumns(columns ...string) *HPEventUpsertOne {
	hec.conflict = append(hec.conflict, sql.ConflictColumns(columns...))
	return &HPEventUpsertOne{
		create: hec,
	}
}

type (
	// HPEventUpsertOne is the builder for "upsert"-ing
	//  one HPEvent node.
	HPEventUpsertOne struct {
		create *HPEventCreate
	}

	// HPEventUpsert is the "OnConflict" setter.
	HPEventUpsert struct {
		*sql.UpdateSet
	}
)

// SetUpdatedAt sets the "updated_at" field.
func (u *HPEventUpsert) SetUpdatedAt(v time.Time) *HPEventUpsert {
	u.Set(hpevent.FieldUpdatedAt, v)
	return u
}

// UpdateUpdatedAt sets the "updated_at" field to the value that was provided on create.
func (u *HPEventUpsert) UpdateUpdatedAt() *HPEventUpsert {
	u.SetExcluded(hpevent.FieldUpdatedAt)
	return u
}

// ClearUpdatedAt clears the value of the "updated_at" field.
func (u *HPEventUpsert) ClearUpdatedAt() *HPEventUpsert {
	u.SetNull(hpevent.FieldUpdatedAt)
	return u
}

// SetKey sets the "key" field.
func (u *HPEventUpsert) SetKey(v string) *HPEventUpsert {
	u.Set(hpevent.FieldKey, v)
	return u
}

// UpdateKey sets the "key" field to the value that was provided on create.
func (u *HPEventUpsert) UpdateKey() *HPEventUpsert {
	u.SetExcluded(hpevent.FieldKey)
	return u
}

// SetDisplayTitles sets the "display_titles" field.
func (u *HPEventUpsert) SetDisplayTitles(v []string) *HPEventUpsert {
	u.Set(hpevent.FieldDisplayTitles, v)
	return u
}

// UpdateDisplayTitles sets the "display_titles" field to the value that was provided on create.
func (u *HPEventUpsert) UpdateDisplayTitles() *HPEventUpsert {
	u.SetExcluded(hpevent.FieldDisplayTitles)
	return u
}

// SetOpenAt sets the "open_at" field.
func (u *HPEventUpsert) SetOpenAt(v time.Time) *HPEventUpsert {
	u.Set(hpevent.FieldOpenAt, v)
	return u
}

// UpdateOpenAt sets the "open_at" field to the value that was provided on create.
func (u *HPEventUpsert) UpdateOpenAt() *HPEventUpsert {
	u.SetExcluded(hpevent.FieldOpenAt)
	return u
}

// ClearOpenAt clears the value of the "open_at" field.
func (u *HPEventUpsert) ClearOpenAt() *HPEventUpsert {
	u.SetNull(hpevent.FieldOpenAt)
	return u
}

// SetStartAt sets the "start_at" field.
func (u *HPEventUpsert) SetStartAt(v time.Time) *HPEventUpsert {
	u.Set(hpevent.FieldStartAt, v)
	return u
}

// UpdateStartAt sets the "start_at" field to the value that was provided on create.
func (u *HPEventUpsert) UpdateStartAt() *HPEventUpsert {
	u.SetExcluded(hpevent.FieldStartAt)
	return u
}

// SetVenue sets the "venue" field.
func (u *HPEventUpsert) SetVenue(v string) *HPEventUpsert {
	u.Set(hpevent.FieldVenue, v)
	return u
}

// UpdateVenue sets the "venue" field to the value that was provided on create.
func (u *HPEventUpsert) UpdateVenue() *HPEventUpsert {
	u.SetExcluded(hpevent.FieldVenue)
	return u
}

// SetPrefecture sets the "prefecture" field.
func (u *HPEventUpsert) SetPrefecture(v string) *HPEventUpsert {
	u.Set(hpevent.FieldPrefecture, v)
	return u
}

// UpdatePrefecture sets the "prefecture" field to the value that was provided on create.
func (u *HPEventUpsert) UpdatePrefecture() *HPEventUpsert {
	u.SetExcluded(hpevent.FieldPrefecture)
	return u
}

// SetSource sets the "source" field.
func (u *HPEventUpsert) SetSource(v enums.HPEventSource) *HPEventUpsert {
	u.Set(hpevent.FieldSource, v)
	return u
}

// UpdateSource sets the "source" field to the value that was provided on create.
func (u *HPEventUpsert) UpdateSource() *HPEventUpsert {
	u.SetExcluded(hpevent.FieldSource)
	return u
}

// UpdateNewValues updates the mutable fields using the new values that were set on create.
// Using this option is equivalent to using:
//
//	client.HPEvent.Create().
//		OnConflict(
//			sql.ResolveWithNewValues(),
//		).
//		Exec(ctx)
func (u *HPEventUpsertOne) UpdateNewValues() *HPEventUpsertOne {
	u.create.conflict = append(u.create.conflict, sql.ResolveWithNewValues())
	u.create.conflict = append(u.create.conflict, sql.ResolveWith(func(s *sql.UpdateSet) {
		if _, exists := u.create.mutation.CreatedAt(); exists {
			s.SetIgnore(hpevent.FieldCreatedAt)
		}
	}))
	return u
}

// Ignore sets each column to itself in case of conflict.
// Using this option is equivalent to using:
//
//	client.HPEvent.Create().
//	    OnConflict(sql.ResolveWithIgnore()).
//	    Exec(ctx)
func (u *HPEventUpsertOne) Ignore() *HPEventUpsertOne {
	u.create.conflict = append(u.create.conflict, sql.ResolveWithIgnore())
	return u
}

// DoNothing configures the conflict_action to `DO NOTHING`.
// Supported only by SQLite and PostgreSQL.
func (u *HPEventUpsertOne) DoNothing() *HPEventUpsertOne {
	u.create.conflict = append(u.create.conflict, sql.DoNothing())
	return u
}

// Update allows overriding fields `UPDATE` values. See the HPEventCreate.OnConflict
// documentation for more info.
func (u *HPEventUpsertOne) Update(set func(*HPEventUpsert)) *HPEventUpsertOne {
	u.create.conflict = append(u.create.conflict, sql.ResolveWith(func(update *sql.UpdateSet) {
		set(&HPEventUpsert{UpdateSet: update})
	}))
	return u
}

// SetUpdatedAt sets the "updated_at" field.
func (u *HPEventUpsertOne) SetUpdatedAt(v time.Time) *HPEventUpsertOne {
	return u.Update(func(s *HPEventUpsert) {
		s.SetUpdatedAt(v)
	})
}

// UpdateUpdatedAt sets the "updated_at" field to the value that was provided on create.
func (u *HPEventUpsertOne) UpdateUpdatedAt() *HPEventUpsertOne {
	return u.Update(func(s *HPEventUpsert) {
		s.UpdateUpdatedAt()
	})
}

// ClearUpdatedAt clears the value of the "updated_at" field.
func (u *HPEventUpsertOne) ClearUpdatedAt() *HPEventUpsertOne {
	return u.Update(func(s *HPEventUpsert) {
		s.ClearUpdatedAt()
	})
}

// SetKey sets the "key" field.
func (u *HPEventUpsertOne) SetKey(v string) *HPEventUpsertOne {
	return u.Update(func(s *HPEventUpsert) {
		s.SetKey(v)
	})
}

// UpdateKey sets the "key" field to the value that was provided on create.
func (u *HPEventUpsertOne) UpdateKey() *HPEventUpsertOne {
	return u.Update(func(s *HPEventUpsert) {
		s.UpdateKey()
	})
}

// SetDisplayTitles sets the "display_titles" field.
func (u *HPEventUpsertOne) SetDisplayTitles(v []string) *HPEventUpsertOne {
	return u.Update(func(s *HPEventUpsert) {
		s.SetDisplayTitles(v)
	})
}

// UpdateDisplayTitles sets the "display_titles" field to the value that was provided on create.
func (u *HPEventUpsertOne) UpdateDisplayTitles() *HPEventUpsertOne {
	return u.Update(func(s *HPEventUpsert) {
		s.UpdateDisplayTitles()
	})
}

// SetOpenAt sets the "open_at" field.
func (u *HPEventUpsertOne) SetOpenAt(v time.Time) *HPEventUpsertOne {
	return u.Update(func(s *HPEventUpsert) {
		s.SetOpenAt(v)
	})
}

// UpdateOpenAt sets the "open_at" field to the value that was provided on create.
func (u *HPEventUpsertOne) UpdateOpenAt() *HPEventUpsertOne {
	return u.Update(func(s *HPEventUpsert) {
		s.UpdateOpenAt()
	})
}

// ClearOpenAt clears the value of the "open_at" field.
func (u *HPEventUpsertOne) ClearOpenAt() *HPEventUpsertOne {
	return u.Update(func(s *HPEventUpsert) {
		s.ClearOpenAt()
	})
}

// SetStartAt sets the "start_at" field.
func (u *HPEventUpsertOne) SetStartAt(v time.Time) *HPEventUpsertOne {
	return u.Update(func(s *HPEventUpsert) {
		s.SetStartAt(v)
	})
}

// UpdateStartAt sets the "start_at" field to the value that was provided on create.
func (u *HPEventUpsertOne) UpdateStartAt() *HPEventUpsertOne {
	return u.Update(func(s *HPEventUpsert) {
		s.UpdateStartAt()
	})
}

// SetVenue sets the "venue" field.
func (u *HPEventUpsertOne) SetVenue(v string) *HPEventUpsertOne {
	return u.Update(func(s *HPEventUpsert) {
		s.SetVenue(v)
	})
}

// UpdateVenue sets the "venue" field to the value that was provided on create.
func (u *HPEventUpsertOne) UpdateVenue() *HPEventUpsertOne {
	return u.Update(func(s *HPEventUpsert) {
		s.UpdateVenue()
	})
}

// SetPrefecture sets the "prefecture" field.
func (u *HPEventUpsertOne) SetPrefecture(v string) *HPEventUpsertOne {
	return u.Update(func(s *HPEventUpsert) {
		s.SetPrefecture(v)
	})
}

// UpdatePrefecture sets the "prefecture" field to the value that was provided on create.
func (u *HPEventUpsertOne) UpdatePrefecture() *HPEventUpsertOne {
	return u.Update(func(s *HPEventUpsert) {
		s.UpdatePrefecture()
	})
}

// SetSource sets the "source" field.
func (u *HPEventUpsertOne) SetSource(v enums.HPEventSource) *HPEventUpsertOne {
	return u.Update(func(s *HPEventUpsert) {
		s.SetSource(v)
	})
}

// UpdateSource sets the "source" field to the value that was provided on create.
func (u *HPEventUpsertOne) UpdateSource() *HPEventUpsertOne {
	return u.Update(func(s *HPEventUpsert) {
		s.UpdateSource()
	})
}

// Exec executes the query.
func (u *HPEventUpsertOne) Exec(ctx context.Context) error {
	if len(u.create.conflict) == 0 {
		return errors.New("ent: missing options for HPEventCreate.OnConflict")
	}
	return u.create.Exec(ctx)
}

// ExecX is like Exec, but panics if an error occurs.
func (u *HPEventUpsertOne) ExecX(ctx context.Context) {
	if err := u.create.Exec(ctx); err != nil {
		panic(err)
	}
}

// Exec executes the UPSERT query and returns the inserted/updated ID.
func (u *HPEventUpsertOne) ID(ctx context.Context) (id int, err error) {
	node, err := u.create.Save(ctx)
	if err != nil {
		return id, err
	}
	return node.ID, nil
}

// IDX is like ID, but panics if an error occurs.
func (u *HPEventUpsertOne) IDX(ctx context.Context) int {
	id, err := u.ID(ctx)
	if err != nil {
		panic(err)
	}
	return id
}

// HPEventCreateBulk is the builder for creating many HPEvent entities in bulk.
type HPEventCreateBulk struct {
	config
	builders []*HPEventCreate
	conflict []sql.ConflictOption
}

// Save creates the HPEvent entities in the database.
func (hecb *HPEventCreateBulk) Save(ctx context.Context) ([]*HPEvent, error) {
	specs := make([]*sqlgraph.CreateSpec, len(hecb.builders))
	nodes := make([]*HPEvent, len(hecb.builders))
	mutators := make([]Mutator, len(hecb.builders))
	for i := range hecb.builders {
		func(i int, root context.Context) {
			builder := hecb.builders[i]
			builder.defaults()
			var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
				mutation, ok := m.(*HPEventMutation)
				if !ok {
					return nil, fmt.Errorf("unexpected mutation type %T", m)
				}
				if err := builder.check(); err != nil {
					return nil, err
				}
				builder.mutation = mutation
				var err error
				nodes[i], specs[i] = builder.createSpec()
				if i < len(mutators)-1 {
					_, err = mutators[i+1].Mutate(root, hecb.builders[i+1].mutation)
				} else {
					spec := &sqlgraph.BatchCreateSpec{Nodes: specs}
					spec.OnConflict = hecb.conflict
					// Invoke the actual operation on the latest mutation in the chain.
					if err = sqlgraph.BatchCreate(ctx, hecb.driver, spec); err != nil {
						if sqlgraph.IsConstraintError(err) {
							err = &ConstraintError{msg: err.Error(), wrap: err}
						}
					}
				}
				if err != nil {
					return nil, err
				}
				mutation.id = &nodes[i].ID
				if specs[i].ID.Value != nil {
					id := specs[i].ID.Value.(int64)
					nodes[i].ID = int(id)
				}
				mutation.done = true
				return nodes[i], nil
			})
			for i := len(builder.hooks) - 1; i >= 0; i-- {
				mut = builder.hooks[i](mut)
			}
			mutators[i] = mut
		}(i, ctx)
	}
	if len(mutators) > 0 {
		if _, err := mutators[0].Mutate(ctx, hecb.builders[0].mutation); err != nil {
			return nil, err
		}
	}
	return nodes, nil
}

// SaveX is like Save, but panics if an error occurs.
func (hecb *HPEventCreateBulk) SaveX(ctx context.Context) []*HPEvent {
	v, err := hecb.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (hecb *HPEventCreateBulk) Exec(ctx context.Context) error {
	_, err := hecb.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (hecb *HPEventCreateBulk) ExecX(ctx context.Context) {
	if err := hecb.Exec(ctx); err != nil {
		panic(err)
	}
}

// OnConflict allows configuring the `ON CONFLICT` / `ON DUPLICATE KEY` clause
// of the `INSERT` statement. For example:
//
//	client.HPEvent.CreateBulk(builders...).
//		OnConflict(
//			// Update the row with the new values
//			// the was proposed for insertion.
//			sql.ResolveWithNewValues(),
//		).
//		// Override some of the fields with custom
//		// update values.
//		Update(func(u *ent.HPEventUpsert) {
//			SetCreatedAt(v+v).
//		}).
//		Exec(ctx)
func (hecb *HPEventCreateBulk) OnConflict(opts ...sql.ConflictOption) *HPEventUpsertBulk {
	hecb.conflict = opts
	return &HPEventUpsertBulk{
		create: hecb,
	}
}

// OnConflictColumns calls `OnConflict` and configures the columns
// as conflict target. Using this option is equivalent to using:
//
//	client.HPEvent.Create().
//		OnConflict(sql.ConflictColumns(columns...)).
//		Exec(ctx)
func (hecb *HPEventCreateBulk) OnConflictColumns(columns ...string) *HPEventUpsertBulk {
	hecb.conflict = append(hecb.conflict, sql.ConflictColumns(columns...))
	return &HPEventUpsertBulk{
		create: hecb,
	}
}

// HPEventUpsertBulk is the builder for "upsert"-ing
// a bulk of HPEvent nodes.
type HPEventUpsertBulk struct {
	create *HPEventCreateBulk
}

// UpdateNewValues updates the mutable fields using the new values that
// were set on create. Using this option is equivalent to using:
//
//	client.HPEvent.Create().
//		OnConflict(
//			sql.ResolveWithNewValues(),
//		).
//		Exec(ctx)
func (u *HPEventUpsertBulk) UpdateNewValues() *HPEventUpsertBulk {
	u.create.conflict = append(u.create.conflict, sql.ResolveWithNewValues())
	u.create.conflict = append(u.create.conflict, sql.ResolveWith(func(s *sql.UpdateSet) {
		for _, b := range u.create.builders {
			if _, exists := b.mutation.CreatedAt(); exists {
				s.SetIgnore(hpevent.FieldCreatedAt)
			}
		}
	}))
	return u
}

// Ignore sets each column to itself in case of conflict.
// Using this option is equivalent to using:
//
//	client.HPEvent.Create().
//		OnConflict(sql.ResolveWithIgnore()).
//		Exec(ctx)
func (u *HPEventUpsertBulk) Ignore() *HPEventUpsertBulk {
	u.create.conflict = append(u.create.conflict, sql.ResolveWithIgnore())
	return u
}

// DoNothing configures the conflict_action to `DO NOTHING`.
// Supported only by SQLite and PostgreSQL.
func (u *HPEventUpsertBulk) DoNothing() *HPEventUpsertBulk {
	u.create.conflict = append(u.create.conflict, sql.DoNothing())
	return u
}

// Update allows overriding fields `UPDATE` values. See the HPEventCreateBulk.OnConflict
// documentation for more info.
func (u *HPEventUpsertBulk) Update(set func(*HPEventUpsert)) *HPEventUpsertBulk {
	u.create.conflict = append(u.create.conflict, sql.ResolveWith(func(update *sql.UpdateSet) {
		set(&HPEventUpsert{UpdateSet: update})
	}))
	return u
}

// SetUpdatedAt sets the "updated_at" field.
func (u *HPEventUpsertBulk) SetUpdatedAt(v time.Time) *HPEventUpsertBulk {
	return u.Update(func(s *HPEventUpsert) {
		s.SetUpdatedAt(v)
	})
}

// UpdateUpdatedAt sets the "updated_at" field to the value that was provided on create.
func (u *HPEventUpsertBulk) UpdateUpdatedAt() *HPEventUpsertBulk {
	return u.Update(func(s *HPEventUpsert) {
		s.UpdateUpdatedAt()
	})
}

// ClearUpdatedAt clears the value of the "updated_at" field.
func (u *HPEventUpsertBulk) ClearUpdatedAt() *HPEventUpsertBulk {
	return u.Update(func(s *HPEventUpsert) {
		s.ClearUpdatedAt()
	})
}

// SetKey sets the "key" field.
func (u *HPEventUpsertBulk) SetKey(v string) *HPEventUpsertBulk {
	return u.Update(func(s *HPEventUpsert) {
		s.SetKey(v)
	})
}

// UpdateKey sets the "key" field to the value that was provided on create.
func (u *HPEventUpsertBulk) UpdateKey() *HPEventUpsertBulk {
	return u.Update(func(s *HPEventUpsert) {
		s.UpdateKey()
	})
}

// SetDisplayTitles sets the "display_titles" field.
func (u *HPEventUpsertBulk) SetDisplayTitles(v []string) *HPEventUpsertBulk {
	return u.Update(func(s *HPEventUpsert) {
		s.SetDisplayTitles(v)
	})
}

// UpdateDisplayTitles sets the "display_titles" field to the value that was provided on create.
func (u *HPEventUpsertBulk) UpdateDisplayTitles() *HPEventUpsertBulk {
	return u.Update(func(s *HPEventUpsert) {
		s.UpdateDisplayTitles()
	})
}

// SetOpenAt sets the "open_at" field.
func (u *HPEventUpsertBulk) SetOpenAt(v time.Time) *HPEventUpsertBulk {
	return u.Update(func(s *HPEventUpsert) {
		s.SetOpenAt(v)
	})
}

// UpdateOpenAt sets the "open_at" field to the value that was provided on create.
func (u *HPEventUpsertBulk) UpdateOpenAt() *HPEventUpsertBulk {
	return u.Update(func(s *HPEventUpsert) {
		s.UpdateOpenAt()
	})
}

// ClearOpenAt clears the value of the "open_at" field.
func (u *HPEventUpsertBulk) ClearOpenAt() *HPEventUpsertBulk {
	return u.Update(func(s *HPEventUpsert) {
		s.ClearOpenAt()
	})
}

// SetStartAt sets the "start_at" field.
func (u *HPEventUpsertBulk) SetStartAt(v time.Time) *HPEventUpsertBulk {
	return u.Update(func(s *HPEventUpsert) {
		s.SetStartAt(v)
	})
}

// UpdateStartAt sets the "start_at" field to the value that was provided on create.
func (u *HPEventUpsertBulk) UpdateStartAt() *HPEventUpsertBulk {
	return u.Update(func(s *HPEventUpsert) {
		s.UpdateStartAt()
	})
}

// SetVenue sets the "venue" field.
func (u *HPEventUpsertBulk) SetVenue(v string) *HPEventUpsertBulk {
	return u.Update(func(s *HPEventUpsert) {
		s.SetVenue(v)
	})
}

// UpdateVenue sets the "venue" field to the value that was provided on create.
func (u *HPEventUpsertBulk) UpdateVenue() *HPEventUpsertBulk {
	return u.Update(func(s *HPEventUpsert) {
		s.UpdateVenue()
	})
}

// SetPrefecture sets the "prefecture" field.
func (u *HPEventUpsertBulk) SetPrefecture(v string) *HPEventUpsertBulk {
	return u.Update(func(s *HPEventUpsert) {
		s.SetPrefecture(v)
	})
}

// UpdatePrefecture sets the "prefecture" field to the value that was provided on create.
func (u *HPEventUpsertBulk) UpdatePrefecture() *HPEventUpsertBulk {
	return u.Update(func(s *HPEventUpsert) {
		s.UpdatePrefecture()
	})
}

// SetSource sets the "source" field.
func (u *HPEventUpsertBulk) SetSource(v enums.HPEventSource) *HPEventUpsertBulk {
	return u.Update(func(s *HPEventUpsert) {
		s.SetSource(v)
	})
}

// UpdateSource sets the "source" field to the value that was provided on create.
func (u *HPEventUpsertBulk) UpdateSource() *HPEventUpsertBulk {
	return u.Update(func(s *HPEventUpsert) {
		s.UpdateSource()
	})
}

// Exec executes the query.
func (u *HPEventUpsertBulk) Exec(ctx context.Context) error {
	for i, b := range u.create.builders {
		if len(b.conflict) != 0 {
			return fmt.Errorf("ent: OnConflict was set for builder %d. Set it on the HPEventCreateBulk instead", i)
		}
	}
	if len(u.create.conflict) == 0 {
		return errors.New("ent: missing options for HPEventCreateBulk.OnConflict")
	}
	return u.create.Exec(ctx)
}

// ExecX is like Exec, but panics if an error occurs.
func (u *HPEventUpsertBulk) ExecX(ctx context.Context) {
	if err := u.create.Exec(ctx); err != nil {
		panic(err)
	}
}
