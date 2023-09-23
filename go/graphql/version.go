package graphql

import (
	"github.com/99designs/gqlgen/graphql"
	v3 "hpapp.yssk22.dev/go/graphql/v3/generated"
	v3resolver "hpapp.yssk22.dev/go/graphql/v3/resolver"
)

func V3() graphql.ExecutableSchema {
	return v3.NewExecutableSchema(
		v3.Config{
			Resolvers: &v3resolver.Resolver{},
		},
	)
}
