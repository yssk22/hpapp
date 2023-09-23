// package bootstrap provides the default bootstrap configuration
package bootstrap

import (
	"path/filepath"

	"hpapp.yssk22.dev/go/service/auth"
	"hpapp.yssk22.dev/go/service/auth/extuser"
	"hpapp.yssk22.dev/go/service/bootstrap/config"
	"hpapp.yssk22.dev/go/service/entutil"
	"hpapp.yssk22.dev/go/service/healthcheck"
	"hpapp.yssk22.dev/go/service/helloproject/member"
	"hpapp.yssk22.dev/go/system/environment"
	"hpapp.yssk22.dev/go/system/environment/devcontainer"
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
