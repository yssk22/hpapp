package schema

import (
	"fmt"
	"go/types"
	"strings"

	"hpapp.yssk22.dev/go/foundation/stringutil"
)

var (
	ErrInvalidIDLikeMethodSignature = fmt.Errorf("The method ID() should have no parameter or only one context.Context parameter")
	ErrSecondReturnMustBeError      = fmt.Errorf("The second return value must be error")
)

// Method is a method under Struct or Interface
type Method struct {
	Name        string
	Parameters  []Variable
	ReturnValue Variable
}

func (m *Method) String() string {
	var tokens []string
	tokens = append(tokens, m.Name)
	if len(m.Parameters) > 0 {
		tokens = append(tokens, "(")
		var params []string
		for _, p := range m.Parameters {
			params = append(params, p.String())
		}
		tokens = append(tokens, strings.Join(params, ", "))
		tokens = append(tokens, ")")
	}
	tokens = append(tokens, fmt.Sprintf(": %s", m.ReturnValue.String()))
	return strings.Join(tokens, "")
}

func (d *dependencyGenerator) getMethod(fun *types.Func) (*Method, []Dependency, error) {
	signature := fun.Type().(*types.Signature)
	results := signature.Results()
	if !fun.Exported() {
		return nil, nil, nil
	}
	if results.Len() == 0 {
		return nil, nil, nil
	}
	var arguments []Variable
	var dependencies []Dependency

	// the case func Foo() (value, error)
	if results.Len() == 2 {
		errReturn := results.At(1)
		if !d.IsError(errReturn.Type()) {
			return nil, nil, ErrSecondReturnMustBeError
		}
	}
	returnValue, dep, err := d.getVariable(results.At(0))
	if err != nil {
		return nil, nil, err
	}
	if dep != nil {
		dependencies = append(dependencies, dep)
	}

	params := signature.Params()

	// if the method is ID() or ID(context.Context), then it should be GraphQL ID
	if returnValue.Type == BasicTypeString && fun.Name() == "ID" {
		if d.isNoParamOrContextParamOnly(params) {
			returnValue.Type = BasicTypeID
		} else {
			return nil, nil, ErrInvalidIDLikeMethodSignature
		}
	}

	for i := 0; i < params.Len(); i++ {
		param := params.At(i)
		if d.IsContext(param.Type()) {
			continue
		}
		obj, dep, err := d.getVariable(params.At(i))
		if err != nil {
			return nil, nil, fmt.Errorf("invalid parameter %s: %w", params.At(i).Name(), err)
		}
		obj.Name = params.At(i).Name()
		if obj.Type == "String" && obj.Name == "id" {
			obj.Type = "ID"
		}
		if dep != nil {
			dep := &InputDependency{inner: dep}
			dependencies = append(dependencies, dep)
			obj.Type = dep.GraphQLType()
		}
		arguments = append(arguments, *obj)
	}
	return &Method{
		Name:        stringutil.ToLowerCamelCase(fun.Name()),
		Parameters:  arguments,
		ReturnValue: *returnValue,
	}, dependencies, nil
}

func (d *dependencyGenerator) isNoParamOrContextParamOnly(params *types.Tuple) bool {
	if params.Len() == 0 {
		return true
	}
	var firstParam = params.At(0)
	return d.IsContext(firstParam.Type()) && params.Len() == 1
}
