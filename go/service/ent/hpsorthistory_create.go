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
	"github.com/yssk22/hpapp/go/service/ent/hpsorthistory"
	"github.com/yssk22/hpapp/go/service/ent/user"
	"github.com/yssk22/hpapp/go/service/schema/jsonfields"
)

// HPSortHistoryCreate is the builder for creating a HPSortHistory entity.
type HPSortHistoryCreate struct {
	config
	mutation *HPSortHistoryMutation
	hooks    []Hook
	conflict []sql.ConflictOption
}

// SetCreatedAt sets the "created_at" field.
func (hshc *HPSortHistoryCreate) SetCreatedAt(t time.Time) *HPSortHistoryCreate {
	hshc.mutation.SetCreatedAt(t)
	return hshc
}

// SetNillableCreatedAt sets the "created_at" field if the given value is not nil.
func (hshc *HPSortHistoryCreate) SetNillableCreatedAt(t *time.Time) *HPSortHistoryCreate {
	if t != nil {
		hshc.SetCreatedAt(*t)
	}
	return hshc
}

// SetUpdatedAt sets the "updated_at" field.
func (hshc *HPSortHistoryCreate) SetUpdatedAt(t time.Time) *HPSortHistoryCreate {
	hshc.mutation.SetUpdatedAt(t)
	return hshc
}

// SetNillableUpdatedAt sets the "updated_at" field if the given value is not nil.
func (hshc *HPSortHistoryCreate) SetNillableUpdatedAt(t *time.Time) *HPSortHistoryCreate {
	if t != nil {
		hshc.SetUpdatedAt(*t)
	}
	return hshc
}

// SetSortResult sets the "sort_result" field.
func (hshc *HPSortHistoryCreate) SetSortResult(jsr jsonfields.HPSortResult) *HPSortHistoryCreate {
	hshc.mutation.SetSortResult(jsr)
	return hshc
}

// SetOwnerUserID sets the "owner_user_id" field.
func (hshc *HPSortHistoryCreate) SetOwnerUserID(i int) *HPSortHistoryCreate {
	hshc.mutation.SetOwnerUserID(i)
	return hshc
}

// SetNillableOwnerUserID sets the "owner_user_id" field if the given value is not nil.
func (hshc *HPSortHistoryCreate) SetNillableOwnerUserID(i *int) *HPSortHistoryCreate {
	if i != nil {
		hshc.SetOwnerUserID(*i)
	}
	return hshc
}

// SetOwnerID sets the "owner" edge to the User entity by ID.
func (hshc *HPSortHistoryCreate) SetOwnerID(id int) *HPSortHistoryCreate {
	hshc.mutation.SetOwnerID(id)
	return hshc
}

// SetNillableOwnerID sets the "owner" edge to the User entity by ID if the given value is not nil.
func (hshc *HPSortHistoryCreate) SetNillableOwnerID(id *int) *HPSortHistoryCreate {
	if id != nil {
		hshc = hshc.SetOwnerID(*id)
	}
	return hshc
}

// SetOwner sets the "owner" edge to the User entity.
func (hshc *HPSortHistoryCreate) SetOwner(u *User) *HPSortHistoryCreate {
	return hshc.SetOwnerID(u.ID)
}

// Mutation returns the HPSortHistoryMutation object of the builder.
func (hshc *HPSortHistoryCreate) Mutation() *HPSortHistoryMutation {
	return hshc.mutation
}

// Save creates the HPSortHistory in the database.
func (hshc *HPSortHistoryCreate) Save(ctx context.Context) (*HPSortHistory, error) {
	return withHooks[*HPSortHistory, HPSortHistoryMutation](ctx, hshc.sqlSave, hshc.mutation, hshc.hooks)
}

// SaveX calls Save and panics if Save returns an error.
func (hshc *HPSortHistoryCreate) SaveX(ctx context.Context) *HPSortHistory {
	v, err := hshc.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (hshc *HPSortHistoryCreate) Exec(ctx context.Context) error {
	_, err := hshc.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (hshc *HPSortHistoryCreate) ExecX(ctx context.Context) {
	if err := hshc.Exec(ctx); err != nil {
		panic(err)
	}
}

// check runs all checks and user-defined validators on the builder.
func (hshc *HPSortHistoryCreate) check() error {
	if _, ok := hshc.mutation.SortResult(); !ok {
		return &ValidationError{Name: "sort_result", err: errors.New(`ent: missing required field "HPSortHistory.sort_result"`)}
	}
	return nil
}

func (hshc *HPSortHistoryCreate) sqlSave(ctx context.Context) (*HPSortHistory, error) {
	if err := hshc.check(); err != nil {
		return nil, err
	}
	_node, _spec := hshc.createSpec()
	if err := sqlgraph.CreateNode(ctx, hshc.driver, _spec); err != nil {
		if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return nil, err
	}
	id := _spec.ID.Value.(int64)
	_node.ID = int(id)
	hshc.mutation.id = &_node.ID
	hshc.mutation.done = true
	return _node, nil
}

func (hshc *HPSortHistoryCreate) createSpec() (*HPSortHistory, *sqlgraph.CreateSpec) {
	var (
		_node = &HPSortHistory{config: hshc.config}
		_spec = sqlgraph.NewCreateSpec(hpsorthistory.Table, sqlgraph.NewFieldSpec(hpsorthistory.FieldID, field.TypeInt))
	)
	_spec.OnConflict = hshc.conflict
	if value, ok := hshc.mutation.CreatedAt(); ok {
		_spec.SetField(hpsorthistory.FieldCreatedAt, field.TypeTime, value)
		_node.CreatedAt = value
	}
	if value, ok := hshc.mutation.UpdatedAt(); ok {
		_spec.SetField(hpsorthistory.FieldUpdatedAt, field.TypeTime, value)
		_node.UpdatedAt = value
	}
	if value, ok := hshc.mutation.SortResult(); ok {
		_spec.SetField(hpsorthistory.FieldSortResult, field.TypeJSON, value)
		_node.SortResult = value
	}
	if nodes := hshc.mutation.OwnerIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   hpsorthistory.OwnerTable,
			Columns: []string{hpsorthistory.OwnerColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(user.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_node.OwnerUserID = &nodes[0]
		_spec.Edges = append(_spec.Edges, edge)
	}
	return _node, _spec
}

// OnConflict allows configuring the `ON CONFLICT` / `ON DUPLICATE KEY` clause
// of the `INSERT` statement. For example:
//
//	client.HPSortHistory.Create().
//		SetCreatedAt(v).
//		OnConflict(
//			// Update the row with the new values
//			// the was proposed for insertion.
//			sql.ResolveWithNewValues(),
//		).
//		// Override some of the fields with custom
//		// update values.
//		Update(func(u *ent.HPSortHistoryUpsert) {
//			SetCreatedAt(v+v).
//		}).
//		Exec(ctx)
func (hshc *HPSortHistoryCreate) OnConflict(opts ...sql.ConflictOption) *HPSortHistoryUpsertOne {
	hshc.conflict = opts
	return &HPSortHistoryUpsertOne{
		create: hshc,
	}
}

// OnConflictColumns calls `OnConflict` and configures the columns
// as conflict target. Using this option is equivalent to using:
//
//	client.HPSortHistory.Create().
//		OnConflict(sql.ConflictColumns(columns...)).
//		Exec(ctx)
func (hshc *HPSortHistoryCreate) OnConflictColumns(columns ...string) *HPSortHistoryUpsertOne {
	hshc.conflict = append(hshc.conflict, sql.ConflictColumns(columns...))
	return &HPSortHistoryUpsertOne{
		create: hshc,
	}
}

type (
	// HPSortHistoryUpsertOne is the builder for "upsert"-ing
	//  one HPSortHistory node.
	HPSortHistoryUpsertOne struct {
		create *HPSortHistoryCreate
	}

	// HPSortHistoryUpsert is the "OnConflict" setter.
	HPSortHistoryUpsert struct {
		*sql.UpdateSet
	}
)

// SetUpdatedAt sets the "updated_at" field.
func (u *HPSortHistoryUpsert) SetUpdatedAt(v time.Time) *HPSortHistoryUpsert {
	u.Set(hpsorthistory.FieldUpdatedAt, v)
	return u
}

// UpdateUpdatedAt sets the "updated_at" field to the value that was provided on create.
func (u *HPSortHistoryUpsert) UpdateUpdatedAt() *HPSortHistoryUpsert {
	u.SetExcluded(hpsorthistory.FieldUpdatedAt)
	return u
}

// ClearUpdatedAt clears the value of the "updated_at" field.
func (u *HPSortHistoryUpsert) ClearUpdatedAt() *HPSortHistoryUpsert {
	u.SetNull(hpsorthistory.FieldUpdatedAt)
	return u
}

// SetOwnerUserID sets the "owner_user_id" field.
func (u *HPSortHistoryUpsert) SetOwnerUserID(v int) *HPSortHistoryUpsert {
	u.Set(hpsorthistory.FieldOwnerUserID, v)
	return u
}

// UpdateOwnerUserID sets the "owner_user_id" field to the value that was provided on create.
func (u *HPSortHistoryUpsert) UpdateOwnerUserID() *HPSortHistoryUpsert {
	u.SetExcluded(hpsorthistory.FieldOwnerUserID)
	return u
}

// ClearOwnerUserID clears the value of the "owner_user_id" field.
func (u *HPSortHistoryUpsert) ClearOwnerUserID() *HPSortHistoryUpsert {
	u.SetNull(hpsorthistory.FieldOwnerUserID)
	return u
}

// UpdateNewValues updates the mutable fields using the new values that were set on create.
// Using this option is equivalent to using:
//
//	client.HPSortHistory.Create().
//		OnConflict(
//			sql.ResolveWithNewValues(),
//		).
//		Exec(ctx)
func (u *HPSortHistoryUpsertOne) UpdateNewValues() *HPSortHistoryUpsertOne {
	u.create.conflict = append(u.create.conflict, sql.ResolveWithNewValues())
	u.create.conflict = append(u.create.conflict, sql.ResolveWith(func(s *sql.UpdateSet) {
		if _, exists := u.create.mutation.CreatedAt(); exists {
			s.SetIgnore(hpsorthistory.FieldCreatedAt)
		}
		if _, exists := u.create.mutation.SortResult(); exists {
			s.SetIgnore(hpsorthistory.FieldSortResult)
		}
	}))
	return u
}

// Ignore sets each column to itself in case of conflict.
// Using this option is equivalent to using:
//
//	client.HPSortHistory.Create().
//	    OnConflict(sql.ResolveWithIgnore()).
//	    Exec(ctx)
func (u *HPSortHistoryUpsertOne) Ignore() *HPSortHistoryUpsertOne {
	u.create.conflict = append(u.create.conflict, sql.ResolveWithIgnore())
	return u
}

// DoNothing configures the conflict_action to `DO NOTHING`.
// Supported only by SQLite and PostgreSQL.
func (u *HPSortHistoryUpsertOne) DoNothing() *HPSortHistoryUpsertOne {
	u.create.conflict = append(u.create.conflict, sql.DoNothing())
	return u
}

// Update allows overriding fields `UPDATE` values. See the HPSortHistoryCreate.OnConflict
// documentation for more info.
func (u *HPSortHistoryUpsertOne) Update(set func(*HPSortHistoryUpsert)) *HPSortHistoryUpsertOne {
	u.create.conflict = append(u.create.conflict, sql.ResolveWith(func(update *sql.UpdateSet) {
		set(&HPSortHistoryUpsert{UpdateSet: update})
	}))
	return u
}

// SetUpdatedAt sets the "updated_at" field.
func (u *HPSortHistoryUpsertOne) SetUpdatedAt(v time.Time) *HPSortHistoryUpsertOne {
	return u.Update(func(s *HPSortHistoryUpsert) {
		s.SetUpdatedAt(v)
	})
}

// UpdateUpdatedAt sets the "updated_at" field to the value that was provided on create.
func (u *HPSortHistoryUpsertOne) UpdateUpdatedAt() *HPSortHistoryUpsertOne {
	return u.Update(func(s *HPSortHistoryUpsert) {
		s.UpdateUpdatedAt()
	})
}

// ClearUpdatedAt clears the value of the "updated_at" field.
func (u *HPSortHistoryUpsertOne) ClearUpdatedAt() *HPSortHistoryUpsertOne {
	return u.Update(func(s *HPSortHistoryUpsert) {
		s.ClearUpdatedAt()
	})
}

// SetOwnerUserID sets the "owner_user_id" field.
func (u *HPSortHistoryUpsertOne) SetOwnerUserID(v int) *HPSortHistoryUpsertOne {
	return u.Update(func(s *HPSortHistoryUpsert) {
		s.SetOwnerUserID(v)
	})
}

// UpdateOwnerUserID sets the "owner_user_id" field to the value that was provided on create.
func (u *HPSortHistoryUpsertOne) UpdateOwnerUserID() *HPSortHistoryUpsertOne {
	return u.Update(func(s *HPSortHistoryUpsert) {
		s.UpdateOwnerUserID()
	})
}

// ClearOwnerUserID clears the value of the "owner_user_id" field.
func (u *HPSortHistoryUpsertOne) ClearOwnerUserID() *HPSortHistoryUpsertOne {
	return u.Update(func(s *HPSortHistoryUpsert) {
		s.ClearOwnerUserID()
	})
}

// Exec executes the query.
func (u *HPSortHistoryUpsertOne) Exec(ctx context.Context) error {
	if len(u.create.conflict) == 0 {
		return errors.New("ent: missing options for HPSortHistoryCreate.OnConflict")
	}
	return u.create.Exec(ctx)
}

// ExecX is like Exec, but panics if an error occurs.
func (u *HPSortHistoryUpsertOne) ExecX(ctx context.Context) {
	if err := u.create.Exec(ctx); err != nil {
		panic(err)
	}
}

// Exec executes the UPSERT query and returns the inserted/updated ID.
func (u *HPSortHistoryUpsertOne) ID(ctx context.Context) (id int, err error) {
	node, err := u.create.Save(ctx)
	if err != nil {
		return id, err
	}
	return node.ID, nil
}

// IDX is like ID, but panics if an error occurs.
func (u *HPSortHistoryUpsertOne) IDX(ctx context.Context) int {
	id, err := u.ID(ctx)
	if err != nil {
		panic(err)
	}
	return id
}

// HPSortHistoryCreateBulk is the builder for creating many HPSortHistory entities in bulk.
type HPSortHistoryCreateBulk struct {
	config
	builders []*HPSortHistoryCreate
	conflict []sql.ConflictOption
}

// Save creates the HPSortHistory entities in the database.
func (hshcb *HPSortHistoryCreateBulk) Save(ctx context.Context) ([]*HPSortHistory, error) {
	specs := make([]*sqlgraph.CreateSpec, len(hshcb.builders))
	nodes := make([]*HPSortHistory, len(hshcb.builders))
	mutators := make([]Mutator, len(hshcb.builders))
	for i := range hshcb.builders {
		func(i int, root context.Context) {
			builder := hshcb.builders[i]
			var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
				mutation, ok := m.(*HPSortHistoryMutation)
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
					_, err = mutators[i+1].Mutate(root, hshcb.builders[i+1].mutation)
				} else {
					spec := &sqlgraph.BatchCreateSpec{Nodes: specs}
					spec.OnConflict = hshcb.conflict
					// Invoke the actual operation on the latest mutation in the chain.
					if err = sqlgraph.BatchCreate(ctx, hshcb.driver, spec); err != nil {
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
		if _, err := mutators[0].Mutate(ctx, hshcb.builders[0].mutation); err != nil {
			return nil, err
		}
	}
	return nodes, nil
}

// SaveX is like Save, but panics if an error occurs.
func (hshcb *HPSortHistoryCreateBulk) SaveX(ctx context.Context) []*HPSortHistory {
	v, err := hshcb.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (hshcb *HPSortHistoryCreateBulk) Exec(ctx context.Context) error {
	_, err := hshcb.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (hshcb *HPSortHistoryCreateBulk) ExecX(ctx context.Context) {
	if err := hshcb.Exec(ctx); err != nil {
		panic(err)
	}
}

// OnConflict allows configuring the `ON CONFLICT` / `ON DUPLICATE KEY` clause
// of the `INSERT` statement. For example:
//
//	client.HPSortHistory.CreateBulk(builders...).
//		OnConflict(
//			// Update the row with the new values
//			// the was proposed for insertion.
//			sql.ResolveWithNewValues(),
//		).
//		// Override some of the fields with custom
//		// update values.
//		Update(func(u *ent.HPSortHistoryUpsert) {
//			SetCreatedAt(v+v).
//		}).
//		Exec(ctx)
func (hshcb *HPSortHistoryCreateBulk) OnConflict(opts ...sql.ConflictOption) *HPSortHistoryUpsertBulk {
	hshcb.conflict = opts
	return &HPSortHistoryUpsertBulk{
		create: hshcb,
	}
}

// OnConflictColumns calls `OnConflict` and configures the columns
// as conflict target. Using this option is equivalent to using:
//
//	client.HPSortHistory.Create().
//		OnConflict(sql.ConflictColumns(columns...)).
//		Exec(ctx)
func (hshcb *HPSortHistoryCreateBulk) OnConflictColumns(columns ...string) *HPSortHistoryUpsertBulk {
	hshcb.conflict = append(hshcb.conflict, sql.ConflictColumns(columns...))
	return &HPSortHistoryUpsertBulk{
		create: hshcb,
	}
}

// HPSortHistoryUpsertBulk is the builder for "upsert"-ing
// a bulk of HPSortHistory nodes.
type HPSortHistoryUpsertBulk struct {
	create *HPSortHistoryCreateBulk
}

// UpdateNewValues updates the mutable fields using the new values that
// were set on create. Using this option is equivalent to using:
//
//	client.HPSortHistory.Create().
//		OnConflict(
//			sql.ResolveWithNewValues(),
//		).
//		Exec(ctx)
func (u *HPSortHistoryUpsertBulk) UpdateNewValues() *HPSortHistoryUpsertBulk {
	u.create.conflict = append(u.create.conflict, sql.ResolveWithNewValues())
	u.create.conflict = append(u.create.conflict, sql.ResolveWith(func(s *sql.UpdateSet) {
		for _, b := range u.create.builders {
			if _, exists := b.mutation.CreatedAt(); exists {
				s.SetIgnore(hpsorthistory.FieldCreatedAt)
			}
			if _, exists := b.mutation.SortResult(); exists {
				s.SetIgnore(hpsorthistory.FieldSortResult)
			}
		}
	}))
	return u
}

// Ignore sets each column to itself in case of conflict.
// Using this option is equivalent to using:
//
//	client.HPSortHistory.Create().
//		OnConflict(sql.ResolveWithIgnore()).
//		Exec(ctx)
func (u *HPSortHistoryUpsertBulk) Ignore() *HPSortHistoryUpsertBulk {
	u.create.conflict = append(u.create.conflict, sql.ResolveWithIgnore())
	return u
}

// DoNothing configures the conflict_action to `DO NOTHING`.
// Supported only by SQLite and PostgreSQL.
func (u *HPSortHistoryUpsertBulk) DoNothing() *HPSortHistoryUpsertBulk {
	u.create.conflict = append(u.create.conflict, sql.DoNothing())
	return u
}

// Update allows overriding fields `UPDATE` values. See the HPSortHistoryCreateBulk.OnConflict
// documentation for more info.
func (u *HPSortHistoryUpsertBulk) Update(set func(*HPSortHistoryUpsert)) *HPSortHistoryUpsertBulk {
	u.create.conflict = append(u.create.conflict, sql.ResolveWith(func(update *sql.UpdateSet) {
		set(&HPSortHistoryUpsert{UpdateSet: update})
	}))
	return u
}

// SetUpdatedAt sets the "updated_at" field.
func (u *HPSortHistoryUpsertBulk) SetUpdatedAt(v time.Time) *HPSortHistoryUpsertBulk {
	return u.Update(func(s *HPSortHistoryUpsert) {
		s.SetUpdatedAt(v)
	})
}

// UpdateUpdatedAt sets the "updated_at" field to the value that was provided on create.
func (u *HPSortHistoryUpsertBulk) UpdateUpdatedAt() *HPSortHistoryUpsertBulk {
	return u.Update(func(s *HPSortHistoryUpsert) {
		s.UpdateUpdatedAt()
	})
}

// ClearUpdatedAt clears the value of the "updated_at" field.
func (u *HPSortHistoryUpsertBulk) ClearUpdatedAt() *HPSortHistoryUpsertBulk {
	return u.Update(func(s *HPSortHistoryUpsert) {
		s.ClearUpdatedAt()
	})
}

// SetOwnerUserID sets the "owner_user_id" field.
func (u *HPSortHistoryUpsertBulk) SetOwnerUserID(v int) *HPSortHistoryUpsertBulk {
	return u.Update(func(s *HPSortHistoryUpsert) {
		s.SetOwnerUserID(v)
	})
}

// UpdateOwnerUserID sets the "owner_user_id" field to the value that was provided on create.
func (u *HPSortHistoryUpsertBulk) UpdateOwnerUserID() *HPSortHistoryUpsertBulk {
	return u.Update(func(s *HPSortHistoryUpsert) {
		s.UpdateOwnerUserID()
	})
}

// ClearOwnerUserID clears the value of the "owner_user_id" field.
func (u *HPSortHistoryUpsertBulk) ClearOwnerUserID() *HPSortHistoryUpsertBulk {
	return u.Update(func(s *HPSortHistoryUpsert) {
		s.ClearOwnerUserID()
	})
}

// Exec executes the query.
func (u *HPSortHistoryUpsertBulk) Exec(ctx context.Context) error {
	for i, b := range u.create.builders {
		if len(b.conflict) != 0 {
			return fmt.Errorf("ent: OnConflict was set for builder %d. Set it on the HPSortHistoryCreateBulk instead", i)
		}
	}
	if len(u.create.conflict) == 0 {
		return errors.New("ent: missing options for HPSortHistoryCreateBulk.OnConflict")
	}
	return u.create.Exec(ctx)
}

// ExecX is like Exec, but panics if an error occurs.
func (u *HPSortHistoryUpsertBulk) ExecX(ctx context.Context) {
	if err := u.create.Exec(ctx); err != nil {
		panic(err)
	}
}
