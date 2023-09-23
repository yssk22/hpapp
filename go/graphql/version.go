package graphql

import (
	"github.com/99designs/gqlgen/graphql"
	v3 "github.com/yssk22/hpapp/go/graphql/v3/generated"
	v3resolver "github.com/yssk22/hpapp/go/graphql/v3/resolver"
)

func V3() graphql.ExecutableSchema {
	return v3.NewExecutableSchema(
		v3.Config{
			Resolvers: &v3resolver.Resolver{},
		},
	)
}
