package schema

import (
	"fmt"
	"go/types"
	"strings"
)

type interfaceDependency struct {
	namedRef     *types.Named
	interfaceRef *types.Interface

	generator *dependencyGenerator
}

// String returns the fully qualified name of dependency
func (d *interfaceDependency) FullyQualifiedName() string {
	return d.namedRef.String()
}

func (d *interfaceDependency) GraphQLType() GraphQLType {
	return GraphQLType(d.namedRef.Obj().Name())
}

func (d *interfaceDependency) IsComplexType() bool {
	return true
}

func (d *interfaceDependency) String() string {
	return d.FullyQualifiedName()
}

func (d *interfaceDependency) ToSchema() (Schema, []Dependency, error) {
	// methods
	methods, deps, err := d.getMethods()
	if err != nil {
		return nil, nil, err
	}

	return &interfaceSchema{
		name:       d.namedRef.Obj().Name(),
		methods:    methods,
		dependency: d,
	}, deps, nil
}

func (d *interfaceDependency) getMethods() ([]Method, []Dependency, error) {
	var dependencies []Dependency
	var methods []Method
	for i := 0; i < d.interfaceRef.NumMethods(); i++ {
		method := d.interfaceRef.Method(i)
		if !method.Exported() {
			continue
		}
		obj, deps, err := d.generator.getMethod(method)
		if err != nil {
			return nil, nil, fmt.Errorf("method error in %s: %w", method, err)
		}
		if obj != nil {
			methods = append(methods, *obj)
		}
		if len(deps) > 0 {
			dependencies = append(dependencies, deps...)
		}
	}
	return methods, dependencies, nil
}

type interfaceSchema struct {
	name       string
	fields     []Variable
	methods    []Method
	dependency *interfaceDependency
}

func (t *interfaceSchema) Source() string {
	var lines []string
	lines = append(lines, fmt.Sprintf("interface %s %s {", t.name, goModelDirective(t.dependency.FullyQualifiedName())))
	for _, f := range t.fields {
		lines = append(lines, fmt.Sprintf("  %s", f.String()))
	}
	if len(t.fields) > 0 && len(t.methods) > 0 {
		lines = append(lines, "")
	}
	for _, m := range t.methods {
		lines = append(lines, fmt.Sprintf("  %s", m.String()))
	}
	lines = append(lines, "}")
	return strings.Join(lines, "\n")

}
