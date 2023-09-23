package appuser

import (
	"context"
	"net/http"
	"strings"

	"github.com/yssk22/hpapp/go/service/bootstrap/http/middleware"
	"github.com/yssk22/hpapp/go/service/ent"
	ccontext "github.com/yssk22/hpapp/go/system/context"
)

// ProviderAuthResult is a result of authentication by the given provider.
type User interface {
	ID() string
	Username() string
	ProviderName() string
	IsAdmin(ctx context.Context) bool
	IsGuest(ctx context.Context) bool
}

func SuperAdmin() User {
	return superadmim
}

func Guest() User {
	return guest
}

type systemUser struct {
	id       string
	username string
	isAdmin  bool
	isGuest  bool
}

func (u *systemUser) ID() string {
	return u.id
}

func (u *systemUser) ProviderName() string {
	return "system"
}

func (u *systemUser) Username() string {
	return u.username
}

func (u *systemUser) IsAdmin(ctx context.Context) bool {
	return u.isAdmin
}

func (u *systemUser) IsGuest(ctx context.Context) bool {
	return u.isGuest
}

var (
	superadmim = &systemUser{id: "superadmin", username: "superadmin", isAdmin: true, isGuest: false}
	guest      = &systemUser{id: "guest", username: "guest", isGuest: true, isAdmin: false}
)

type contextKey struct{}

var ctxCurrentUserKey = contextKey{}

// CurrentUser returns the current user attached with the context
func CurrentUser(ctx context.Context) User {
	if user, ok := ctx.Value(ctxCurrentUserKey).(User); ok {
		return user
	}
	return nil
}

func CurrentEntUser(ctx context.Context) (*ent.User, error) {
	user := CurrentUser(ctx)
	if user == nil || user.IsGuest(ctx) {
		return nil, ErrAuthenticationRequired
	}
	entuser, ok := user.(*entUser)
	if !ok {
		return nil, ErrNotNormalUser
	}
	return entuser.record, nil
}

// CurrentEntUserID returns the int version of user id in the current context.
// if the current user is not set nor entuser, it returns 0 (as an invalid id)
func CurrentEntUserID(ctx context.Context) int {
	user, err := CurrentEntUser(ctx)
	if err != nil {
		return 0
	}
	return user.ID
}

// EntID returns the int version of User.ID.
// If the user is not an entuser, it returns 0 (as an invalid id)
func EntID(user User) int {
	entuser, ok := user.(*entUser)
	if !ok {
		return 0
	}
	return entuser.record.ID
}

// WithUser attach the user with the context
func WithUser(ctx context.Context, user User) context.Context {
	ctx = context.WithValue(ctx, ctxCurrentUserKey, user)
	ccontext.SetAttribute(ctx, "service.auth.appuser", map[string]interface{}{
		"id":       user.ID(),
		"username": user.Username(),
	})
	return ctx
}

// WithAdmin attach the admin user with the context
func WithAdmin(ctx context.Context) context.Context {
	return context.WithValue(ctx, ctxCurrentUserKey, SuperAdmin())
}

type Authenticator interface {
	VerifyToken(ctx context.Context, token string) User
}

type httpMiddleware struct{}

func (f *httpMiddleware) Process(r *http.Request) *middleware.Result {
	ctx := r.Context()
	token := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
	u := VerifyToken(ctx, token)
	if u != nil {
		return &middleware.Result{
			Code:    0,
			Message: "",
			Context: WithUser(ctx, u),
		}
	}
	return &middleware.Result{
		Code:    0,
		Message: "",
		Context: WithUser(ctx, Guest()),
	}
}

func NewHttpMiddleware() middleware.HttpMiddleware {
	return &httpMiddleware{}
}
