package testdata

import (
	"context"
	"io"
	"time"
)

type Query struct {
}

func (q *Query) Root() Root {
	return Root{}
}

type Root struct {
	ID                        string
	FieldString               string
	FieldNullableString       *string
	FieldInt                  int
	FieldNullableInt          *int
	FieldFloat                float64
	FieldNullableFloat        *float64
	FieldBoolean              bool
	FieldNullableBoolean      *bool
	FieldArray                []string
	FieldNullableElementArray []*string
	FieldArrayOfArray         [][][]string
	FieldBasicScalar          YesNo
	FieldComplexScalar        *MyScalar
	FieldEnum                 MyEnum
	FieldComplex              MyComplexType
	FieldInterface            MyInterface

	FieldTime         time.Time
	FieldNullableTime *time.Time
}

func (r *Root) MethodWithoutArg() string {
	return ""
}

func (r *Root) MethodWithContext(context.Context) string {
	return ""
}

func (r *Root) MethodWithArg(i int) string {
	return ""
}

func (r *Root) MethodWithContextArg(ctx context.Context, i int) string {
	return ""
}

func (r *Root) MethodWithErrorReturn(ctx context.Context, i int) (string, error) {
	return "", nil
}

// user defined scalar
type YesNo bool

// UnmarshalGQL implements the graphql.Unmarshaler interface
func (y *YesNo) UnmarshalGQL(v interface{}) error {
	return nil
}

// MarshalGQL implements the graphql.Marshaler interface
func (y YesNo) MarshalGQL(w io.Writer) {
}

type MyScalar struct {
	Value string
}

// UnmarshalGQL implements the graphql.Unmarshaler interface
func (y *MyScalar) UnmarshalGQL(v interface{}) error {
	return nil
}

// MarshalGQL implements the graphql.Marshaler interface
func (y MyScalar) MarshalGQL(w io.Writer) {
}

type MyEnum string

const (
	MyEnumBar = MyEnum("BAR")
	MyEnumFoo = MyEnum("FOO")
)

type MyComplexType struct {
	ID     string
	Nested NestedMyComplexType
}

type NestedMyComplexType struct {
	ID string
}

func (t *MyComplexType) MethodWithDefinedTypes(y YesNo, s MyScalar, e MyEnum, m MyComplexType) string {
	return ""
}

func (t *MyComplexType) InterfaceMethod(i int) string {
	return ""
}

func (t *MyComplexType) implements(MyInterface) {
}

type MyInterface interface {
	ID() string
	InterfaceMethod(i int) string
}
