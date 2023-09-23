package main

import (
	"net/http"
	"os"

	"github.com/99designs/gqlgen/handler"
	"github.com/yssk22/hpapp/go/devtool/generator/test/testdata/e2e/gqlgen"
)

func main() {
	mux := http.NewServeMux()
	mux.Handle("/graphql/", handler.Playground("GraphQL playground", "/query"))
	mux.Handle("/query", handler.GraphQL(gqlgen.NewExecutableSchema(
		gqlgen.Config{
			Resolvers: &gqlgen.Resolver{},
		},
	)))

	http.ListenAndServe(":"+os.Args[1], mux)
}
