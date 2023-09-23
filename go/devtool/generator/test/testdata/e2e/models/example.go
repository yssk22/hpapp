package models

import (
	"context"
	"fmt"
	"io"
)

type Node interface {
	ID() string
}

type MyNode struct {
	id string
}

func (n *MyNode) ID() string {
	return n.id
}

func (n *MyNode) implements(Node) {
}

// type Query { .... }
type Query struct {
	RootField string // should not be exposed to schema
}

func (q *Query) Node(ctx context.Context, id string) (Node, error) {
	return &MyNode{id: id}, nil
}

func (q *Query) QueryExample(ctx context.Context) (*TypeExample, error) {
	strValue := "strValue"
	intValue := 10
	floatValue := 3.14
	boolValue := true
	mapValue := map[string]interface{}{
		"key": "value",
	}
	userDefinedValue := YesNo(false)
	structValue := ComplexField{
		FieldString:         strValue,
		FieldNullableSrinrg: &strValue,
	}
	structWithMarshalerValue := ComplexFieldWithMarshaler{
		IntValue: 10,
	}
	arrayValue := []string{strValue}
	arrayNullableElementValue := []*string{&strValue}
	arrayOfArrayValue := [][][]string{
		[][]string{
			[]string{"1"},
		},
	}
	return &TypeExample{
		ID:                             "123",
		FieldString:                    strValue,
		FieldNullableSrinrg:            &strValue,
		FieldInt:                       intValue,
		FieldNullableInt:               &intValue,
		FieldFloat:                     floatValue,
		FieldNullableFloat:             &floatValue,
		FieldBoolean:                   boolValue,
		FieldNullableBoolean:           &boolValue,
		FieldMap:                       mapValue,
		FieldUserDefinedScalar:         userDefinedValue,
		FieldUserDefinedEnum:           MyEnumValueA,
		FieldNullableUserDefinedScalar: &userDefinedValue,
		FieldStruct:                    structValue,
		FiledStructWithMarshaler:       structWithMarshalerValue,
		FieldNullableComplex:           &structValue,
		FieldArray:                     arrayValue,
		FieldNullableElementArray:      arrayNullableElementValue,
		FieldArrayOfArray:              arrayOfArrayValue,
	}, nil
}

type Mutation struct {
	RootField string // should not be exposed to schema
}

func (q *Mutation) ExampleMutation(context.Context) (*MutationExample, error) {
	return &MutationExample{}, nil
}

// // type TypeExample { ... }
type TypeExample struct {
	ID                             string
	FieldString                    string
	FieldNullableSrinrg            *string
	FieldInt                       int
	FieldNullableInt               *int
	FieldFloat                     float64
	FieldNullableFloat             *float64
	FieldBoolean                   bool
	FieldNullableBoolean           *bool
	FieldMap                       map[string]interface{}
	FieldUserDefinedScalar         YesNo
	FieldNullableUserDefinedScalar *YesNo
	FieldUserDefinedEnum           MyEnum
	FieldStruct                    ComplexField
	FiledStructWithMarshaler       ComplexFieldWithMarshaler
	FieldNullableComplex           *ComplexField
	FieldInterface                 ComplexInterface
	FieldArray                     []string
	FieldNullableElementArray      []*string
	FieldArrayOfArray              [][][]string

	EmbeddedField

	privateField string // should not be exposed to the schema
}

func (s *TypeExample) MethodWithContext(ctx context.Context, complexQueryParams *ComplexParams) (*ComplexResult, error) {
	return nil, nil
}

func (s *TypeExample) MethodWithoutContext(complexQueryParams *ComplexParams) (*ComplexResult, error) {
	return nil, nil
}

func (s *TypeExample) MethodWithoutError(complexQueryParams *ComplexParams) *ComplexResult {
	return nil
}

// support type alias
type MyContext = context.Context
type MyParam = *ComplexParams // This won't generate input MyParam but use ComplexParams as a parameter type

func (s *TypeExample) MethodWithAlias(ctx MyContext, complexQueryParams MyParam) (*ComplexResult, error) {
	return nil, nil
}

// can use the same type for both input and return
// this generates `input ComplexResultInput { ... }` and `type ComplexResult {...}`
func (s *TypeExample) MethodWithResult(ctx MyContext, complexQueryParams *ComplexResult) (*ComplexResult, error) {
	return nil, nil
}

func (s *TypeExample) privateMethod(ctx context.Context, complexQueryParams *ComplexParams) (*ComplexResult, error) { //nolint
	return nil, nil
}

// type ComplexQueryField { ... }
type ComplexField struct {
	FieldString         string
	FieldNullableSrinrg *string
}

type ComplexFieldWithMarshaler struct {
	IntValue int
}

func (c ComplexFieldWithMarshaler) MarshalGQL(w io.Writer) {
	_, _ = w.Write([]byte(fmt.Sprintf("%d", c.IntValue)))
}

func (c *ComplexFieldWithMarshaler) UnmarshalGQL(v interface{}) error {
	vv, ok := v.(int)
	if !ok {
		return fmt.Errorf("ComplexFieldWithMarsharler must be an int")
	}
	c.IntValue = vv
	return nil
}

// interface ComplexInterface { ... }
type ComplexInterface interface {
	FieldLikeMethod() ([]string, error)
	MethodToCall(ctx context.Context, aa string) (ComplexField, error)
}

type EmbeddedField struct {
	EmbeddedFieldString         string
	EmbeddedFieldNullableSrinrg *string
}

// input ComplexQueryParmas { ... }
type ComplexParams struct {
	FieldString                string
	FieldNullableSrinrg        *string
	FieldUserDefinedScalar     YesNo
	FieldNullUserDefinedScalar *YesNo
	FieldEnum                  MyEnum
	FieldNullableEnum          *MyEnum
	FieldStruct                NestedComplexParams
}

type NestedComplexParams struct {
	Field                      string
	FieldStruct                DeepNestedComplexParams
	FieldUserDefinedScalar     YesNo
	FieldNullUserDefinedScalar *YesNo
	FieldEnum                  MyEnum
	FieldNullableEnum          *MyEnum
}

type DeepNestedComplexParams struct {
	Field string
}

// type ComplexQueryResult { ... }
type ComplexResult struct {
	FieldString         string
	FieldNullableSrinrg *string
}

// user defined scalar
type YesNo bool

// UnmarshalGQL implements the graphql.Unmarshaler interface
func (y *YesNo) UnmarshalGQL(v interface{}) error {
	yes, ok := v.(string)
	if !ok {
		return fmt.Errorf("points must be strings")
	}
	if yes == "yes" {
		*y = true
	} else {
		*y = false
	}
	return nil
}

// MarshalGQL implements the graphql.Marshaler interface
func (y YesNo) MarshalGQL(w io.Writer) {
	if y {
		w.Write([]byte(`"yes"`))
	} else {
		w.Write([]byte(`"no"`))
	}
}

// /*
//  enum MyEnum {
// 	 ValueA
// 	 ValueB
//  }
// */
type MyEnum string

const (
	MyEnumValueA MyEnum = "value_a"
	MyEnumValueB MyEnum = "value_b"
)

// type MutationExample { ... }
type MutationExample struct {
}

func (s *MutationExample) MethodWithContext(ctx context.Context, complexQueryParams *ComplexParams) (*ComplexResult, error) {
	return nil, nil
}

func (s *MutationExample) MethodWithoutContext(complexQueryParams *ComplexParams) (*ComplexResult, error) {
	return nil, nil
}

// func (s *MutationExample) MethodWithCustomScalarAndEnum(y YesNo, v MyEnum) (*ComplexResult, error) {
// 	return nil, nil
// }

func (s *MutationExample) MethodWithContextAlias(ctx MyContext, complexQueryParams *ComplexParams) (*ComplexResult, error) {
	return nil, nil
}

func (s *MutationExample) privateMethod(ctx context.Context, complexQueryParams *ComplexParams) (*ComplexResult, error) {
	return nil, nil
}
