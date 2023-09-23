package schema

import (
	"fmt"
	"go/types"
	"strings"

	"hpapp.yssk22.dev/go/foundation/stringutil"
)

// Variable is a variable in GraphQL Type or Input
type Variable struct {
	Name          string
	Type          GraphQLType
	Nullable      bool
	IsArray       bool
	NestDepth     int
	IsComplexType bool
	IsInput       bool
	Tags          []string

	// source Model // source model
}

func (v *Variable) String() string {
	var tokens []string
	var varName = v.Name
	if varName != "" {
		tokens = append(tokens, v.Name)
		tokens = append(tokens, ": ")
	}
	if v.IsArray {
		tokens = append(tokens, strings.Repeat("[", v.NestDepth))
		tokens = append(tokens, v.getVariableType())
		if !v.Nullable {
			tokens = append(tokens, "!")
		}
		tokens = append(tokens, strings.Repeat("]", v.NestDepth))
	} else {
		tokens = append(tokens, string(v.Type))
		if !v.Nullable {
			tokens = append(tokens, "!")
		}
	}
	return strings.Join(tokens, "")
}

func (v *Variable) getVariableType() string {
	if v.IsInput && v.IsComplexType {
		return fmt.Sprintf("%sInput", v.Type)
	}
	return string(v.Type)
}

func (b *dependencyGenerator) getVariable(tvar *types.Var) (*Variable, Dependency, error) {
	fieldType, nullable, isArray, nestDepth := normalizeVariableType(tvar.Type())
	v := &Variable{
		Name:      stringutil.ToLowerCamelCase(tvar.Name()),
		Type:      GraphQLType(fieldType.String()),
		Nullable:  nullable,
		IsArray:   isArray,
		NestDepth: nestDepth,
	}
	switch ref := fieldType.(type) {
	case *types.Basic:
		typeName, err := b.getBasicTypeName(ref)
		v.Type = GraphQLType(typeName)
		if tvar.Name() == "ID" && typeName == BasicTypeString {
			v.Type = BasicTypeID
		}
		return v, nil, err
	case *types.Named:
		dep, err := b.buildFromNamed(ref)
		if err != nil {
			return nil, nil, err
		}
		v.Type = dep.GraphQLType()
		v.IsComplexType = dep.IsComplexType()
		return v, dep, nil
	case *types.Map:
		v.Type = BasicTypeMap
		return v, nil, nil
	}
	return nil, nil, fmt.Errorf("%v is not a supported type", fieldType)
}

// normalizeVariableType normalizes the variable type
func normalizeVariableType(t types.Type) (tt types.Type, nullable bool, isArray bool, nestDepth int) {
	switch v := t.(type) {
	case *types.Named:
		if _, ok := t.Underlying().(*types.Interface); ok {
			return t, true, false, 0
		}
		return t, false, true, 0
	case *types.Pointer:
		return v.Elem(), true, false, 0
	case *types.Slice:
		ctt, nullable, _, depth := normalizeVariableType(v.Elem())
		return ctt, nullable, true, depth + 1
	case *types.Basic:
		return t, false, false, 0
	case *types.Interface:
		return t, true, false, 0
	case *types.Map:
		return t, true, false, 0
		// case *types.Array:
		// go array is not currently supported for resolver binding so don't normalize here.
		// if it gets suppored, use the following logic.
		// case *types.Array:
		// 	isArray = true
		// 	tt, elementNullable, _, _, nestDepth = normalizeFieldType(t.(*types.Array).Elem())
		// 	return tt, true, isArray, elementNullable, nestDepth + 1
	}
	panic(fmt.Errorf("%v is not a supported type", t))
}
