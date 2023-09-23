// client package implements the client authentication.
// It's to identify the verified clients.
package client

import (
	"context"
	"errors"
	"net/http"

	"hpapp.yssk22.dev/go/service/bootstrap/http/middleware"
	ccontext "hpapp.yssk22.dev/go/system/context"
)

type Client interface {
	ID() string
	Name() string
	IsVerified(ctx context.Context) bool
	IsAdmin(ctx context.Context) bool
}

type systemClient struct {
	id         string
	name       string
	isVerified bool
	isAdmin    bool
}

func (s *systemClient) ID() string {
	return s.id
}

func (s *systemClient) Name() string {
	return s.name
}

func (s *systemClient) IsVerified(ctx context.Context) bool {
	return s.isVerified
}

func (s *systemClient) IsAdmin(ctx context.Context) bool {
	return s.isAdmin
}

var anonymousClient = &systemClient{
	id:         "anonymous",
	name:       "anonymous",
	isVerified: false,
	isAdmin:    false,
}

var superAdminClient = &systemClient{
	id:         "admin",
	name:       "admin",
	isVerified: true,
	isAdmin:    true,
}

func Anonymous() Client {
	return anonymousClient
}

func SuperAdmin() Client {
	return superAdminClient
}

type Authenticator interface {
	TokenHeaderKey() string
	VerifyToken(ctx context.Context, token string) Client
}

type httpMiddleware struct {
	authenticators []Authenticator
}

type contextKey struct{}

var ctxClientKey = contextKey{}

func CurrentClient(ctx context.Context) Client {
	c := ctx.Value(ctxClientKey)
	if c == nil {
		panic(errors.New("no context value found. did you go through bootstrap?"))
	}
	return c.(Client)
}

func WithClient(ctx context.Context, c Client) context.Context {
	ctx = context.WithValue(ctx, ctxClientKey, c)
	ccontext.SetAttribute(ctx, "service.auth.client", map[string]interface{}{
		"id":   c.ID(),
		"name": c.Name(),
	})
	return ctx
}

func (f *httpMiddleware) Process(r *http.Request) *middleware.Result {
	ctx := r.Context()
	for _, a := range f.authenticators {
		token := r.Header.Get(a.TokenHeaderKey())
		client := a.VerifyToken(ctx, token)
		if client != nil {
			return &middleware.Result{
				Code:    0,
				Message: "",
				Context: WithClient(ctx, client),
			}
		}
	}
	return &middleware.Result{
		Code:    0,
		Message: "",
		Context: WithClient(ctx, Anonymous()),
	}
}

func NewHttpMiddleware(authenticators ...Authenticator) middleware.HttpMiddleware {
	return &httpMiddleware{
		authenticators: authenticators,
	}
}
