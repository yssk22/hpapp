package schema

import "fmt"

// Schema represents GraphQL Schema definition.
type Schema interface {
	Source() string
}

func goModelDirective(str string) string {
	return fmt.Sprintf("@goModel(model: %q)", str)
}
