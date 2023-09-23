// extuser package provides authentications with external provider.
//
// firebase based authentication and file based authentication is now supported.
//
package extuser

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/yssk22/hpapp/go/service/bootstrap/http/middleware"
	ccontext "github.com/yssk22/hpapp/go/system/context"
)

type ExternalUser struct {
	ProviderName  string
	UserID        string
	AccessToken   string
	RefreshToken  string
	TokenExpireAt time.Time
}

type contextKey struct{}

var ctxExternalUserKey = contextKey{}

func WithUser(ctx context.Context, user *ExternalUser) context.Context {
	ctx = context.WithValue(ctx, ctxExternalUserKey, user)
	if user != nil {
		ccontext.SetAttribute(ctx, "service.auth.extuser", map[string]interface{}{
			"id":            user.UserID,
			"provider_name": user.ProviderName,
		})
	}
	return ctx
}

// CurrentUser returns the external user authenticated by X-HPAPP-EXTERNAL-TOKEN header
// It could be nil if not sent.
func CurrentUser(ctx context.Context) *ExternalUser {
	v := ctx.Value(ctxExternalUserKey)
	if v == nil {
		return nil
	}
	return v.(*ExternalUser)
}

type Authenticator interface {
	VerifyToken(context.Context, string) *ExternalUser
}

type httpMiddleware struct {
	authenticator Authenticator
}

func (m *httpMiddleware) Process(r *http.Request) *middleware.Result {
	ctx := r.Context()
	token := strings.TrimPrefix(r.Header.Get("X-HPAPP-3P-Authorization"), "Bearer ")
	user := m.authenticator.VerifyToken(ctx, token)
	if user != nil {
		return &middleware.Result{
			Context: WithUser(ctx, user),
		}
	}
	return &middleware.Result{
		Context: ctx,
	}
}

func NewHttpMiddleware(a Authenticator) middleware.HttpMiddleware {
	return &httpMiddleware{
		authenticator: a,
	}
}
