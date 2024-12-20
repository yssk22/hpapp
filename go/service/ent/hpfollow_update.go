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
	"github.com/yssk22/hpapp/go/service/ent/hpfollow"
	"github.com/yssk22/hpapp/go/service/ent/hpmember"
	"github.com/yssk22/hpapp/go/service/ent/predicate"
	"github.com/yssk22/hpapp/go/service/ent/user"
	"github.com/yssk22/hpapp/go/service/schema/enums"
)

// HPFollowUpdate is the builder for updating HPFollow entities.
type HPFollowUpdate struct {
	config
	hooks    []Hook
	mutation *HPFollowMutation
}

// Where appends a list predicates to the HPFollowUpdate builder.
func (hfu *HPFollowUpdate) Where(ps ...predicate.HPFollow) *HPFollowUpdate {
	hfu.mutation.Where(ps...)
	return hfu
}

// SetUpdatedAt sets the "updated_at" field.
func (hfu *HPFollowUpdate) SetUpdatedAt(t time.Time) *HPFollowUpdate {
	hfu.mutation.SetUpdatedAt(t)
	return hfu
}

// SetNillableUpdatedAt sets the "updated_at" field if the given value is not nil.
func (hfu *HPFollowUpdate) SetNillableUpdatedAt(t *time.Time) *HPFollowUpdate {
	if t != nil {
		hfu.SetUpdatedAt(*t)
	}
	return hfu
}

// ClearUpdatedAt clears the value of the "updated_at" field.
func (hfu *HPFollowUpdate) ClearUpdatedAt() *HPFollowUpdate {
	hfu.mutation.ClearUpdatedAt()
	return hfu
}

// SetType sets the "type" field.
func (hfu *HPFollowUpdate) SetType(eft enums.HPFollowType) *HPFollowUpdate {
	hfu.mutation.SetType(eft)
	return hfu
}

// SetNillableType sets the "type" field if the given value is not nil.
func (hfu *HPFollowUpdate) SetNillableType(eft *enums.HPFollowType) *HPFollowUpdate {
	if eft != nil {
		hfu.SetType(*eft)
	}
	return hfu
}

// SetUserID sets the "user" edge to the User entity by ID.
func (hfu *HPFollowUpdate) SetUserID(id int) *HPFollowUpdate {
	hfu.mutation.SetUserID(id)
	return hfu
}

// SetUser sets the "user" edge to the User entity.
func (hfu *HPFollowUpdate) SetUser(u *User) *HPFollowUpdate {
	return hfu.SetUserID(u.ID)
}

// SetMemberID sets the "member" edge to the HPMember entity by ID.
func (hfu *HPFollowUpdate) SetMemberID(id int) *HPFollowUpdate {
	hfu.mutation.SetMemberID(id)
	return hfu
}

// SetMember sets the "member" edge to the HPMember entity.
func (hfu *HPFollowUpdate) SetMember(h *HPMember) *HPFollowUpdate {
	return hfu.SetMemberID(h.ID)
}

// Mutation returns the HPFollowMutation object of the builder.
func (hfu *HPFollowUpdate) Mutation() *HPFollowMutation {
	return hfu.mutation
}

// ClearUser clears the "user" edge to the User entity.
func (hfu *HPFollowUpdate) ClearUser() *HPFollowUpdate {
	hfu.mutation.ClearUser()
	return hfu
}

// ClearMember clears the "member" edge to the HPMember entity.
func (hfu *HPFollowUpdate) ClearMember() *HPFollowUpdate {
	hfu.mutation.ClearMember()
	return hfu
}

// Save executes the query and returns the number of nodes affected by the update operation.
func (hfu *HPFollowUpdate) Save(ctx context.Context) (int, error) {
	return withHooks[int, HPFollowMutation](ctx, hfu.sqlSave, hfu.mutation, hfu.hooks)
}

// SaveX is like Save, but panics if an error occurs.
func (hfu *HPFollowUpdate) SaveX(ctx context.Context) int {
	affected, err := hfu.Save(ctx)
	if err != nil {
		panic(err)
	}
	return affected
}

// Exec executes the query.
func (hfu *HPFollowUpdate) Exec(ctx context.Context) error {
	_, err := hfu.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (hfu *HPFollowUpdate) ExecX(ctx context.Context) {
	if err := hfu.Exec(ctx); err != nil {
		panic(err)
	}
}

// check runs all checks and user-defined validators on the builder.
func (hfu *HPFollowUpdate) check() error {
	if v, ok := hfu.mutation.GetType(); ok {
		if err := hpfollow.TypeValidator(v); err != nil {
			return &ValidationError{Name: "type", err: fmt.Errorf(`ent: validator failed for field "HPFollow.type": %w`, err)}
		}
	}
	if _, ok := hfu.mutation.UserID(); hfu.mutation.UserCleared() && !ok {
		return errors.New(`ent: clearing a required unique edge "HPFollow.user"`)
	}
	if _, ok := hfu.mutation.MemberID(); hfu.mutation.MemberCleared() && !ok {
		return errors.New(`ent: clearing a required unique edge "HPFollow.member"`)
	}
	return nil
}

func (hfu *HPFollowUpdate) sqlSave(ctx context.Context) (n int, err error) {
	if err := hfu.check(); err != nil {
		return n, err
	}
	_spec := sqlgraph.NewUpdateSpec(hpfollow.Table, hpfollow.Columns, sqlgraph.NewFieldSpec(hpfollow.FieldID, field.TypeInt))
	if ps := hfu.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if hfu.mutation.CreatedAtCleared() {
		_spec.ClearField(hpfollow.FieldCreatedAt, field.TypeTime)
	}
	if value, ok := hfu.mutation.UpdatedAt(); ok {
		_spec.SetField(hpfollow.FieldUpdatedAt, field.TypeTime, value)
	}
	if hfu.mutation.UpdatedAtCleared() {
		_spec.ClearField(hpfollow.FieldUpdatedAt, field.TypeTime)
	}
	if value, ok := hfu.mutation.GetType(); ok {
		_spec.SetField(hpfollow.FieldType, field.TypeEnum, value)
	}
	if hfu.mutation.UserCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   hpfollow.UserTable,
			Columns: []string{hpfollow.UserColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(user.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := hfu.mutation.UserIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   hpfollow.UserTable,
			Columns: []string{hpfollow.UserColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(user.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if hfu.mutation.MemberCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: false,
			Table:   hpfollow.MemberTable,
			Columns: []string{hpfollow.MemberColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpmember.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := hfu.mutation.MemberIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: false,
			Table:   hpfollow.MemberTable,
			Columns: []string{hpfollow.MemberColumn},
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
	if n, err = sqlgraph.UpdateNodes(ctx, hfu.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{hpfollow.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return 0, err
	}
	hfu.mutation.done = true
	return n, nil
}

// HPFollowUpdateOne is the builder for updating a single HPFollow entity.
type HPFollowUpdateOne struct {
	config
	fields   []string
	hooks    []Hook
	mutation *HPFollowMutation
}

// SetUpdatedAt sets the "updated_at" field.
func (hfuo *HPFollowUpdateOne) SetUpdatedAt(t time.Time) *HPFollowUpdateOne {
	hfuo.mutation.SetUpdatedAt(t)
	return hfuo
}

// SetNillableUpdatedAt sets the "updated_at" field if the given value is not nil.
func (hfuo *HPFollowUpdateOne) SetNillableUpdatedAt(t *time.Time) *HPFollowUpdateOne {
	if t != nil {
		hfuo.SetUpdatedAt(*t)
	}
	return hfuo
}

// ClearUpdatedAt clears the value of the "updated_at" field.
func (hfuo *HPFollowUpdateOne) ClearUpdatedAt() *HPFollowUpdateOne {
	hfuo.mutation.ClearUpdatedAt()
	return hfuo
}

// SetType sets the "type" field.
func (hfuo *HPFollowUpdateOne) SetType(eft enums.HPFollowType) *HPFollowUpdateOne {
	hfuo.mutation.SetType(eft)
	return hfuo
}

// SetNillableType sets the "type" field if the given value is not nil.
func (hfuo *HPFollowUpdateOne) SetNillableType(eft *enums.HPFollowType) *HPFollowUpdateOne {
	if eft != nil {
		hfuo.SetType(*eft)
	}
	return hfuo
}

// SetUserID sets the "user" edge to the User entity by ID.
func (hfuo *HPFollowUpdateOne) SetUserID(id int) *HPFollowUpdateOne {
	hfuo.mutation.SetUserID(id)
	return hfuo
}

// SetUser sets the "user" edge to the User entity.
func (hfuo *HPFollowUpdateOne) SetUser(u *User) *HPFollowUpdateOne {
	return hfuo.SetUserID(u.ID)
}

// SetMemberID sets the "member" edge to the HPMember entity by ID.
func (hfuo *HPFollowUpdateOne) SetMemberID(id int) *HPFollowUpdateOne {
	hfuo.mutation.SetMemberID(id)
	return hfuo
}

// SetMember sets the "member" edge to the HPMember entity.
func (hfuo *HPFollowUpdateOne) SetMember(h *HPMember) *HPFollowUpdateOne {
	return hfuo.SetMemberID(h.ID)
}

// Mutation returns the HPFollowMutation object of the builder.
func (hfuo *HPFollowUpdateOne) Mutation() *HPFollowMutation {
	return hfuo.mutation
}

// ClearUser clears the "user" edge to the User entity.
func (hfuo *HPFollowUpdateOne) ClearUser() *HPFollowUpdateOne {
	hfuo.mutation.ClearUser()
	return hfuo
}

// ClearMember clears the "member" edge to the HPMember entity.
func (hfuo *HPFollowUpdateOne) ClearMember() *HPFollowUpdateOne {
	hfuo.mutation.ClearMember()
	return hfuo
}

// Where appends a list predicates to the HPFollowUpdate builder.
func (hfuo *HPFollowUpdateOne) Where(ps ...predicate.HPFollow) *HPFollowUpdateOne {
	hfuo.mutation.Where(ps...)
	return hfuo
}

// Select allows selecting one or more fields (columns) of the returned entity.
// The default is selecting all fields defined in the entity schema.
func (hfuo *HPFollowUpdateOne) Select(field string, fields ...string) *HPFollowUpdateOne {
	hfuo.fields = append([]string{field}, fields...)
	return hfuo
}

// Save executes the query and returns the updated HPFollow entity.
func (hfuo *HPFollowUpdateOne) Save(ctx context.Context) (*HPFollow, error) {
	return withHooks[*HPFollow, HPFollowMutation](ctx, hfuo.sqlSave, hfuo.mutation, hfuo.hooks)
}

// SaveX is like Save, but panics if an error occurs.
func (hfuo *HPFollowUpdateOne) SaveX(ctx context.Context) *HPFollow {
	node, err := hfuo.Save(ctx)
	if err != nil {
		panic(err)
	}
	return node
}

// Exec executes the query on the entity.
func (hfuo *HPFollowUpdateOne) Exec(ctx context.Context) error {
	_, err := hfuo.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (hfuo *HPFollowUpdateOne) ExecX(ctx context.Context) {
	if err := hfuo.Exec(ctx); err != nil {
		panic(err)
	}
}

// check runs all checks and user-defined validators on the builder.
func (hfuo *HPFollowUpdateOne) check() error {
	if v, ok := hfuo.mutation.GetType(); ok {
		if err := hpfollow.TypeValidator(v); err != nil {
			return &ValidationError{Name: "type", err: fmt.Errorf(`ent: validator failed for field "HPFollow.type": %w`, err)}
		}
	}
	if _, ok := hfuo.mutation.UserID(); hfuo.mutation.UserCleared() && !ok {
		return errors.New(`ent: clearing a required unique edge "HPFollow.user"`)
	}
	if _, ok := hfuo.mutation.MemberID(); hfuo.mutation.MemberCleared() && !ok {
		return errors.New(`ent: clearing a required unique edge "HPFollow.member"`)
	}
	return nil
}

func (hfuo *HPFollowUpdateOne) sqlSave(ctx context.Context) (_node *HPFollow, err error) {
	if err := hfuo.check(); err != nil {
		return _node, err
	}
	_spec := sqlgraph.NewUpdateSpec(hpfollow.Table, hpfollow.Columns, sqlgraph.NewFieldSpec(hpfollow.FieldID, field.TypeInt))
	id, ok := hfuo.mutation.ID()
	if !ok {
		return nil, &ValidationError{Name: "id", err: errors.New(`ent: missing "HPFollow.id" for update`)}
	}
	_spec.Node.ID.Value = id
	if fields := hfuo.fields; len(fields) > 0 {
		_spec.Node.Columns = make([]string, 0, len(fields))
		_spec.Node.Columns = append(_spec.Node.Columns, hpfollow.FieldID)
		for _, f := range fields {
			if !hpfollow.ValidColumn(f) {
				return nil, &ValidationError{Name: f, err: fmt.Errorf("ent: invalid field %q for query", f)}
			}
			if f != hpfollow.FieldID {
				_spec.Node.Columns = append(_spec.Node.Columns, f)
			}
		}
	}
	if ps := hfuo.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if hfuo.mutation.CreatedAtCleared() {
		_spec.ClearField(hpfollow.FieldCreatedAt, field.TypeTime)
	}
	if value, ok := hfuo.mutation.UpdatedAt(); ok {
		_spec.SetField(hpfollow.FieldUpdatedAt, field.TypeTime, value)
	}
	if hfuo.mutation.UpdatedAtCleared() {
		_spec.ClearField(hpfollow.FieldUpdatedAt, field.TypeTime)
	}
	if value, ok := hfuo.mutation.GetType(); ok {
		_spec.SetField(hpfollow.FieldType, field.TypeEnum, value)
	}
	if hfuo.mutation.UserCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   hpfollow.UserTable,
			Columns: []string{hpfollow.UserColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(user.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := hfuo.mutation.UserIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   hpfollow.UserTable,
			Columns: []string{hpfollow.UserColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(user.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if hfuo.mutation.MemberCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: false,
			Table:   hpfollow.MemberTable,
			Columns: []string{hpfollow.MemberColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpmember.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := hfuo.mutation.MemberIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: false,
			Table:   hpfollow.MemberTable,
			Columns: []string{hpfollow.MemberColumn},
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
	_node = &HPFollow{config: hfuo.config}
	_spec.Assign = _node.assignValues
	_spec.ScanValues = _node.scanValues
	if err = sqlgraph.UpdateNode(ctx, hfuo.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{hpfollow.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return nil, err
	}
	hfuo.mutation.done = true
	return _node, nil
}
