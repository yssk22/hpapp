package schema

import (
	"fmt"
	"go/types"
	"sort"
	"strings"

	"github.com/yssk22/hpapp/go/devtool/generator/enum"
	"github.com/yssk22/hpapp/go/foundation/stringutil"
)

var (
	ErrMarshalerIsNotImplemented = fmt.Errorf("named basic type must implement Marshaler/Unmarshaler")
)

type basicDependency struct {
	namedRef *types.Named
	basicRef *types.Basic

	generator *dependencyGenerator
}

// String returns the fully qualified name of dependency
func (d *basicDependency) FullyQualifiedName() string {
	return d.namedRef.String()
}

// GraphQLName returns the type name used in the GraphQL schema
func (d *basicDependency) GraphQLType() GraphQLType {
	return GraphQLType(d.namedRef.Obj().Name())
}

func (d *basicDependency) IsComplexType() bool {
	return false
}

func (d *basicDependency) ToSchema() (Schema, []Dependency, error) {
	enumType := enum.GetEnum(d.namedRef)
	if len(enumType.Keys) > 0 {
		var keys []string
		for _, k := range enumType.Keys {
			keys = append(keys, k.Name)
		}
		return &enumSchema{
			name:       d.GraphQLType(),
			values:     keys,
			dependency: d,
		}, nil, nil
	}
	ok, err := d.generator.IsMarshler(d.namedRef)
	if err != nil {
		return nil, nil, err
	}
	if !ok {
		return nil, nil, ErrMarshalerIsNotImplemented
	}
	return &scalarSchema{
		name:       d.GraphQLType(),
		dependency: d,
	}, nil, nil
}

type enumSchema struct {
	name       GraphQLType
	values     []string
	dependency *basicDependency
}

func (e *enumSchema) Source() string {
	lines := []string{fmt.Sprintf("enum %s %s {", e.name, goModelDirective(e.dependency.FullyQualifiedName()))}
	sort.Strings(e.values)
	for _, v := range e.values {
		lines = append(lines, fmt.Sprintf("  %s", stringutil.ToSnakeCase(v)))
	}
	lines = append(lines, "}")
	return strings.Join(lines, "\n")
}

type scalarSchema struct {
	name       GraphQLType
	dependency Dependency
}

func (e *scalarSchema) Source() string {
	return fmt.Sprintf("scalar %s %s", e.name, goModelDirective(e.dependency.FullyQualifiedName()))
}
