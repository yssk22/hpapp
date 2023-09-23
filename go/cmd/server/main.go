package main

import (
	"github.com/yssk22/hpapp/go/graphql"
	"github.com/yssk22/hpapp/go/service/auth/appuser/oauth1"
	"github.com/yssk22/hpapp/go/service/bootstrap"
	"github.com/yssk22/hpapp/go/service/bootstrap/http"
)

func main() {
	http.RunHttpServer(
		bootstrap.GetDefaultEnvironment(),
		http.WithService(bootstrap.GetDefaultServices()...),

		// http service settings
		http.WithGraphQLSchema("/graphql/v3", graphql.V3()),
		http.WithGraphQLPlaygroundPath("playground"),
		// you need to configure Twitter settings to make this work
		http.WithOAuth1Providers(oauth1.NewTwitterOAuth()),
	)

}
