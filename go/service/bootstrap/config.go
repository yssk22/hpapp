// package bootstrap provides the default bootstrap configuration
package bootstrap

import (
	"path/filepath"

	"github.com/yssk22/hpapp/go/service/auth"
	"github.com/yssk22/hpapp/go/service/auth/extuser"
	"github.com/yssk22/hpapp/go/service/bootstrap/config"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/healthcheck"
	"github.com/yssk22/hpapp/go/service/helloproject/member"
	"github.com/yssk22/hpapp/go/system/environment"
	"github.com/yssk22/hpapp/go/system/environment/devcontainer"
)

func GetDefaultEnvironment() environment.Environment {
	return devcontainer.NewDefault()
}

func GetDefaultServices() []config.Service {
	return []config.Service{
		healthcheck.NewService(),
		auth.NewAuthService(extuser.NewFileAuthenticator(filepath.Join(".", "data", "localauth.json"))),
		entutil.NewService(),
		member.NewMemberService(),
	}
}
