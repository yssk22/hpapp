// Code generated by ent, DO NOT EDIT.

package ent

import (
	"fmt"
	"strings"
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/sql"
	"github.com/yssk22/hpapp/go/service/ent/metricdryrun"
)

// MetricDryRun is the model entity for the MetricDryRun schema.
type MetricDryRun struct {
	config `json:"-"`
	// ID of the ent.
	ID int `json:"id,omitempty"`
	// CreatedAt holds the value of the "created_at" field.
	CreatedAt time.Time `json:"created_at,omitempty"`
	// UpdatedAt holds the value of the "updated_at" field.
	UpdatedAt time.Time `json:"updated_at,omitempty"`
	// metric name
	MetricName string `json:"metric_name,omitempty"`
	// date string
	Date string `json:"date,omitempty"`
	// MetricDryRun value
	Value float64 `json:"value,omitempty"`
	// owner user id
	OwnerUserID  int `json:"owner_user_id,omitempty"`
	selectValues sql.SelectValues
}

// scanValues returns the types for scanning values from sql.Rows.
func (*MetricDryRun) scanValues(columns []string) ([]any, error) {
	values := make([]any, len(columns))
	for i := range columns {
		switch columns[i] {
		case metricdryrun.FieldValue:
			values[i] = new(sql.NullFloat64)
		case metricdryrun.FieldID, metricdryrun.FieldOwnerUserID:
			values[i] = new(sql.NullInt64)
		case metricdryrun.FieldMetricName, metricdryrun.FieldDate:
			values[i] = new(sql.NullString)
		case metricdryrun.FieldCreatedAt, metricdryrun.FieldUpdatedAt:
			values[i] = new(sql.NullTime)
		default:
			values[i] = new(sql.UnknownType)
		}
	}
	return values, nil
}

// assignValues assigns the values that were returned from sql.Rows (after scanning)
// to the MetricDryRun fields.
func (mdr *MetricDryRun) assignValues(columns []string, values []any) error {
	if m, n := len(values), len(columns); m < n {
		return fmt.Errorf("mismatch number of scan values: %d != %d", m, n)
	}
	for i := range columns {
		switch columns[i] {
		case metricdryrun.FieldID:
			value, ok := values[i].(*sql.NullInt64)
			if !ok {
				return fmt.Errorf("unexpected type %T for field id", value)
			}
			mdr.ID = int(value.Int64)
		case metricdryrun.FieldCreatedAt:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field created_at", values[i])
			} else if value.Valid {
				mdr.CreatedAt = value.Time
			}
		case metricdryrun.FieldUpdatedAt:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field updated_at", values[i])
			} else if value.Valid {
				mdr.UpdatedAt = value.Time
			}
		case metricdryrun.FieldMetricName:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field metric_name", values[i])
			} else if value.Valid {
				mdr.MetricName = value.String
			}
		case metricdryrun.FieldDate:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field date", values[i])
			} else if value.Valid {
				mdr.Date = value.String
			}
		case metricdryrun.FieldValue:
			if value, ok := values[i].(*sql.NullFloat64); !ok {
				return fmt.Errorf("unexpected type %T for field value", values[i])
			} else if value.Valid {
				mdr.Value = value.Float64
			}
		case metricdryrun.FieldOwnerUserID:
			if value, ok := values[i].(*sql.NullInt64); !ok {
				return fmt.Errorf("unexpected type %T for field owner_user_id", values[i])
			} else if value.Valid {
				mdr.OwnerUserID = int(value.Int64)
			}
		default:
			mdr.selectValues.Set(columns[i], values[i])
		}
	}
	return nil
}

// GetValue returns the ent.Value that was dynamically selected and assigned to the MetricDryRun.
// This includes values selected through modifiers, order, etc.
func (mdr *MetricDryRun) GetValue(name string) (ent.Value, error) {
	return mdr.selectValues.Get(name)
}

// Update returns a builder for updating this MetricDryRun.
// Note that you need to call MetricDryRun.Unwrap() before calling this method if this MetricDryRun
// was returned from a transaction, and the transaction was committed or rolled back.
func (mdr *MetricDryRun) Update() *MetricDryRunUpdateOne {
	return NewMetricDryRunClient(mdr.config).UpdateOne(mdr)
}

// Unwrap unwraps the MetricDryRun entity that was returned from a transaction after it was closed,
// so that all future queries will be executed through the driver which created the transaction.
func (mdr *MetricDryRun) Unwrap() *MetricDryRun {
	_tx, ok := mdr.config.driver.(*txDriver)
	if !ok {
		panic("ent: MetricDryRun is not a transactional entity")
	}
	mdr.config.driver = _tx.drv
	return mdr
}

// String implements the fmt.Stringer.
func (mdr *MetricDryRun) String() string {
	var builder strings.Builder
	builder.WriteString("MetricDryRun(")
	builder.WriteString(fmt.Sprintf("id=%v, ", mdr.ID))
	builder.WriteString("created_at=")
	builder.WriteString(mdr.CreatedAt.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("updated_at=")
	builder.WriteString(mdr.UpdatedAt.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("metric_name=")
	builder.WriteString(mdr.MetricName)
	builder.WriteString(", ")
	builder.WriteString("date=")
	builder.WriteString(mdr.Date)
	builder.WriteString(", ")
	builder.WriteString("value=")
	builder.WriteString(fmt.Sprintf("%v", mdr.Value))
	builder.WriteString(", ")
	builder.WriteString("owner_user_id=")
	builder.WriteString(fmt.Sprintf("%v", mdr.OwnerUserID))
	builder.WriteByte(')')
	return builder.String()
}

// MetricDryRuns is a parsable slice of MetricDryRun.
type MetricDryRuns []*MetricDryRun
