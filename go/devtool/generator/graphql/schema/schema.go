/*
Package schema provides a feature to generate GraphQL schema and resolver.go for gqlgen.

if there is a Query struct defined at the top level in a package like the following, then the struct definition is analyzed and all exported dependencies are output as a GraphQL schema.

	type Query struct {
		MethodA(context.Context) Node1, error
		MethodB(context.Context, param Param) Node2, error
	}

	type Query goModel(model: "path/to/package.Query") {
		methodA: Node1!
		methodB(param: Param!): Node2!
	}

	type Node1 goModel(model: "path/to/package.Node1") {
		...
	}

	input ParamInput goModel(model: "path/to/package.Node1") {
		...
	}

	type Node2 goModel(model: "path/to/package.Node1") {
		...
	}

And there are some rules to analyze dependencies.

  - use GraphQL ID type if there is a string field with the name ID.
  - use GraphQL ID type if there is a function named ID() that returns string.
  - skip context.Context at the first argument in a function.
  - use "F: T!" if there is a `function F() (T, error)`.
  - if a struct T has `MarshalGQL(io.Writer)` と `UnmarshalGQL(interface{})`, then use `scalar T` in GraphQL.
  - if a struct T has a private `implements(InterfaceA)` function, then use `type T implements InterfaceA` and `interface InterfaceA` in GraphQL.

# How to write resolver.go

The generated GraphQL schema is mapped to the Go struct definition by the @goModel directive, so the resolver.go is very simple.

	type Resolver struct{}

	var query = &models.Query{}

	func (r *Resolver) Query() QueryResolver { return query }

	var mutation = &models.Mutation{}

	func (r *Resolver) Mutation() MutationResolver { return mutation }

Note that the resolver.go must be in a different directory from the package that contains the struct definition to avoid cyclic imports.
*/
package schema

import "fmt"

// Schema represents GraphQL Schema definition.
type Schema interface {
	Source() string
}

func goModelDirective(str string) string {
	return fmt.Sprintf("@goModel(model: %q)", str)
}
