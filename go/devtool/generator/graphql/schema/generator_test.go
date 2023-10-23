package schema

import (
	"bytes"
	"testing"

	"github.com/google/go-cmp/cmp"
	"github.com/yssk22/hpapp/go/foundation/assert"
)

func TestValid(t *testing.T) {
	a := assert.NewTestAssert(t)
	var got bytes.Buffer
	generator := NewGenerator(
		WithRoot(
			"github.com/yssk22/hpapp/go/devtool/generator/graphql/schema/testdata.Query",
			"github.com/yssk22/hpapp/go/devtool/generator/graphql/schema/testdata.Mutation",
		),
		withOutput(&got),
	)
	err := generator.Generate()
	a.Nil(err)
	expect :=
		`type Query @goModel(model: "github.com/yssk22/hpapp/go/devtool/generator/graphql/schema/testdata.Query") {
  root: Root!
}

type Root @goModel(model: "github.com/yssk22/hpapp/go/devtool/generator/graphql/schema/testdata.Root") {
  id: ID!
  fieldString: String!
  fieldNullableString: String
  fieldInt: Int!
  fieldNullableInt: Int
  fieldFloat: Float!
  fieldNullableFloat: Float
  fieldBoolean: Boolean!
  fieldNullableBoolean: Boolean
  fieldArray: [String!]
  fieldNullableElementArray: [String]
  fieldArrayOfArray: [[[String!]]]
  fieldBasicScalar: YesNo!
  fieldComplexScalar: MyScalar
  fieldEnum: MyEnum!
  fieldComplex: MyComplexType!
  fieldInterface: MyInterface
  fieldTime: Time!
  fieldNullableTime: Time

  methodWithoutArg: String!
  methodWithContext: String!
  methodWithArg(i: Int!): String!
  methodWithContextArg(i: Int!): String!
  methodWithErrorReturn(i: Int!): String!
}

scalar YesNo @goModel(model: "github.com/yssk22/hpapp/go/devtool/generator/graphql/schema/testdata.YesNo")

scalar MyScalar @goModel(model: "github.com/yssk22/hpapp/go/devtool/generator/graphql/schema/testdata.MyScalar")

enum MyEnum @goModel(model: "github.com/yssk22/hpapp/go/devtool/generator/graphql/schema/testdata.MyEnum") {
  bar
  foo
}

type MyComplexType implements MyInterface @goModel(model: "github.com/yssk22/hpapp/go/devtool/generator/graphql/schema/testdata.MyComplexType") {
  id: ID!
  nested: NestedMyComplexType!

  methodWithDefinedTypes(y: YesNo!, s: MyScalar!, e: MyEnum!, m: MyComplexTypeInput!): String!
  interfaceMethod(i: Int!): String!
}

interface MyInterface @goModel(model: "github.com/yssk22/hpapp/go/devtool/generator/graphql/schema/testdata.MyInterface") {
  id: ID!
  interfaceMethod(i: Int!): String!
}

type NestedMyComplexType @goModel(model: "github.com/yssk22/hpapp/go/devtool/generator/graphql/schema/testdata.NestedMyComplexType") {
  id: ID!
}

input MyComplexTypeInput @goModel(model: "github.com/yssk22/hpapp/go/devtool/generator/graphql/schema/testdata.MyComplexType") {
  id: ID!
  nested: NestedMyComplexTypeInput!
}

input NestedMyComplexTypeInput @goModel(model: "github.com/yssk22/hpapp/go/devtool/generator/graphql/schema/testdata.NestedMyComplexType") {
  id: ID!
}

type Mutation @goModel(model: "github.com/yssk22/hpapp/go/devtool/generator/graphql/schema/testdata.Mutation") {
  foo: String!
}

`
	a.Equals(expect, got.String(), cmp.Diff(expect, got.String()))
}
