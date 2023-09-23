package schema

import (
	"fmt"

	"hpapp.yssk22.dev/go/foundation/slice"
)

type InputDependency struct {
	inner Dependency
}

// String returns the fully qualified name of dependency
func (d *InputDependency) FullyQualifiedName() string {
	return d.inner.FullyQualifiedName()
}

// GraphQLName returns the type name used in the GraphQL schema
func (d *InputDependency) GraphQLType() GraphQLType {
	if d.inner.IsComplexType() {
		return GraphQLType(fmt.Sprintf("%sInput", d.inner.GraphQLType()))
	}
	return GraphQLType(d.inner.GraphQLType())
}

func (d *InputDependency) IsComplexType() bool {
	return d.inner.IsComplexType()
}

func (d *InputDependency) ToSchema() (Schema, []Dependency, error) {
	s, deps, err := d.inner.ToSchema()
	if err != nil {
		return nil, nil, err
	}
	if len(deps) > 0 {
		deps, _ = slice.Map(deps, func(_ int, dep Dependency) (Dependency, error) {
			if _, ok := dep.(*InputDependency); ok {
				return dep, nil
			}
			if inf, ok := dep.(*interfaceDependency); ok {
				// interface can be excluded from input dependencies
				return &excludedDependency{
					namedRef: inf.namedRef,
				}, nil
			}
			return &InputDependency{inner: dep}, nil
		})
	}
	switch is := s.(type) {
	case *typeSchema:
		// GraphQLType(fmt.Sprintf("%sInput", is.name))
		is.isInput = true
		is.fields, _ = slice.Map(is.fields, func(_ int, v Variable) (Variable, error) {
			v.IsInput = true
			return v, nil
		})
		is.methods = nil // do not expose methods for Input types
		return is, deps, nil
	}
	return s, deps, nil
}
