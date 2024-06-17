/*
Package enum provides a Enum generator interface to find the enum types in a Go source directory.

Go does not have a standard Enum definition syntax. On the other hand, entgo and gqlgen treat Enum as a set of constants.
To define enum that can be available for entgo and gqlgen, define a type of Enum for basic types such as string and define constants in the format `{Enum type name}{"Value"} = Value`.

The following example defines an Enum named EnumType with values A, B, and C.

	type EnumType string

	const (
		EnumTypeA EnumType = "A"
		EnumTypeB EnumType = "B"
		EnumTypeC EnumType = "C"
	)

Enum generator searches for types like above and generates functions required for entgo and gqlgen:

  - `func(EnumType) Values() string` for entgo.
  - `MarshalGQL(io.Writer)` and `UnmarshalGQL(interface{})` for gqlgen.
*/
package enum

import (
	"go/types"
	"sort"
	"strings"

	"github.com/yssk22/hpapp/go/devtool/generator/helper"
	"golang.org/x/tools/go/packages"
)

// Generator is an interface to define how enum is implemented
// enum.Generate(dir, Generator) calls GenerateEnums method of the Generator
type Generator interface {
	GenerateEnums([]EnumType) error
}

// Generate invoke GenerateEnums with the enum types found in a directory
func Generate(dir string, generators ...Generator) error {
	importPath, err := helper.ResolveGoImportPath(dir)
	if err != nil {
		return err
	}
	cfg := &packages.Config{
		// TODO: remove unnecessary flags
		Mode: packages.NeedName | packages.NeedFiles | packages.NeedCompiledGoFiles | packages.NeedImports | packages.NeedTypes | packages.NeedTypesSizes | packages.NeedSyntax | packages.NeedTypesInfo | packages.NeedDeps,
		Dir:  dir,
	}
	pkgs, err := packages.Load(cfg, importPath)
	if err != nil {
		return err
	}
	pkg := pkgs[0]
	scope := pkg.Types.Scope()
	enums := getEnumList(scope)
	for _, g := range generators {
		err := func(g Generator) error {
			return g.GenerateEnums(enums)
		}(g)
		if err != nil {
			return err
		}
	}
	return nil
}

type EnumKey struct {
	GoName string
	Name   string
	Value  string
}

type EnumType struct {
	Name string
	Keys []EnumKey
}

func getEnumList(scope *types.Scope) []EnumType {
	nameToGQLGenEnum := make(map[*types.Named]*EnumType)
	names := scope.Names()
	for _, n := range names {
		obj := scope.Lookup(n)
		objType, ok := obj.Type().(*types.Named)
		if !ok {
			continue
		}
		_, ok = objType.Underlying().(*types.Basic)
		if !ok {
			continue
		}
		if _, ok = nameToGQLGenEnum[objType]; !ok {
			nameToGQLGenEnum[objType] = &EnumType{}
		}
		switch ot := obj.(type) {
		case *types.TypeName:
			nameToGQLGenEnum[objType].Name = ot.Id()
		case *types.Const:
			nameToGQLGenEnum[objType].Keys = append(nameToGQLGenEnum[objType].Keys, *newEnumKey(ot, objType.Obj().Id()))
		}
	}
	// convert map to slice
	var list []EnumType
	for _, v := range nameToGQLGenEnum {
		if len(v.Keys) > 0 {
			list = append(list, *v)
		}
	}
	sort.Slice(list, func(i, j int) bool {
		return list[i].Name < list[j].Name
	})
	return list
}

// GetEnum returns Enum for the named type
func GetEnum(t *types.Named) *EnumType {
	typeName := t.Obj().Name()
	scope := t.Obj().Pkg().Scope()
	var keys []EnumKey
	for _, name := range scope.Names() {
		obj := scope.Lookup(name)
		if obj.Type() == t {
			if c, ok := obj.(*types.Const); ok {
				keys = append(keys, *newEnumKey(c, typeName))
			}
		}
	}
	return &EnumType{
		Name: typeName,
		Keys: keys,
	}
}

func newEnumKey(c *types.Const, prefix string) *EnumKey {
	return &EnumKey{
		Name:   strings.TrimPrefix(c.Id(), prefix),
		GoName: c.Id(),
		Value:  c.Val().ExactString(),
	}
}
