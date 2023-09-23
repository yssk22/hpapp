package schema

import "go/types"

type excludedDependency struct {
	namedRef *types.Named
}

// String returns the fully qualified name of dependency
func (d *excludedDependency) FullyQualifiedName() string {
	return d.namedRef.String()
}

// GraphQLName returns the type name used in the GraphQL schema
func (d *excludedDependency) GraphQLType() GraphQLType {
	return GraphQLType(d.namedRef.Obj().Name())
}

func (d *excludedDependency) IsComplexType() bool {
	return false
}

func (d *excludedDependency) ToSchema() (Schema, []Dependency, error) {
	return nil, nil, nil
}
