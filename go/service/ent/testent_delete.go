// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
	"github.com/yssk22/hpapp/go/service/ent/predicate"
	"github.com/yssk22/hpapp/go/service/ent/testent"
)

// TestEntDelete is the builder for deleting a TestEnt entity.
type TestEntDelete struct {
	config
	hooks    []Hook
	mutation *TestEntMutation
}

// Where appends a list predicates to the TestEntDelete builder.
func (ted *TestEntDelete) Where(ps ...predicate.TestEnt) *TestEntDelete {
	ted.mutation.Where(ps...)
	return ted
}

// Exec executes the deletion query and returns how many vertices were deleted.
func (ted *TestEntDelete) Exec(ctx context.Context) (int, error) {
	return withHooks[int, TestEntMutation](ctx, ted.sqlExec, ted.mutation, ted.hooks)
}

// ExecX is like Exec, but panics if an error occurs.
func (ted *TestEntDelete) ExecX(ctx context.Context) int {
	n, err := ted.Exec(ctx)
	if err != nil {
		panic(err)
	}
	return n
}

func (ted *TestEntDelete) sqlExec(ctx context.Context) (int, error) {
	_spec := sqlgraph.NewDeleteSpec(testent.Table, sqlgraph.NewFieldSpec(testent.FieldID, field.TypeInt))
	if ps := ted.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	affected, err := sqlgraph.DeleteNodes(ctx, ted.driver, _spec)
	if err != nil && sqlgraph.IsConstraintError(err) {
		err = &ConstraintError{msg: err.Error(), wrap: err}
	}
	ted.mutation.done = true
	return affected, err
}

// TestEntDeleteOne is the builder for deleting a single TestEnt entity.
type TestEntDeleteOne struct {
	ted *TestEntDelete
}

// Where appends a list predicates to the TestEntDelete builder.
func (tedo *TestEntDeleteOne) Where(ps ...predicate.TestEnt) *TestEntDeleteOne {
	tedo.ted.mutation.Where(ps...)
	return tedo
}

// Exec executes the deletion query.
func (tedo *TestEntDeleteOne) Exec(ctx context.Context) error {
	n, err := tedo.ted.Exec(ctx)
	switch {
	case err != nil:
		return err
	case n == 0:
		return &NotFoundError{testent.Label}
	default:
		return nil
	}
}

// ExecX is like Exec, but panics if an error occurs.
func (tedo *TestEntDeleteOne) ExecX(ctx context.Context) {
	if err := tedo.Exec(ctx); err != nil {
		panic(err)
	}
}
