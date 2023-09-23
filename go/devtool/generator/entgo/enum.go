package entgo

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"hpapp.yssk22.dev/go/devtool/generator"
	"hpapp.yssk22.dev/go/devtool/generator/enum"
)

func NewEnumGenerator(dir string, options ...EnumGeneratorOption) generator.Generator {
	r := &enumGenerator{
		dir:      dir,
		filename: "entgo_enum.go",
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
	return "entgo Enum Generator"
}

func (g *enumGenerator) Generate() error {
	return enum.Generate(g.dir, g) // this will call g.Write(enums)
}

func (g *enumGenerator) GenerateEnums(enums []enum.EnumType) error {
	// output file must be in the same directory as the enum file since
	// the generator just adds Values() method to the enum types
	f, err := os.OpenFile(filepath.Join(g.dir, g.filename), os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)
	if err != nil {
		return err
	}
	absPath, err := filepath.Abs(g.dir)
	if err != nil {
		return err
	}
	pkg := filepath.Base(absPath)
	var lines []string
	lines = append(lines, fmt.Sprintf("package %s\n\n", pkg), "")
	for _, e := range enums {
		lines = append(lines, g.enumToString(e), "")
	}
	_, err = fmt.Fprint(f, strings.Join(lines, "\n"))
	return err
}

func (g *enumGenerator) enumToString(e enum.EnumType) string {
	var lines []string
	lines = append(lines, fmt.Sprintf("func (%s) Values() (types []string) {\n", e.Name))
	lines = append(lines, fmt.Sprintf("\tfor _, r := range []%s{", e.Name))
	for _, c := range e.Keys {
		lines = append(lines, fmt.Sprintf("\t\t%s,", c.GoName))
	}
	lines = append(lines, "\t} {")
	lines = append(lines, "\t\ttypes = append(types, string(r))")
	lines = append(lines, "\t}")
	lines = append(lines, "\treturn")
	lines = append(lines, "}")
	return strings.Join(lines, "\n")
}
