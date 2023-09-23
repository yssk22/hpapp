package gqlgen

import (
	"fmt"
	"io"
	"os"
	"path/filepath"

	"github.com/yssk22/hpapp/go/devtool/generator"
	"github.com/yssk22/hpapp/go/devtool/generator/enum"
	"github.com/yssk22/hpapp/go/foundation/stringutil"
)

func NewEnumGenerator(dir string, options ...EnumGeneratorOption) generator.Generator {
	r := &enumGenerator{
		dir:      dir,
		filename: "gqlgen_enum.go",
	}
	for _, opt := range options {
		opt(r)
	}
	return r
}

type EnumGeneratorOption func(g *enumGenerator)

func WithFileName(filename string) EnumGeneratorOption {
	return func(g *enumGenerator) {
		g.filename = filename
	}
}

type enumGenerator struct {
	dir      string
	filename string
}

func (g *enumGenerator) Name() string {
	return "gqlgen Enum Generator"
}

func (g *enumGenerator) Generate() error {
	return enum.Generate(g.dir, g) // this will call g.Write(enums)
}

func (g *enumGenerator) GenerateEnums(enums []enum.EnumType) error {
	// output file must be in the same directory as the enum file since
	// the generator just adds MarshalGQL and UnmarshalGQL methods to the enum types
	f, err := os.OpenFile(filepath.Join(g.dir, g.filename), os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)
	if err != nil {
		return err
	}
	absPath, err := filepath.Abs(g.dir)
	if err != nil {
		return err
	}
	pkg := filepath.Base(absPath)
	fmt.Fprintf(f, "package %s\n\n", pkg)
	fmt.Fprintf(f, "import (\n")
	fmt.Fprintf(f, "\t\"fmt\"\n")
	fmt.Fprintf(f, "\t\"io\"\n")
	fmt.Fprintf(f, "\t\"strconv\"\n")
	fmt.Fprintf(f, ")\n")
	fmt.Fprintf(f, "\n")
	for _, e := range enums {
		g.writeMarshalGraphQL(f, e)
		fmt.Fprint(f, "\n")
		g.writeUnmarshalGraphQL(f, e)
		fmt.Fprint(f, "\n")
	}
	return nil
}

func (g *enumGenerator) writeMarshalGraphQL(w io.Writer, e enum.EnumType) {
	fmt.Fprintf(w, "func (e %s) MarshalGQL(w io.Writer) {\n", e.Name)
	fmt.Fprintf(w, "\tswitch e {\n")
	for _, c := range e.Keys {
		fmt.Fprintf(w, "\tcase %s:\n", c.GoName)
		fmt.Fprintf(w, "\t\tfmt.Fprint(w, strconv.Quote(%q))\n", stringutil.ToSnakeCase(c.Name))
	}
	fmt.Fprintf(w, "\t}\n")
	fmt.Fprintf(w, "}\n")
}

func (g *enumGenerator) writeUnmarshalGraphQL(w io.Writer, e enum.EnumType) {
	fmt.Fprintf(w, "func (e *%s) UnmarshalGQL(v interface{}) error {\n", e.Name)
	fmt.Fprintf(w, "\tswitch v.(string) {\n")
	for _, c := range e.Keys {
		fmt.Fprintf(w, "\tcase %q:\n", stringutil.ToSnakeCase(c.Name))
		fmt.Fprintf(w, "\t\t*e = %s\n", c.GoName)
	}
	fmt.Fprintf(w, "\t}\n")
	fmt.Fprintf(w, "\treturn nil\n")
	fmt.Fprintf(w, "}\n")
}
