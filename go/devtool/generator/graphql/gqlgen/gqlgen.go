/*
Package gqlgen provides a helper function to generate code for gqlgen
*/
package gqlgen

import (
	"github.com/99designs/gqlgen/api"
	"github.com/99designs/gqlgen/codegen/config"
	"github.com/yssk22/hpapp/go/devtool/generator"
)

// wrapper for gqlgen generate
func NewGQLGenGenerator(configPath string) generator.Generator {
	r := &gqlgenGenerator{
		configPath: configPath,
	}
	return r
}

type gqlgenGenerator struct {
	configPath string
}

func (g *gqlgenGenerator) Name() string {
	return "gqlgen Wrapper Generator"
}

func (g *gqlgenGenerator) Generate() error {
	cfg, err := config.LoadConfig(g.configPath)
	if err != nil {
		return err
	}
	return api.Generate(cfg)
}
