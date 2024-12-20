// Code generated by ent, DO NOT EDIT.

package testent

import (
	"fmt"
	"time"

	"entgo.io/ent/dialect/sql"
	"github.com/99designs/gqlgen/graphql"
	"github.com/yssk22/hpapp/go/service/schema/enums"
	"github.com/yssk22/hpapp/go/service/schema/jsonfields"
)

const (
	// Label holds the string label denoting the testent type in the database.
	Label = "test_ent"
	// FieldID holds the string denoting the id field in the database.
	FieldID = "id"
	// FieldStringField holds the string denoting the string_field field in the database.
	FieldStringField = "string_field"
	// FieldTextField holds the string denoting the text_field field in the database.
	FieldTextField = "text_field"
	// FieldBytesField holds the string denoting the bytes_field field in the database.
	FieldBytesField = "bytes_field"
	// FieldBoolField holds the string denoting the bool_field field in the database.
	FieldBoolField = "bool_field"
	// FieldTimeField holds the string denoting the time_field field in the database.
	FieldTimeField = "time_field"
	// FieldIntField holds the string denoting the int_field field in the database.
	FieldIntField = "int_field"
	// FieldInt64Field holds the string denoting the int64_field field in the database.
	FieldInt64Field = "int64_field"
	// FieldFloatField holds the string denoting the float_field field in the database.
	FieldFloatField = "float_field"
	// FieldJSONField holds the string denoting the json_field field in the database.
	FieldJSONField = "json_field"
	// FieldEnumField holds the string denoting the enum_field field in the database.
	FieldEnumField = "enum_field"
	// Table holds the table name of the testent in the database.
	Table = "test_ents"
)

// Columns holds all SQL columns for testent fields.
var Columns = []string{
	FieldID,
	FieldStringField,
	FieldTextField,
	FieldBytesField,
	FieldBoolField,
	FieldTimeField,
	FieldIntField,
	FieldInt64Field,
	FieldFloatField,
	FieldJSONField,
	FieldEnumField,
}

// ValidColumn reports if the column name is valid (part of the table columns).
func ValidColumn(column string) bool {
	for i := range Columns {
		if column == Columns[i] {
			return true
		}
	}
	return false
}

var (
	// DefaultStringField holds the default value on creation for the "string_field" field.
	DefaultStringField string
	// DefaultTextField holds the default value on creation for the "text_field" field.
	DefaultTextField string
	// DefaultBytesField holds the default value on creation for the "bytes_field" field.
	DefaultBytesField []byte
	// DefaultBoolField holds the default value on creation for the "bool_field" field.
	DefaultBoolField bool
	// DefaultTimeField holds the default value on creation for the "time_field" field.
	DefaultTimeField time.Time
	// DefaultIntField holds the default value on creation for the "int_field" field.
	DefaultIntField int
	// DefaultInt64Field holds the default value on creation for the "int64_field" field.
	DefaultInt64Field int64
	// DefaultFloatField holds the default value on creation for the "float_field" field.
	DefaultFloatField float64
	// DefaultJSONField holds the default value on creation for the "json_field" field.
	DefaultJSONField *jsonfields.TestJSON
)

const DefaultEnumField enums.TestEnum = "b"

// EnumFieldValidator is a validator for the "enum_field" field enum values. It is called by the builders before save.
func EnumFieldValidator(ef enums.TestEnum) error {
	switch ef {
	case "a", "b", "c":
		return nil
	default:
		return fmt.Errorf("testent: invalid enum value for enum_field field: %q", ef)
	}
}

// Order defines the ordering method for the TestEnt queries.
type Order func(*sql.Selector)

// ByID orders the results by the id field.
func ByID(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldID, opts...).ToFunc()
}

// ByStringField orders the results by the string_field field.
func ByStringField(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldStringField, opts...).ToFunc()
}

// ByTextField orders the results by the text_field field.
func ByTextField(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldTextField, opts...).ToFunc()
}

// ByBoolField orders the results by the bool_field field.
func ByBoolField(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldBoolField, opts...).ToFunc()
}

// ByTimeField orders the results by the time_field field.
func ByTimeField(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldTimeField, opts...).ToFunc()
}

// ByIntField orders the results by the int_field field.
func ByIntField(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldIntField, opts...).ToFunc()
}

// ByInt64Field orders the results by the int64_field field.
func ByInt64Field(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldInt64Field, opts...).ToFunc()
}

// ByFloatField orders the results by the float_field field.
func ByFloatField(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldFloatField, opts...).ToFunc()
}

// ByEnumField orders the results by the enum_field field.
func ByEnumField(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldEnumField, opts...).ToFunc()
}

var (
	// enums.TestEnum must implement graphql.Marshaler.
	_ graphql.Marshaler = (*enums.TestEnum)(nil)
	// enums.TestEnum must implement graphql.Unmarshaler.
	_ graphql.Unmarshaler = (*enums.TestEnum)(nil)
)
