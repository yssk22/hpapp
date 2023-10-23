package schema

import (
	"fmt"
	"go/types"
	"strings"

	"github.com/yssk22/hpapp/go/devtool/generator/helper"
	"github.com/yssk22/hpapp/go/foundation/slice"
)

type structDependency struct {
	namedRef  *types.Named
	structRef *types.Struct

	generator *dependencyGenerator
}

// String returns the fully qualified name of dependency
func (d *structDependency) FullyQualifiedName() string {
	return d.namedRef.String()
}

func (d *structDependency) GraphQLType() GraphQLType {
	return GraphQLType(d.namedRef.Obj().Name())
}

func (d *structDependency) String() string {
	return d.FullyQualifiedName()
}

func (d *structDependency) IsComplexType() bool {
	ok, _ := d.generator.IsMarshler(d.namedRef)
	return !ok
}

func (d *structDependency) ToSchema() (Schema, []Dependency, error) {
	ok, err := d.generator.IsMarshler(d.namedRef)
	if err != nil {
		return nil, nil, err
	}
	if ok {
		return &scalarSchema{
			name:       d.GraphQLType(),
			dependency: d,
		}, nil, nil
	}

	// variables
	var fields []Variable
	var deps []Dependency
	// Root Query and Mutation shouldn't expose fields to it's schema to make them compatible
	if d.GraphQLType() != "Query" && d.GraphQLType() != "Mutation" {
		fields, deps, err = d.getFields()
		if err != nil {
			return nil, nil, err
		}
	}
	// methods
	methods, methodDeps, err := d.getMethods()
	if err != nil {
		return nil, nil, err
	}
	if len(methodDeps) > 0 {
		deps = append(deps, methodDeps...)
	}

	// interfaces
	interfaces, interfaceDeps, err := d.getInterface()
	if err != nil {
		return nil, nil, err
	}
	if len(interfaceDeps) > 0 {
		deps = append(deps, interfaceDeps...)
	}

	return &typeSchema{
		name:       d.GraphQLType(),
		fields:     fields,
		methods:    methods,
		interfaces: interfaces,
		dependency: d,
	}, deps, nil
}

func (d *structDependency) getFields() ([]Variable, []Dependency, error) {
	var dependencies []Dependency
	var fields []Variable
	for i := 0; i < d.structRef.NumFields(); i++ {
		field := d.structRef.Field(i)
		if !field.Exported() {
			continue
		}
		obj, dep, err := d.generator.getVariable(field)
		if err != nil {
			return nil, nil, fmt.Errorf("%s: %w", field.Name(), err)
		}
		tagValues, err := helper.ParseFieldTag("graphql", d.structRef.Tag(i))
		if err != nil {
			return nil, nil, fmt.Errorf("field tag error in %s: %w", field, err)
		}
		if obj != nil {
			obj.Tags = tagValues
			fields = append(fields, *obj)
			if dep != nil {
				dependencies = append(dependencies, dep)
			}
		}
	}
	return fields, dependencies, nil
}

func (d *structDependency) getMethods() ([]Method, []Dependency, error) {
	var dependencies []Dependency
	var methods []Method
	for i := 0; i < d.namedRef.NumMethods(); i++ {
		method := d.namedRef.Method(i)
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

func (d *structDependency) getInterface() ([]GraphQLType, []Dependency, error) {
	var dependencies []Dependency
	var interfaces []GraphQLType
	var hasID bool
	for i := 0; i < d.namedRef.NumMethods(); i++ {
		method := d.namedRef.Method(i)
		if method.Exported() {
			if method.Name() == "ID" {
				// TODO: signature check
				hasID = true
			}
			continue
		}
		if method.Name() == "implements" {
			params := method.Type().(*types.Signature).Params()
			for j := 0; j < params.Len(); j++ {
				obj, dep, err := d.generator.getVariable(params.At(j))
				if err != nil {
					return nil, nil, fmt.Errorf("invalid interface implementation in %s: %w", method, err)
				}
				if dep != nil {
					dependencies = append(dependencies, dep)
				}
				interfaces = append(interfaces, obj.Type)
			}
		}
	}
	if hasID {
		interfaces = append(interfaces, GraphQLType("Node"))
	}
	return interfaces, dependencies, nil
}

type typeSchema struct {
	name       GraphQLType
	fields     []Variable
	methods    []Method
	interfaces []GraphQLType
	dependency *structDependency
	isInput    bool
}

func (t *typeSchema) Source() string {
	var lines []string
	lines = append(lines, t.typeDeclaration())
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

func (t *typeSchema) typeDeclaration() string {
	var token []string
	if t.isInput {
		token = append(token, fmt.Sprintf("input %sInput", t.name))
	} else {
		token = append(token, fmt.Sprintf("type %s", t.name))
	}
	if !strings.HasSuffix(string(t.name), "Input") {
		if len(t.interfaces) > 0 && !t.isInput {
			strs, _ := slice.Map(t.interfaces, func(_ int, typ GraphQLType) (string, error) {
				return string(typ), nil
			})
			token = append(token, fmt.Sprintf("implements %s", strings.Join(strs, " & ")))
		}
	}
	token = append(token, goModelDirective(t.dependency.FullyQualifiedName()))
	token = append(token, "{")
	return strings.Join(token, " ")
}
