package schema

import (
	"encoding/json"
	"fmt"
	"go/types"
	"io"
	"os"
	"path/filepath"

	"golang.org/x/tools/go/packages"
	"hpapp.yssk22.dev/go/devtool"
	"hpapp.yssk22.dev/go/devtool/generator"
	"hpapp.yssk22.dev/go/foundation/slice"
)

var (
	ErrIncompleteMarshaler    = fmt.Errorf("the graphql.(Unm|M)arshler like interface is implemented but incomplete")
	ErrInvalidDependencyBuild = fmt.Errorf("cannot build the dependency on the type other than *types.Named")
	ErrUnsupportedType        = fmt.Errorf("cannot build the dependency on the type")
	ErrNameNotFound           = fmt.Errorf("root object not found")
)

type GraphQLType string

// Dependency is a GoType that converted to Schema
type Dependency interface {
	// String returns the fully qualified name of dependency
	FullyQualifiedName() string
	// GraphQLName returns the type name used in the GraphQL schema
	GraphQLType() GraphQLType
	// IsComplexType returns true if the dependency is complex type
	IsComplexType() bool

	ToSchema() (Schema, []Dependency, error)
}

type dependencyGenerator struct {
	packages     []*packages.Package
	ioWriterType *types.Interface
	errorType    *types.Interface
	contextType  *types.Interface

	// options
	Roots           []string `json:"roots"`
	ExcludePackages []string `json:"exclude_packages"`
	ExcludeTypes    []string `json:"exclude_types"`

	OutputPath string `json:"output_path"`
	output     io.Writer
}

type GeneratorOption func(*dependencyGenerator)

func WithOutputFile(path string) GeneratorOption {
	return func(b *dependencyGenerator) {
		b.OutputPath = path
	}
}

func withOutput(output io.Writer) GeneratorOption {
	return func(b *dependencyGenerator) {
		b.output = output
	}
}

func WithRoot(roots ...string) GeneratorOption {
	return func(b *dependencyGenerator) {
		b.Roots = append(b.Roots, roots...)
	}
}

func WithExcludePackage(pkgs ...string) GeneratorOption {
	return func(b *dependencyGenerator) {
		b.ExcludePackages = append(b.ExcludePackages, pkgs...)
	}
}

func WithExcludeType(types ...string) GeneratorOption {
	return func(b *dependencyGenerator) {
		b.ExcludeTypes = append(b.ExcludeTypes, types...)
	}
}

func WithConfig(path string) GeneratorOption {
	return func(b *dependencyGenerator) {
		var another dependencyGenerator
		f, err := os.Open(path)
		if err != nil {
			panic(err)
		}
		defer f.Close()
		err = json.NewDecoder(f).Decode(&another)
		if err != nil {
			panic(err)
		}
		b.Roots = append(b.Roots, another.Roots...)
		b.ExcludePackages = append(b.ExcludePackages, another.ExcludePackages...)
		b.ExcludeTypes = append(b.ExcludeTypes, another.ExcludeTypes...)
	}
}

func NewGenerator(options ...GeneratorOption) generator.Generator {
	g := &dependencyGenerator{
		errorType: types.Universe.Lookup("error").Type().Underlying().(*types.Interface),

		Roots: []string{},
		ExcludePackages: []string{
			"time",
		},
		ExcludeTypes: []string{
			"error",
		},
		output: os.Stdout,
	}
	for _, opt := range options {
		opt(g)
	}
	return g
}

func (g *dependencyGenerator) Name() string {
	return "GraphQL Schema Generator"
}

func (g *dependencyGenerator) Generate() error {
	var err error
	var output io.Writer = g.output
	if g.OutputPath != "" {
		err := os.MkdirAll(filepath.Dir(g.OutputPath), 0755)
		if err != nil {
			return err
		}
		output, err = os.OpenFile(g.OutputPath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0600)
		if err != nil {
			return err
		}
	}
	if output == nil {
		output = os.Stdout
	}
	defer func() {
		if closer, ok := output.(io.Closer); ok {
			closer.Close()
		}
	}()
	// identify the packages of roots
	packageNames, err := slice.Map(g.Roots, func(_ int, root string) (string, error) {
		pkgName, _ := devtool.ParseFullQualifiedName(root)
		return pkgName, nil
	})
	if err != nil {
		panic(err)
	}
	pkgs, err := packages.Load(
		&packages.Config{
			Mode: packages.NeedImports | packages.NeedTypes | packages.NeedDeps | packages.NeedName | packages.NeedSyntax,
		},
		packageNames...,
	)
	if err != nil {
		panic(err)
	}
	g.packages = pkgs

	// TODO: why do we need to iterate all packages?
	for _, pkg := range pkgs {
		for _, other := range pkg.Imports {
			switch other.Name {
			case "io":
				g.ioWriterType = other.Types.Scope().Lookup("Writer").Type().Underlying().(*types.Interface)
			case "context":
				g.contextType = other.Types.Scope().Lookup("Context").Type().Underlying().(*types.Interface)
			}
		}
	}

	deps, err := slice.Map(g.Roots, func(_ int, root string) (Dependency, error) {
		dep, err := g.buildFromRoot(root)
		if err != nil {
			return nil, fmt.Errorf("%s error: %w", root, err)
		}
		return dep, nil
	})
	if err != nil {
		return err
	}
	var schemaMap = make(map[GraphQLType]bool)
	// we want to output []Schema at the same order with deps list
	for _, d := range deps {
		inner := []Dependency{d}
		for len(inner) > 0 {
			d := inner[0]
			inner = inner[1:]
			if ok := schemaMap[d.GraphQLType()]; ok {
				continue
			}
			schemaMap[d.GraphQLType()] = true
			s, deps_, err := d.ToSchema()
			if err != nil {
				return fmt.Errorf("%s: %w", d.FullyQualifiedName(), err)
			}
			if s != nil {
				if _, err := output.Write([]byte(s.Source() + "\n\n")); err != nil {
					return err
				}
			}
			inner = append(inner, deps_...)
		}
	}
	return nil
}

func (b *dependencyGenerator) buildFromRoot(fqn string) (Dependency, error) {
	pkgName, name := devtool.ParseFullQualifiedName(fqn)
	pkg := slice.FindFunc(b.packages, func(_ int, pkg *packages.Package) bool {
		return pkg.ID == pkgName
	})
	if pkg == nil {
		return nil, fmt.Errorf("pakcage %q not found", fqn)
	}
	obj := pkg.Types.Scope().Lookup(name)
	if obj == nil {
		return nil, ErrNameNotFound
	}
	named, ok := obj.Type().(*types.Named)
	if !ok {
		return nil, ErrInvalidDependencyBuild
	}
	return b.buildFromNamed(named)
}

func (b *dependencyGenerator) buildFromNamed(named *types.Named) (Dependency, error) {
	if named.Obj().Pkg() != nil {
		if slice.Index(b.ExcludePackages, named.Obj().Pkg().Path()) >= 0 {
			return &excludedDependency{
				namedRef: named,
			}, nil
		}
	}
	if slice.Index(b.ExcludeTypes, named.Obj().Name()) >= 0 {
		return &excludedDependency{
			namedRef: named,
		}, nil
	}
	underlying := named.Underlying()
	switch ref := underlying.(type) {
	case *types.Struct:
		return &structDependency{
			namedRef:  named,
			structRef: ref,
			generator: b,
		}, nil
	case *types.Interface:
		return &interfaceDependency{
			namedRef:     named,
			interfaceRef: ref,
			generator:    b,
		}, nil
	case *types.Basic:
		return &basicDependency{
			namedRef:  named,
			basicRef:  ref,
			generator: b,
		}, nil
	case *types.Map:
		return &excludedDependency{
			namedRef: named,
		}, nil
	}
	return nil, fmt.Errorf("%#v is not a supported type", underlying)
}

func (b *dependencyGenerator) IsIOWriter(t types.Type) bool {
	if b.ioWriterType == nil {
		// this means the package doesn't import io so `t` should not be ioWriter.
		return false
	}
	return types.Implements(t, b.ioWriterType)
}

func (b *dependencyGenerator) IsError(t types.Type) bool {
	return b.isSameType(t, b.errorType)
}

func (b *dependencyGenerator) IsContext(t types.Type) bool {
	if b.contextType == nil {
		// this means the package doesn't import io so `t` should not be ioWriter.
		return false
	}
	return types.Implements(t, b.contextType)
}

func (b *dependencyGenerator) isSameType(t1 types.Type, t2 types.Type) bool {
	if t1 == nil {
		return false
	}
	if types.Identical(t1, t2) {
		return true
	}
	return b.isSameType(t1.Underlying(), t2)
}

func (h *dependencyGenerator) IsMarshler(named *types.Named) (bool, error) {
	var hasMarshaler bool
	var hasUnmarshaler bool
	for i := 0; i < named.NumMethods(); i++ {
		method := named.Method(i)
		signature := method.Type().(*types.Signature)
		recv := signature.Recv()
		results := signature.Results()
		name := method.Name()
		if name == "MarshalGQL" {
			if results.Len() > 0 {
				return false, ErrIncompleteMarshaler
			}
			if signature.Params().Len() != 1 {
				return false, ErrIncompleteMarshaler
			}
			if !h.IsIOWriter(signature.Params().At(0).Type()) {
				return false, ErrIncompleteMarshaler
			}
			if _, isNamed := recv.Type().(*types.Named); !isNamed {
				return false, ErrIncompleteMarshaler
			}
			hasMarshaler = true
			if hasUnmarshaler {
				return true, nil
			}
		} else if name == "UnmarshalGQL" {
			if results.Len() != 1 {
				return false, ErrIncompleteMarshaler
			}
			errReturn := results.At(0)
			if !h.IsError(errReturn.Type()) {
				return false, ErrIncompleteMarshaler
			}
			if _, isPointer := recv.Type().(*types.Pointer); !isPointer {
				return false, ErrIncompleteMarshaler
			}
			hasUnmarshaler = true
			if hasMarshaler {
				return true, nil
			}
		}
	}
	// if one of Marshaler or Unmarshar is implemented, it would be by mistake.
	if hasMarshaler || hasUnmarshaler {
		return false, ErrIncompleteMarshaler
	}
	return false, nil
}

const (
	BasicTypeID      = "ID"
	BasicTypeString  = "String"
	BasicTypeInteger = "Int"
	BasicTypeFloat   = "Float"
	BasicTypeBoolean = "Boolean"
	BasicTypeMap     = "Map"
)

func (b *dependencyGenerator) getBasicTypeName(basic *types.Basic) (string, error) {
	// https://org/graphql-js/basic-types/
	// String, Int, Float, Boolean, and ID
	info := basic.Info()
	if info&types.IsString == types.IsString {
		return BasicTypeString, nil
	}
	if info&types.IsInteger == types.IsInteger {
		return BasicTypeInteger, nil
	}
	if info&types.IsFloat == types.IsFloat {
		if basic.Kind() != types.Float64 {
			return "", fmt.Errorf("%v is not a supported type", basic)
		}
		return BasicTypeFloat, nil
	}
	if info&types.IsBoolean == types.IsBoolean {
		return BasicTypeBoolean, nil
	}
	return "", fmt.Errorf("%v is not a supported type", basic)
}
