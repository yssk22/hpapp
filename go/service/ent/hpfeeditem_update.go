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
	"github.com/yssk22/hpapp/go/service/ent/hpfeeditem"
	"github.com/yssk22/hpapp/go/service/ent/hpmember"
	"github.com/yssk22/hpapp/go/service/ent/hpviewhistory"
	"github.com/yssk22/hpapp/go/service/ent/predicate"
	"github.com/yssk22/hpapp/go/service/schema/enums"
	"github.com/yssk22/hpapp/go/service/schema/jsonfields"
)

// HPFeedItemUpdate is the builder for updating HPFeedItem entities.
type HPFeedItemUpdate struct {
	config
	hooks    []Hook
	mutation *HPFeedItemMutation
}

// Where appends a list predicates to the HPFeedItemUpdate builder.
func (hfiu *HPFeedItemUpdate) Where(ps ...predicate.HPFeedItem) *HPFeedItemUpdate {
	hfiu.mutation.Where(ps...)
	return hfiu
}

// SetUpdatedAt sets the "updated_at" field.
func (hfiu *HPFeedItemUpdate) SetUpdatedAt(t time.Time) *HPFeedItemUpdate {
	hfiu.mutation.SetUpdatedAt(t)
	return hfiu
}

// SetNillableUpdatedAt sets the "updated_at" field if the given value is not nil.
func (hfiu *HPFeedItemUpdate) SetNillableUpdatedAt(t *time.Time) *HPFeedItemUpdate {
	if t != nil {
		hfiu.SetUpdatedAt(*t)
	}
	return hfiu
}

// ClearUpdatedAt clears the value of the "updated_at" field.
func (hfiu *HPFeedItemUpdate) ClearUpdatedAt() *HPFeedItemUpdate {
	hfiu.mutation.ClearUpdatedAt()
	return hfiu
}

// SetSourceID sets the "source_id" field.
func (hfiu *HPFeedItemUpdate) SetSourceID(i int) *HPFeedItemUpdate {
	hfiu.mutation.ResetSourceID()
	hfiu.mutation.SetSourceID(i)
	return hfiu
}

// AddSourceID adds i to the "source_id" field.
func (hfiu *HPFeedItemUpdate) AddSourceID(i int) *HPFeedItemUpdate {
	hfiu.mutation.AddSourceID(i)
	return hfiu
}

// SetAssetType sets the "asset_type" field.
func (hfiu *HPFeedItemUpdate) SetAssetType(eat enums.HPAssetType) *HPFeedItemUpdate {
	hfiu.mutation.SetAssetType(eat)
	return hfiu
}

// SetNillableAssetType sets the "asset_type" field if the given value is not nil.
func (hfiu *HPFeedItemUpdate) SetNillableAssetType(eat *enums.HPAssetType) *HPFeedItemUpdate {
	if eat != nil {
		hfiu.SetAssetType(*eat)
	}
	return hfiu
}

// SetTitle sets the "title" field.
func (hfiu *HPFeedItemUpdate) SetTitle(s string) *HPFeedItemUpdate {
	hfiu.mutation.SetTitle(s)
	return hfiu
}

// SetPostAt sets the "post_at" field.
func (hfiu *HPFeedItemUpdate) SetPostAt(t time.Time) *HPFeedItemUpdate {
	hfiu.mutation.SetPostAt(t)
	return hfiu
}

// SetSourceURL sets the "source_url" field.
func (hfiu *HPFeedItemUpdate) SetSourceURL(s string) *HPFeedItemUpdate {
	hfiu.mutation.SetSourceURL(s)
	return hfiu
}

// SetImageURL sets the "image_url" field.
func (hfiu *HPFeedItemUpdate) SetImageURL(s string) *HPFeedItemUpdate {
	hfiu.mutation.SetImageURL(s)
	return hfiu
}

// SetNillableImageURL sets the "image_url" field if the given value is not nil.
func (hfiu *HPFeedItemUpdate) SetNillableImageURL(s *string) *HPFeedItemUpdate {
	if s != nil {
		hfiu.SetImageURL(*s)
	}
	return hfiu
}

// ClearImageURL clears the value of the "image_url" field.
func (hfiu *HPFeedItemUpdate) ClearImageURL() *HPFeedItemUpdate {
	hfiu.mutation.ClearImageURL()
	return hfiu
}

// SetMedia sets the "media" field.
func (hfiu *HPFeedItemUpdate) SetMedia(j []jsonfields.Media) *HPFeedItemUpdate {
	hfiu.mutation.SetMedia(j)
	return hfiu
}

// AppendMedia appends j to the "media" field.
func (hfiu *HPFeedItemUpdate) AppendMedia(j []jsonfields.Media) *HPFeedItemUpdate {
	hfiu.mutation.AppendMedia(j)
	return hfiu
}

// SetOwnerArtistID sets the "owner_artist_id" field.
func (hfiu *HPFeedItemUpdate) SetOwnerArtistID(i int) *HPFeedItemUpdate {
	hfiu.mutation.SetOwnerArtistID(i)
	return hfiu
}

// SetNillableOwnerArtistID sets the "owner_artist_id" field if the given value is not nil.
func (hfiu *HPFeedItemUpdate) SetNillableOwnerArtistID(i *int) *HPFeedItemUpdate {
	if i != nil {
		hfiu.SetOwnerArtistID(*i)
	}
	return hfiu
}

// ClearOwnerArtistID clears the value of the "owner_artist_id" field.
func (hfiu *HPFeedItemUpdate) ClearOwnerArtistID() *HPFeedItemUpdate {
	hfiu.mutation.ClearOwnerArtistID()
	return hfiu
}

// SetOwnerMemberID sets the "owner_member_id" field.
func (hfiu *HPFeedItemUpdate) SetOwnerMemberID(i int) *HPFeedItemUpdate {
	hfiu.mutation.SetOwnerMemberID(i)
	return hfiu
}

// SetNillableOwnerMemberID sets the "owner_member_id" field if the given value is not nil.
func (hfiu *HPFeedItemUpdate) SetNillableOwnerMemberID(i *int) *HPFeedItemUpdate {
	if i != nil {
		hfiu.SetOwnerMemberID(*i)
	}
	return hfiu
}

// ClearOwnerMemberID clears the value of the "owner_member_id" field.
func (hfiu *HPFeedItemUpdate) ClearOwnerMemberID() *HPFeedItemUpdate {
	hfiu.mutation.ClearOwnerMemberID()
	return hfiu
}

// AddViewHistoryIDs adds the "view_histories" edge to the HPViewHistory entity by IDs.
func (hfiu *HPFeedItemUpdate) AddViewHistoryIDs(ids ...int) *HPFeedItemUpdate {
	hfiu.mutation.AddViewHistoryIDs(ids...)
	return hfiu
}

// AddViewHistories adds the "view_histories" edges to the HPViewHistory entity.
func (hfiu *HPFeedItemUpdate) AddViewHistories(h ...*HPViewHistory) *HPFeedItemUpdate {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return hfiu.AddViewHistoryIDs(ids...)
}

// SetOwnerArtist sets the "owner_artist" edge to the HPArtist entity.
func (hfiu *HPFeedItemUpdate) SetOwnerArtist(h *HPArtist) *HPFeedItemUpdate {
	return hfiu.SetOwnerArtistID(h.ID)
}

// SetOwnerMember sets the "owner_member" edge to the HPMember entity.
func (hfiu *HPFeedItemUpdate) SetOwnerMember(h *HPMember) *HPFeedItemUpdate {
	return hfiu.SetOwnerMemberID(h.ID)
}

// AddTaggedArtistIDs adds the "tagged_artists" edge to the HPArtist entity by IDs.
func (hfiu *HPFeedItemUpdate) AddTaggedArtistIDs(ids ...int) *HPFeedItemUpdate {
	hfiu.mutation.AddTaggedArtistIDs(ids...)
	return hfiu
}

// AddTaggedArtists adds the "tagged_artists" edges to the HPArtist entity.
func (hfiu *HPFeedItemUpdate) AddTaggedArtists(h ...*HPArtist) *HPFeedItemUpdate {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return hfiu.AddTaggedArtistIDs(ids...)
}

// AddTaggedMemberIDs adds the "tagged_members" edge to the HPMember entity by IDs.
func (hfiu *HPFeedItemUpdate) AddTaggedMemberIDs(ids ...int) *HPFeedItemUpdate {
	hfiu.mutation.AddTaggedMemberIDs(ids...)
	return hfiu
}

// AddTaggedMembers adds the "tagged_members" edges to the HPMember entity.
func (hfiu *HPFeedItemUpdate) AddTaggedMembers(h ...*HPMember) *HPFeedItemUpdate {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return hfiu.AddTaggedMemberIDs(ids...)
}

// Mutation returns the HPFeedItemMutation object of the builder.
func (hfiu *HPFeedItemUpdate) Mutation() *HPFeedItemMutation {
	return hfiu.mutation
}

// ClearViewHistories clears all "view_histories" edges to the HPViewHistory entity.
func (hfiu *HPFeedItemUpdate) ClearViewHistories() *HPFeedItemUpdate {
	hfiu.mutation.ClearViewHistories()
	return hfiu
}

// RemoveViewHistoryIDs removes the "view_histories" edge to HPViewHistory entities by IDs.
func (hfiu *HPFeedItemUpdate) RemoveViewHistoryIDs(ids ...int) *HPFeedItemUpdate {
	hfiu.mutation.RemoveViewHistoryIDs(ids...)
	return hfiu
}

// RemoveViewHistories removes "view_histories" edges to HPViewHistory entities.
func (hfiu *HPFeedItemUpdate) RemoveViewHistories(h ...*HPViewHistory) *HPFeedItemUpdate {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return hfiu.RemoveViewHistoryIDs(ids...)
}

// ClearOwnerArtist clears the "owner_artist" edge to the HPArtist entity.
func (hfiu *HPFeedItemUpdate) ClearOwnerArtist() *HPFeedItemUpdate {
	hfiu.mutation.ClearOwnerArtist()
	return hfiu
}

// ClearOwnerMember clears the "owner_member" edge to the HPMember entity.
func (hfiu *HPFeedItemUpdate) ClearOwnerMember() *HPFeedItemUpdate {
	hfiu.mutation.ClearOwnerMember()
	return hfiu
}

// ClearTaggedArtists clears all "tagged_artists" edges to the HPArtist entity.
func (hfiu *HPFeedItemUpdate) ClearTaggedArtists() *HPFeedItemUpdate {
	hfiu.mutation.ClearTaggedArtists()
	return hfiu
}

// RemoveTaggedArtistIDs removes the "tagged_artists" edge to HPArtist entities by IDs.
func (hfiu *HPFeedItemUpdate) RemoveTaggedArtistIDs(ids ...int) *HPFeedItemUpdate {
	hfiu.mutation.RemoveTaggedArtistIDs(ids...)
	return hfiu
}

// RemoveTaggedArtists removes "tagged_artists" edges to HPArtist entities.
func (hfiu *HPFeedItemUpdate) RemoveTaggedArtists(h ...*HPArtist) *HPFeedItemUpdate {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return hfiu.RemoveTaggedArtistIDs(ids...)
}

// ClearTaggedMembers clears all "tagged_members" edges to the HPMember entity.
func (hfiu *HPFeedItemUpdate) ClearTaggedMembers() *HPFeedItemUpdate {
	hfiu.mutation.ClearTaggedMembers()
	return hfiu
}

// RemoveTaggedMemberIDs removes the "tagged_members" edge to HPMember entities by IDs.
func (hfiu *HPFeedItemUpdate) RemoveTaggedMemberIDs(ids ...int) *HPFeedItemUpdate {
	hfiu.mutation.RemoveTaggedMemberIDs(ids...)
	return hfiu
}

// RemoveTaggedMembers removes "tagged_members" edges to HPMember entities.
func (hfiu *HPFeedItemUpdate) RemoveTaggedMembers(h ...*HPMember) *HPFeedItemUpdate {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return hfiu.RemoveTaggedMemberIDs(ids...)
}

// Save executes the query and returns the number of nodes affected by the update operation.
func (hfiu *HPFeedItemUpdate) Save(ctx context.Context) (int, error) {
	return withHooks[int, HPFeedItemMutation](ctx, hfiu.sqlSave, hfiu.mutation, hfiu.hooks)
}

// SaveX is like Save, but panics if an error occurs.
func (hfiu *HPFeedItemUpdate) SaveX(ctx context.Context) int {
	affected, err := hfiu.Save(ctx)
	if err != nil {
		panic(err)
	}
	return affected
}

// Exec executes the query.
func (hfiu *HPFeedItemUpdate) Exec(ctx context.Context) error {
	_, err := hfiu.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (hfiu *HPFeedItemUpdate) ExecX(ctx context.Context) {
	if err := hfiu.Exec(ctx); err != nil {
		panic(err)
	}
}

// check runs all checks and user-defined validators on the builder.
func (hfiu *HPFeedItemUpdate) check() error {
	if v, ok := hfiu.mutation.AssetType(); ok {
		if err := hpfeeditem.AssetTypeValidator(v); err != nil {
			return &ValidationError{Name: "asset_type", err: fmt.Errorf(`ent: validator failed for field "HPFeedItem.asset_type": %w`, err)}
		}
	}
	return nil
}

func (hfiu *HPFeedItemUpdate) sqlSave(ctx context.Context) (n int, err error) {
	if err := hfiu.check(); err != nil {
		return n, err
	}
	_spec := sqlgraph.NewUpdateSpec(hpfeeditem.Table, hpfeeditem.Columns, sqlgraph.NewFieldSpec(hpfeeditem.FieldID, field.TypeInt))
	if ps := hfiu.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if hfiu.mutation.CreatedAtCleared() {
		_spec.ClearField(hpfeeditem.FieldCreatedAt, field.TypeTime)
	}
	if value, ok := hfiu.mutation.UpdatedAt(); ok {
		_spec.SetField(hpfeeditem.FieldUpdatedAt, field.TypeTime, value)
	}
	if hfiu.mutation.UpdatedAtCleared() {
		_spec.ClearField(hpfeeditem.FieldUpdatedAt, field.TypeTime)
	}
	if value, ok := hfiu.mutation.SourceID(); ok {
		_spec.SetField(hpfeeditem.FieldSourceID, field.TypeInt, value)
	}
	if value, ok := hfiu.mutation.AddedSourceID(); ok {
		_spec.AddField(hpfeeditem.FieldSourceID, field.TypeInt, value)
	}
	if value, ok := hfiu.mutation.AssetType(); ok {
		_spec.SetField(hpfeeditem.FieldAssetType, field.TypeEnum, value)
	}
	if value, ok := hfiu.mutation.Title(); ok {
		_spec.SetField(hpfeeditem.FieldTitle, field.TypeString, value)
	}
	if value, ok := hfiu.mutation.PostAt(); ok {
		_spec.SetField(hpfeeditem.FieldPostAt, field.TypeTime, value)
	}
	if value, ok := hfiu.mutation.SourceURL(); ok {
		_spec.SetField(hpfeeditem.FieldSourceURL, field.TypeString, value)
	}
	if value, ok := hfiu.mutation.ImageURL(); ok {
		_spec.SetField(hpfeeditem.FieldImageURL, field.TypeString, value)
	}
	if hfiu.mutation.ImageURLCleared() {
		_spec.ClearField(hpfeeditem.FieldImageURL, field.TypeString)
	}
	if value, ok := hfiu.mutation.Media(); ok {
		_spec.SetField(hpfeeditem.FieldMedia, field.TypeJSON, value)
	}
	if value, ok := hfiu.mutation.AppendedMedia(); ok {
		_spec.AddModifier(func(u *sql.UpdateBuilder) {
			sqljson.Append(u, hpfeeditem.FieldMedia, value)
		})
	}
	if hfiu.mutation.ViewHistoriesCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   hpfeeditem.ViewHistoriesTable,
			Columns: []string{hpfeeditem.ViewHistoriesColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpviewhistory.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := hfiu.mutation.RemovedViewHistoriesIDs(); len(nodes) > 0 && !hfiu.mutation.ViewHistoriesCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   hpfeeditem.ViewHistoriesTable,
			Columns: []string{hpfeeditem.ViewHistoriesColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpviewhistory.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := hfiu.mutation.ViewHistoriesIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   hpfeeditem.ViewHistoriesTable,
			Columns: []string{hpfeeditem.ViewHistoriesColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpviewhistory.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if hfiu.mutation.OwnerArtistCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   hpfeeditem.OwnerArtistTable,
			Columns: []string{hpfeeditem.OwnerArtistColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpartist.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := hfiu.mutation.OwnerArtistIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   hpfeeditem.OwnerArtistTable,
			Columns: []string{hpfeeditem.OwnerArtistColumn},
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
	if hfiu.mutation.OwnerMemberCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   hpfeeditem.OwnerMemberTable,
			Columns: []string{hpfeeditem.OwnerMemberColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpmember.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := hfiu.mutation.OwnerMemberIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   hpfeeditem.OwnerMemberTable,
			Columns: []string{hpfeeditem.OwnerMemberColumn},
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
	if hfiu.mutation.TaggedArtistsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   hpfeeditem.TaggedArtistsTable,
			Columns: hpfeeditem.TaggedArtistsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpartist.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := hfiu.mutation.RemovedTaggedArtistsIDs(); len(nodes) > 0 && !hfiu.mutation.TaggedArtistsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   hpfeeditem.TaggedArtistsTable,
			Columns: hpfeeditem.TaggedArtistsPrimaryKey,
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
	if nodes := hfiu.mutation.TaggedArtistsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   hpfeeditem.TaggedArtistsTable,
			Columns: hpfeeditem.TaggedArtistsPrimaryKey,
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
	if hfiu.mutation.TaggedMembersCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   hpfeeditem.TaggedMembersTable,
			Columns: hpfeeditem.TaggedMembersPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpmember.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := hfiu.mutation.RemovedTaggedMembersIDs(); len(nodes) > 0 && !hfiu.mutation.TaggedMembersCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   hpfeeditem.TaggedMembersTable,
			Columns: hpfeeditem.TaggedMembersPrimaryKey,
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
	if nodes := hfiu.mutation.TaggedMembersIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   hpfeeditem.TaggedMembersTable,
			Columns: hpfeeditem.TaggedMembersPrimaryKey,
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
	if n, err = sqlgraph.UpdateNodes(ctx, hfiu.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{hpfeeditem.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return 0, err
	}
	hfiu.mutation.done = true
	return n, nil
}

// HPFeedItemUpdateOne is the builder for updating a single HPFeedItem entity.
type HPFeedItemUpdateOne struct {
	config
	fields   []string
	hooks    []Hook
	mutation *HPFeedItemMutation
}

// SetUpdatedAt sets the "updated_at" field.
func (hfiuo *HPFeedItemUpdateOne) SetUpdatedAt(t time.Time) *HPFeedItemUpdateOne {
	hfiuo.mutation.SetUpdatedAt(t)
	return hfiuo
}

// SetNillableUpdatedAt sets the "updated_at" field if the given value is not nil.
func (hfiuo *HPFeedItemUpdateOne) SetNillableUpdatedAt(t *time.Time) *HPFeedItemUpdateOne {
	if t != nil {
		hfiuo.SetUpdatedAt(*t)
	}
	return hfiuo
}

// ClearUpdatedAt clears the value of the "updated_at" field.
func (hfiuo *HPFeedItemUpdateOne) ClearUpdatedAt() *HPFeedItemUpdateOne {
	hfiuo.mutation.ClearUpdatedAt()
	return hfiuo
}

// SetSourceID sets the "source_id" field.
func (hfiuo *HPFeedItemUpdateOne) SetSourceID(i int) *HPFeedItemUpdateOne {
	hfiuo.mutation.ResetSourceID()
	hfiuo.mutation.SetSourceID(i)
	return hfiuo
}

// AddSourceID adds i to the "source_id" field.
func (hfiuo *HPFeedItemUpdateOne) AddSourceID(i int) *HPFeedItemUpdateOne {
	hfiuo.mutation.AddSourceID(i)
	return hfiuo
}

// SetAssetType sets the "asset_type" field.
func (hfiuo *HPFeedItemUpdateOne) SetAssetType(eat enums.HPAssetType) *HPFeedItemUpdateOne {
	hfiuo.mutation.SetAssetType(eat)
	return hfiuo
}

// SetNillableAssetType sets the "asset_type" field if the given value is not nil.
func (hfiuo *HPFeedItemUpdateOne) SetNillableAssetType(eat *enums.HPAssetType) *HPFeedItemUpdateOne {
	if eat != nil {
		hfiuo.SetAssetType(*eat)
	}
	return hfiuo
}

// SetTitle sets the "title" field.
func (hfiuo *HPFeedItemUpdateOne) SetTitle(s string) *HPFeedItemUpdateOne {
	hfiuo.mutation.SetTitle(s)
	return hfiuo
}

// SetPostAt sets the "post_at" field.
func (hfiuo *HPFeedItemUpdateOne) SetPostAt(t time.Time) *HPFeedItemUpdateOne {
	hfiuo.mutation.SetPostAt(t)
	return hfiuo
}

// SetSourceURL sets the "source_url" field.
func (hfiuo *HPFeedItemUpdateOne) SetSourceURL(s string) *HPFeedItemUpdateOne {
	hfiuo.mutation.SetSourceURL(s)
	return hfiuo
}

// SetImageURL sets the "image_url" field.
func (hfiuo *HPFeedItemUpdateOne) SetImageURL(s string) *HPFeedItemUpdateOne {
	hfiuo.mutation.SetImageURL(s)
	return hfiuo
}

// SetNillableImageURL sets the "image_url" field if the given value is not nil.
func (hfiuo *HPFeedItemUpdateOne) SetNillableImageURL(s *string) *HPFeedItemUpdateOne {
	if s != nil {
		hfiuo.SetImageURL(*s)
	}
	return hfiuo
}

// ClearImageURL clears the value of the "image_url" field.
func (hfiuo *HPFeedItemUpdateOne) ClearImageURL() *HPFeedItemUpdateOne {
	hfiuo.mutation.ClearImageURL()
	return hfiuo
}

// SetMedia sets the "media" field.
func (hfiuo *HPFeedItemUpdateOne) SetMedia(j []jsonfields.Media) *HPFeedItemUpdateOne {
	hfiuo.mutation.SetMedia(j)
	return hfiuo
}

// AppendMedia appends j to the "media" field.
func (hfiuo *HPFeedItemUpdateOne) AppendMedia(j []jsonfields.Media) *HPFeedItemUpdateOne {
	hfiuo.mutation.AppendMedia(j)
	return hfiuo
}

// SetOwnerArtistID sets the "owner_artist_id" field.
func (hfiuo *HPFeedItemUpdateOne) SetOwnerArtistID(i int) *HPFeedItemUpdateOne {
	hfiuo.mutation.SetOwnerArtistID(i)
	return hfiuo
}

// SetNillableOwnerArtistID sets the "owner_artist_id" field if the given value is not nil.
func (hfiuo *HPFeedItemUpdateOne) SetNillableOwnerArtistID(i *int) *HPFeedItemUpdateOne {
	if i != nil {
		hfiuo.SetOwnerArtistID(*i)
	}
	return hfiuo
}

// ClearOwnerArtistID clears the value of the "owner_artist_id" field.
func (hfiuo *HPFeedItemUpdateOne) ClearOwnerArtistID() *HPFeedItemUpdateOne {
	hfiuo.mutation.ClearOwnerArtistID()
	return hfiuo
}

// SetOwnerMemberID sets the "owner_member_id" field.
func (hfiuo *HPFeedItemUpdateOne) SetOwnerMemberID(i int) *HPFeedItemUpdateOne {
	hfiuo.mutation.SetOwnerMemberID(i)
	return hfiuo
}

// SetNillableOwnerMemberID sets the "owner_member_id" field if the given value is not nil.
func (hfiuo *HPFeedItemUpdateOne) SetNillableOwnerMemberID(i *int) *HPFeedItemUpdateOne {
	if i != nil {
		hfiuo.SetOwnerMemberID(*i)
	}
	return hfiuo
}

// ClearOwnerMemberID clears the value of the "owner_member_id" field.
func (hfiuo *HPFeedItemUpdateOne) ClearOwnerMemberID() *HPFeedItemUpdateOne {
	hfiuo.mutation.ClearOwnerMemberID()
	return hfiuo
}

// AddViewHistoryIDs adds the "view_histories" edge to the HPViewHistory entity by IDs.
func (hfiuo *HPFeedItemUpdateOne) AddViewHistoryIDs(ids ...int) *HPFeedItemUpdateOne {
	hfiuo.mutation.AddViewHistoryIDs(ids...)
	return hfiuo
}

// AddViewHistories adds the "view_histories" edges to the HPViewHistory entity.
func (hfiuo *HPFeedItemUpdateOne) AddViewHistories(h ...*HPViewHistory) *HPFeedItemUpdateOne {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return hfiuo.AddViewHistoryIDs(ids...)
}

// SetOwnerArtist sets the "owner_artist" edge to the HPArtist entity.
func (hfiuo *HPFeedItemUpdateOne) SetOwnerArtist(h *HPArtist) *HPFeedItemUpdateOne {
	return hfiuo.SetOwnerArtistID(h.ID)
}

// SetOwnerMember sets the "owner_member" edge to the HPMember entity.
func (hfiuo *HPFeedItemUpdateOne) SetOwnerMember(h *HPMember) *HPFeedItemUpdateOne {
	return hfiuo.SetOwnerMemberID(h.ID)
}

// AddTaggedArtistIDs adds the "tagged_artists" edge to the HPArtist entity by IDs.
func (hfiuo *HPFeedItemUpdateOne) AddTaggedArtistIDs(ids ...int) *HPFeedItemUpdateOne {
	hfiuo.mutation.AddTaggedArtistIDs(ids...)
	return hfiuo
}

// AddTaggedArtists adds the "tagged_artists" edges to the HPArtist entity.
func (hfiuo *HPFeedItemUpdateOne) AddTaggedArtists(h ...*HPArtist) *HPFeedItemUpdateOne {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return hfiuo.AddTaggedArtistIDs(ids...)
}

// AddTaggedMemberIDs adds the "tagged_members" edge to the HPMember entity by IDs.
func (hfiuo *HPFeedItemUpdateOne) AddTaggedMemberIDs(ids ...int) *HPFeedItemUpdateOne {
	hfiuo.mutation.AddTaggedMemberIDs(ids...)
	return hfiuo
}

// AddTaggedMembers adds the "tagged_members" edges to the HPMember entity.
func (hfiuo *HPFeedItemUpdateOne) AddTaggedMembers(h ...*HPMember) *HPFeedItemUpdateOne {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return hfiuo.AddTaggedMemberIDs(ids...)
}

// Mutation returns the HPFeedItemMutation object of the builder.
func (hfiuo *HPFeedItemUpdateOne) Mutation() *HPFeedItemMutation {
	return hfiuo.mutation
}

// ClearViewHistories clears all "view_histories" edges to the HPViewHistory entity.
func (hfiuo *HPFeedItemUpdateOne) ClearViewHistories() *HPFeedItemUpdateOne {
	hfiuo.mutation.ClearViewHistories()
	return hfiuo
}

// RemoveViewHistoryIDs removes the "view_histories" edge to HPViewHistory entities by IDs.
func (hfiuo *HPFeedItemUpdateOne) RemoveViewHistoryIDs(ids ...int) *HPFeedItemUpdateOne {
	hfiuo.mutation.RemoveViewHistoryIDs(ids...)
	return hfiuo
}

// RemoveViewHistories removes "view_histories" edges to HPViewHistory entities.
func (hfiuo *HPFeedItemUpdateOne) RemoveViewHistories(h ...*HPViewHistory) *HPFeedItemUpdateOne {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return hfiuo.RemoveViewHistoryIDs(ids...)
}

// ClearOwnerArtist clears the "owner_artist" edge to the HPArtist entity.
func (hfiuo *HPFeedItemUpdateOne) ClearOwnerArtist() *HPFeedItemUpdateOne {
	hfiuo.mutation.ClearOwnerArtist()
	return hfiuo
}

// ClearOwnerMember clears the "owner_member" edge to the HPMember entity.
func (hfiuo *HPFeedItemUpdateOne) ClearOwnerMember() *HPFeedItemUpdateOne {
	hfiuo.mutation.ClearOwnerMember()
	return hfiuo
}

// ClearTaggedArtists clears all "tagged_artists" edges to the HPArtist entity.
func (hfiuo *HPFeedItemUpdateOne) ClearTaggedArtists() *HPFeedItemUpdateOne {
	hfiuo.mutation.ClearTaggedArtists()
	return hfiuo
}

// RemoveTaggedArtistIDs removes the "tagged_artists" edge to HPArtist entities by IDs.
func (hfiuo *HPFeedItemUpdateOne) RemoveTaggedArtistIDs(ids ...int) *HPFeedItemUpdateOne {
	hfiuo.mutation.RemoveTaggedArtistIDs(ids...)
	return hfiuo
}

// RemoveTaggedArtists removes "tagged_artists" edges to HPArtist entities.
func (hfiuo *HPFeedItemUpdateOne) RemoveTaggedArtists(h ...*HPArtist) *HPFeedItemUpdateOne {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return hfiuo.RemoveTaggedArtistIDs(ids...)
}

// ClearTaggedMembers clears all "tagged_members" edges to the HPMember entity.
func (hfiuo *HPFeedItemUpdateOne) ClearTaggedMembers() *HPFeedItemUpdateOne {
	hfiuo.mutation.ClearTaggedMembers()
	return hfiuo
}

// RemoveTaggedMemberIDs removes the "tagged_members" edge to HPMember entities by IDs.
func (hfiuo *HPFeedItemUpdateOne) RemoveTaggedMemberIDs(ids ...int) *HPFeedItemUpdateOne {
	hfiuo.mutation.RemoveTaggedMemberIDs(ids...)
	return hfiuo
}

// RemoveTaggedMembers removes "tagged_members" edges to HPMember entities.
func (hfiuo *HPFeedItemUpdateOne) RemoveTaggedMembers(h ...*HPMember) *HPFeedItemUpdateOne {
	ids := make([]int, len(h))
	for i := range h {
		ids[i] = h[i].ID
	}
	return hfiuo.RemoveTaggedMemberIDs(ids...)
}

// Where appends a list predicates to the HPFeedItemUpdate builder.
func (hfiuo *HPFeedItemUpdateOne) Where(ps ...predicate.HPFeedItem) *HPFeedItemUpdateOne {
	hfiuo.mutation.Where(ps...)
	return hfiuo
}

// Select allows selecting one or more fields (columns) of the returned entity.
// The default is selecting all fields defined in the entity schema.
func (hfiuo *HPFeedItemUpdateOne) Select(field string, fields ...string) *HPFeedItemUpdateOne {
	hfiuo.fields = append([]string{field}, fields...)
	return hfiuo
}

// Save executes the query and returns the updated HPFeedItem entity.
func (hfiuo *HPFeedItemUpdateOne) Save(ctx context.Context) (*HPFeedItem, error) {
	return withHooks[*HPFeedItem, HPFeedItemMutation](ctx, hfiuo.sqlSave, hfiuo.mutation, hfiuo.hooks)
}

// SaveX is like Save, but panics if an error occurs.
func (hfiuo *HPFeedItemUpdateOne) SaveX(ctx context.Context) *HPFeedItem {
	node, err := hfiuo.Save(ctx)
	if err != nil {
		panic(err)
	}
	return node
}

// Exec executes the query on the entity.
func (hfiuo *HPFeedItemUpdateOne) Exec(ctx context.Context) error {
	_, err := hfiuo.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (hfiuo *HPFeedItemUpdateOne) ExecX(ctx context.Context) {
	if err := hfiuo.Exec(ctx); err != nil {
		panic(err)
	}
}

// check runs all checks and user-defined validators on the builder.
func (hfiuo *HPFeedItemUpdateOne) check() error {
	if v, ok := hfiuo.mutation.AssetType(); ok {
		if err := hpfeeditem.AssetTypeValidator(v); err != nil {
			return &ValidationError{Name: "asset_type", err: fmt.Errorf(`ent: validator failed for field "HPFeedItem.asset_type": %w`, err)}
		}
	}
	return nil
}

func (hfiuo *HPFeedItemUpdateOne) sqlSave(ctx context.Context) (_node *HPFeedItem, err error) {
	if err := hfiuo.check(); err != nil {
		return _node, err
	}
	_spec := sqlgraph.NewUpdateSpec(hpfeeditem.Table, hpfeeditem.Columns, sqlgraph.NewFieldSpec(hpfeeditem.FieldID, field.TypeInt))
	id, ok := hfiuo.mutation.ID()
	if !ok {
		return nil, &ValidationError{Name: "id", err: errors.New(`ent: missing "HPFeedItem.id" for update`)}
	}
	_spec.Node.ID.Value = id
	if fields := hfiuo.fields; len(fields) > 0 {
		_spec.Node.Columns = make([]string, 0, len(fields))
		_spec.Node.Columns = append(_spec.Node.Columns, hpfeeditem.FieldID)
		for _, f := range fields {
			if !hpfeeditem.ValidColumn(f) {
				return nil, &ValidationError{Name: f, err: fmt.Errorf("ent: invalid field %q for query", f)}
			}
			if f != hpfeeditem.FieldID {
				_spec.Node.Columns = append(_spec.Node.Columns, f)
			}
		}
	}
	if ps := hfiuo.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if hfiuo.mutation.CreatedAtCleared() {
		_spec.ClearField(hpfeeditem.FieldCreatedAt, field.TypeTime)
	}
	if value, ok := hfiuo.mutation.UpdatedAt(); ok {
		_spec.SetField(hpfeeditem.FieldUpdatedAt, field.TypeTime, value)
	}
	if hfiuo.mutation.UpdatedAtCleared() {
		_spec.ClearField(hpfeeditem.FieldUpdatedAt, field.TypeTime)
	}
	if value, ok := hfiuo.mutation.SourceID(); ok {
		_spec.SetField(hpfeeditem.FieldSourceID, field.TypeInt, value)
	}
	if value, ok := hfiuo.mutation.AddedSourceID(); ok {
		_spec.AddField(hpfeeditem.FieldSourceID, field.TypeInt, value)
	}
	if value, ok := hfiuo.mutation.AssetType(); ok {
		_spec.SetField(hpfeeditem.FieldAssetType, field.TypeEnum, value)
	}
	if value, ok := hfiuo.mutation.Title(); ok {
		_spec.SetField(hpfeeditem.FieldTitle, field.TypeString, value)
	}
	if value, ok := hfiuo.mutation.PostAt(); ok {
		_spec.SetField(hpfeeditem.FieldPostAt, field.TypeTime, value)
	}
	if value, ok := hfiuo.mutation.SourceURL(); ok {
		_spec.SetField(hpfeeditem.FieldSourceURL, field.TypeString, value)
	}
	if value, ok := hfiuo.mutation.ImageURL(); ok {
		_spec.SetField(hpfeeditem.FieldImageURL, field.TypeString, value)
	}
	if hfiuo.mutation.ImageURLCleared() {
		_spec.ClearField(hpfeeditem.FieldImageURL, field.TypeString)
	}
	if value, ok := hfiuo.mutation.Media(); ok {
		_spec.SetField(hpfeeditem.FieldMedia, field.TypeJSON, value)
	}
	if value, ok := hfiuo.mutation.AppendedMedia(); ok {
		_spec.AddModifier(func(u *sql.UpdateBuilder) {
			sqljson.Append(u, hpfeeditem.FieldMedia, value)
		})
	}
	if hfiuo.mutation.ViewHistoriesCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   hpfeeditem.ViewHistoriesTable,
			Columns: []string{hpfeeditem.ViewHistoriesColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpviewhistory.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := hfiuo.mutation.RemovedViewHistoriesIDs(); len(nodes) > 0 && !hfiuo.mutation.ViewHistoriesCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   hpfeeditem.ViewHistoriesTable,
			Columns: []string{hpfeeditem.ViewHistoriesColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpviewhistory.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := hfiuo.mutation.ViewHistoriesIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   hpfeeditem.ViewHistoriesTable,
			Columns: []string{hpfeeditem.ViewHistoriesColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpviewhistory.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if hfiuo.mutation.OwnerArtistCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   hpfeeditem.OwnerArtistTable,
			Columns: []string{hpfeeditem.OwnerArtistColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpartist.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := hfiuo.mutation.OwnerArtistIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   hpfeeditem.OwnerArtistTable,
			Columns: []string{hpfeeditem.OwnerArtistColumn},
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
	if hfiuo.mutation.OwnerMemberCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   hpfeeditem.OwnerMemberTable,
			Columns: []string{hpfeeditem.OwnerMemberColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpmember.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := hfiuo.mutation.OwnerMemberIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   hpfeeditem.OwnerMemberTable,
			Columns: []string{hpfeeditem.OwnerMemberColumn},
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
	if hfiuo.mutation.TaggedArtistsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   hpfeeditem.TaggedArtistsTable,
			Columns: hpfeeditem.TaggedArtistsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpartist.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := hfiuo.mutation.RemovedTaggedArtistsIDs(); len(nodes) > 0 && !hfiuo.mutation.TaggedArtistsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   hpfeeditem.TaggedArtistsTable,
			Columns: hpfeeditem.TaggedArtistsPrimaryKey,
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
	if nodes := hfiuo.mutation.TaggedArtistsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   hpfeeditem.TaggedArtistsTable,
			Columns: hpfeeditem.TaggedArtistsPrimaryKey,
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
	if hfiuo.mutation.TaggedMembersCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   hpfeeditem.TaggedMembersTable,
			Columns: hpfeeditem.TaggedMembersPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(hpmember.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := hfiuo.mutation.RemovedTaggedMembersIDs(); len(nodes) > 0 && !hfiuo.mutation.TaggedMembersCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   hpfeeditem.TaggedMembersTable,
			Columns: hpfeeditem.TaggedMembersPrimaryKey,
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
	if nodes := hfiuo.mutation.TaggedMembersIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   hpfeeditem.TaggedMembersTable,
			Columns: hpfeeditem.TaggedMembersPrimaryKey,
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
	_node = &HPFeedItem{config: hfiuo.config}
	_spec.Assign = _node.assignValues
	_spec.ScanValues = _node.scanValues
	if err = sqlgraph.UpdateNode(ctx, hfiuo.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{hpfeeditem.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return nil, err
	}
	hfiuo.mutation.done = true
	return _node, nil
}
