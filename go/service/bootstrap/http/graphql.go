package http

import (
	"context"
	"fmt"
	"net/http"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/yssk22/hpapp/go/foundation/errors"
	ccontext "github.com/yssk22/hpapp/go/system/context"
	"github.com/yssk22/hpapp/go/system/slog"
)

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
