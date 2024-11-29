// package bootstrap provides the default bootstrap configuration
package bootstrap

import (
	"flag"
	"path/filepath"

	"github.com/yssk22/hpapp/go/service/auth"
	"github.com/yssk22/hpapp/go/service/auth/client"
	"github.com/yssk22/hpapp/go/service/auth/extuser"
	"github.com/yssk22/hpapp/go/service/bootstrap/cli"
	"github.com/yssk22/hpapp/go/service/bootstrap/config"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/healthcheck"
	"github.com/yssk22/hpapp/go/service/helloproject/ameblo"
	"github.com/yssk22/hpapp/go/service/helloproject/blob"
	"github.com/yssk22/hpapp/go/service/helloproject/elineupmall"
	"github.com/yssk22/hpapp/go/service/helloproject/ig"
	"github.com/yssk22/hpapp/go/service/helloproject/ig/apify"
	"github.com/yssk22/hpapp/go/service/helloproject/member"
	"github.com/yssk22/hpapp/go/service/helloproject/upfc"
	"github.com/yssk22/hpapp/go/service/push"
	"github.com/yssk22/hpapp/go/system/environment"
	"github.com/yssk22/hpapp/go/system/environment/devcontainer"
	"github.com/yssk22/hpapp/go/system/environment/gcp"
)

type bootstrap struct {
	environment environment.Environment
	services    []config.Service
}

func (b *bootstrap) RunCLI() {
	cli.RunCLI(
		b.environment,
		b.services...,
	)
}

func RunCLI() {
	// We use --prod flag to configure production environment since we sometimes use production environment from dev container
	// to do `production` test rapidly.
	// When using --prod flag, the command line has to authorized with `gcloud auth login` and set the correct project
	// to use application credentials to connect GCP production environment.
	prod := flag.Bool("prod", false, "run in production mode")
	flag.Parse()
	if *prod {
		newProduction().RunCLI()
	} else {
		newDevcontainer().RunCLI()
	}
}

func newDevcontainer() *bootstrap {
	return &bootstrap{
		environment: devcontainer.NewDefault(),
		services: []config.Service{
			healthcheck.NewService(),
			auth.NewAuthService(extuser.NewFileAuthenticator(filepath.Join(".", "data", "localauth.json"))),
			entutil.NewService(),
			member.NewMemberService(),
		},
	}
}

func newProduction() *bootstrap {
	// base implementation shared across services.
	env := gcp.NewEnvironment()

	var (
		blobCrawler  = blob.NewCrawler()
		memberTagger = member.NewSimpleTextMatchingTagger()
	)

	return &bootstrap{
		environment: env,
		services: []config.Service{
			auth.NewAuthService(
				extuser.NewFirebaseAuthenticator(env.GCPProjectID),
				client.NewFirebaseAppCheck(env.GCPProjectID),
				client.NewGCPServiceToServiceAuth(env.GCPProjectID),
			),
			push.NewService(),
			member.NewMemberService(),
			ameblo.NewService(
				blobCrawler,
				memberTagger,
			),
			ig.NewService(
				blobCrawler,
				memberTagger,
				ig.WithLatestTarget(apify.NewLatestTarget()),
				ig.WithBackfillTarget(apify.NewBackfillTarget()),
			),
			elineupmall.NewService(
				blobCrawler,
				memberTagger,
				elineupmall.DefaultSalesPeriodExtractor,
				elineupmall.DefaultCategoryResolver,
			),
			upfc.NewService(),
			entutil.NewService(),
			healthcheck.NewService(),
		},
	}
}
