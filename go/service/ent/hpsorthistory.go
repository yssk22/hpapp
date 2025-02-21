// Code generated by ent, DO NOT EDIT.

package ent

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/sql"
	"github.com/yssk22/hpapp/go/service/ent/hpsorthistory"
	"github.com/yssk22/hpapp/go/service/ent/user"
	"github.com/yssk22/hpapp/go/service/schema/jsonfields"
)

// HPSortHistory is the model entity for the HPSortHistory schema.
type HPSortHistory struct {
	config `json:"-"`
	// ID of the ent.
	ID int `json:"id,omitempty"`
	// CreatedAt holds the value of the "created_at" field.
	CreatedAt time.Time `json:"created_at,omitempty"`
	// UpdatedAt holds the value of the "updated_at" field.
	UpdatedAt time.Time `json:"updated_at,omitempty"`
	// SortResult holds the value of the "sort_result" field.
	SortResult jsonfields.HPSortResult `json:"sort_result,omitempty"`
	// OwnerUserID holds the value of the "owner_user_id" field.
	OwnerUserID *int `json:"owner_user_id,omitempty"`
	// Edges holds the relations/edges for other nodes in the graph.
	// The values are being populated by the HPSortHistoryQuery when eager-loading is set.
	Edges        HPSortHistoryEdges `json:"edges"`
	selectValues sql.SelectValues
}

// HPSortHistoryEdges holds the relations/edges for other nodes in the graph.
type HPSortHistoryEdges struct {
	// Owner holds the value of the owner edge.
	Owner *User `json:"owner,omitempty"`
	// loadedTypes holds the information for reporting if a
	// type was loaded (or requested) in eager-loading or not.
	loadedTypes [1]bool
	// totalCount holds the count of the edges above.
	totalCount [1]map[string]int
}

// OwnerOrErr returns the Owner value or an error if the edge
// was not loaded in eager-loading, or loaded but was not found.
func (e HPSortHistoryEdges) OwnerOrErr() (*User, error) {
	if e.loadedTypes[0] {
		if e.Owner == nil {
			// Edge was loaded but was not found.
			return nil, &NotFoundError{label: user.Label}
		}
		return e.Owner, nil
	}
	return nil, &NotLoadedError{edge: "owner"}
}

// scanValues returns the types for scanning values from sql.Rows.
func (*HPSortHistory) scanValues(columns []string) ([]any, error) {
	values := make([]any, len(columns))
	for i := range columns {
		switch columns[i] {
		case hpsorthistory.FieldSortResult:
			values[i] = new([]byte)
		case hpsorthistory.FieldID, hpsorthistory.FieldOwnerUserID:
			values[i] = new(sql.NullInt64)
		case hpsorthistory.FieldCreatedAt, hpsorthistory.FieldUpdatedAt:
			values[i] = new(sql.NullTime)
		default:
			values[i] = new(sql.UnknownType)
		}
	}
	return values, nil
}

// assignValues assigns the values that were returned from sql.Rows (after scanning)
// to the HPSortHistory fields.
func (hsh *HPSortHistory) assignValues(columns []string, values []any) error {
	if m, n := len(values), len(columns); m < n {
		return fmt.Errorf("mismatch number of scan values: %d != %d", m, n)
	}
	for i := range columns {
		switch columns[i] {
		case hpsorthistory.FieldID:
			value, ok := values[i].(*sql.NullInt64)
			if !ok {
				return fmt.Errorf("unexpected type %T for field id", value)
			}
			hsh.ID = int(value.Int64)
		case hpsorthistory.FieldCreatedAt:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field created_at", values[i])
			} else if value.Valid {
				hsh.CreatedAt = value.Time
			}
		case hpsorthistory.FieldUpdatedAt:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field updated_at", values[i])
			} else if value.Valid {
				hsh.UpdatedAt = value.Time
			}
		case hpsorthistory.FieldSortResult:
			if value, ok := values[i].(*[]byte); !ok {
				return fmt.Errorf("unexpected type %T for field sort_result", values[i])
			} else if value != nil && len(*value) > 0 {
				if err := json.Unmarshal(*value, &hsh.SortResult); err != nil {
					return fmt.Errorf("unmarshal field sort_result: %w", err)
				}
			}
		case hpsorthistory.FieldOwnerUserID:
			if value, ok := values[i].(*sql.NullInt64); !ok {
				return fmt.Errorf("unexpected type %T for field owner_user_id", values[i])
			} else if value.Valid {
				hsh.OwnerUserID = new(int)
				*hsh.OwnerUserID = int(value.Int64)
			}
		default:
			hsh.selectValues.Set(columns[i], values[i])
		}
	}
	return nil
}

// Value returns the ent.Value that was dynamically selected and assigned to the HPSortHistory.
// This includes values selected through modifiers, order, etc.
func (hsh *HPSortHistory) Value(name string) (ent.Value, error) {
	return hsh.selectValues.Get(name)
}

// QueryOwner queries the "owner" edge of the HPSortHistory entity.
func (hsh *HPSortHistory) QueryOwner() *UserQuery {
	return NewHPSortHistoryClient(hsh.config).QueryOwner(hsh)
}

// Update returns a builder for updating this HPSortHistory.
// Note that you need to call HPSortHistory.Unwrap() before calling this method if this HPSortHistory
// was returned from a transaction, and the transaction was committed or rolled back.
func (hsh *HPSortHistory) Update() *HPSortHistoryUpdateOne {
	return NewHPSortHistoryClient(hsh.config).UpdateOne(hsh)
}

// Unwrap unwraps the HPSortHistory entity that was returned from a transaction after it was closed,
// so that all future queries will be executed through the driver which created the transaction.
func (hsh *HPSortHistory) Unwrap() *HPSortHistory {
	_tx, ok := hsh.config.driver.(*txDriver)
	if !ok {
		panic("ent: HPSortHistory is not a transactional entity")
	}
	hsh.config.driver = _tx.drv
	return hsh
}

// String implements the fmt.Stringer.
func (hsh *HPSortHistory) String() string {
	var builder strings.Builder
	builder.WriteString("HPSortHistory(")
	builder.WriteString(fmt.Sprintf("id=%v, ", hsh.ID))
	builder.WriteString("created_at=")
	builder.WriteString(hsh.CreatedAt.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("updated_at=")
	builder.WriteString(hsh.UpdatedAt.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("sort_result=")
	builder.WriteString(fmt.Sprintf("%v", hsh.SortResult))
	builder.WriteString(", ")
	if v := hsh.OwnerUserID; v != nil {
		builder.WriteString("owner_user_id=")
		builder.WriteString(fmt.Sprintf("%v", *v))
	}
	builder.WriteByte(')')
	return builder.String()
}

// HPSortHistories is a parsable slice of HPSortHistory.
type HPSortHistories []*HPSortHistory
