package http

import (
	"context"
	"fmt"
	"net/http"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"hpapp.yssk22.dev/go/foundation/errors"
	ccontext "hpapp.yssk22.dev/go/system/context"
	"hpapp.yssk22.dev/go/system/slog"
)

// WithGraphQLSchema sets up the graphql endoints under the given path
// This option can be called multiple times to add multiple graphql endpoints
func WithGraphQLSchema(path string, schema graphql.ExecutableSchema) HttpOption {
	return func(cfg *httpConfig) {
		cfg.GraphQLSchemas[path] = schema
	}
}

// WithGraphQLPlaygroundPath adds a playground handler under the given path per a graphql schema
// For example, if you setup like follows
//
//    WithGraphQLShema("/v1/graphql/", graphQLV1),
//    WithGraphQLShema("/v2/graphql/", graphQLV2),
//    WithGraphQLShema("/v3/graphql/", graphQLV3),
//    WithGraphQLPlaygroundPath("playground"),
//
// The playground will be available at the following paths:
//
//    /v1/graphql/playground'
//	  /v2/graphql/playground/
// 	  /v3/graphql/playground/
//
func WithGraphQLPlaygroundPath(path string) HttpOption {
	return func(cfg *httpConfig) {
		cfg.GraphQLPlaygroundPath = path
	}
}

func genGraphQLHandler(schema graphql.ExecutableSchema) http.Handler {
	h := handler.NewDefaultServer(schema)
	h.Use(&graphQLLogging{})
	return h
}

func genGraphQLPlaygroundHandler(endpoint string) http.Handler {
	return playground.Handler(fmt.Sprintf("GraphQL %s", endpoint), endpoint)
}

type graphQLLogging struct{}

func (l *graphQLLogging) ExtensionName() string {
	return "GraphQLLogging"
}

func (l *graphQLLogging) Validate(_ graphql.ExecutableSchema) error {
	return nil
}

func (l *graphQLLogging) InterceptResponse(
	ctx context.Context,
	next graphql.ResponseHandler,
) *graphql.Response {
	oc := graphql.GetOperationContext(ctx)
	if oc.Operation.Name == "IntrospectionQuery" {
		return next(ctx)
	}
	ccontext.SetAttribute(ctx, "bootstrap.http.graphql.info", map[string]interface{}{
		"operation": oc.Operation.Name,
		"variables": oc.Variables,
	})
	res, _ := slog.Track(ctx, "bootstrap.http.graphql", func(_ slog.Attributes) (*graphql.Response, error) {
		res := next(ctx)
		var errs []error
		for _, e := range res.Errors {
			errs = append(errs, e)
		}
		return res, errors.MultiError(errs).ToReturn()
	})
	return res
}

func (l *graphQLLogging) InterceptField(
	ctx context.Context,
	next graphql.Resolver,
) (interface{}, error) {
	return next(ctx)
}
