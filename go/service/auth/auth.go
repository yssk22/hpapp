package auth

import (
	"net/http"

	"github.com/spf13/cobra"
	"hpapp.yssk22.dev/go/service/auth/appuser"
	"hpapp.yssk22.dev/go/service/auth/client"
	"hpapp.yssk22.dev/go/service/auth/extuser"
	"hpapp.yssk22.dev/go/service/bootstrap/config"
	"hpapp.yssk22.dev/go/service/bootstrap/http/middleware"
	"hpapp.yssk22.dev/go/service/bootstrap/http/task"
)

func NewAuthService(
	extAuth extuser.Authenticator,
	clientAuths ...client.Authenticator,
) config.Service {
	return &authService{
		extAuth:     extAuth,
		clientAuths: clientAuths,
	}
}

type authService struct {
	extAuth     extuser.Authenticator
	clientAuths []client.Authenticator
}

func (a *authService) Middleware() []middleware.HttpMiddleware {
	return []middleware.HttpMiddleware{
		appuser.NewHttpMiddleware(),
		extuser.NewHttpMiddleware(a.extAuth),
		client.NewHttpMiddleware(a.clientAuths...),
		&postAuthMiddleware{},
	}
}

func (a *authService) Tasks() []task.Task {
	return nil
}

func (a *authService) Command() *cobra.Command {
	cmd := cobra.Command{
		Use:   "auth",
		Short: "manage authentication",
	}
	cmd.AddCommand(extuser.Command())
	return &cmd
}

type postAuthMiddleware struct{}

func (f *postAuthMiddleware) Process(r *http.Request) *middleware.Result {
	ctx := r.Context()
	// If system admin client call the endpoint with their priviledge without any user access tokens,
	// they can be treated as admin. e.g. cronjob.
	if client.CurrentClient(ctx).IsAdmin(ctx) {
		if appuser.CurrentUser(ctx).IsGuest(ctx) {
			ctx = appuser.WithAdmin(ctx)
		}
	}
	return &middleware.Result{
		Code:    0,
		Message: "",
		Context: ctx,
	}
}
