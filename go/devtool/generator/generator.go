package generator

import (
	"fmt"
	"log"
)

type Generator interface {
	Name() string
	Generate() error
}

func Generate(list ...Generator) error {
	for _, g := range list {
		log.Println("Generator -- ", g.Name()) //nolint:gocritic // we want to show the progress of generators
		err := g.Generate()
		if err != nil {
			return fmt.Errorf("%s error: %w", g.Name(), err)
		}
	}
	return nil
}
