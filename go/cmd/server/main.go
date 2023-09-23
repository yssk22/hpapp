package main

import (
	"hpapp.yssk22.dev/go/graphql"
	"hpapp.yssk22.dev/go/service/auth/appuser/oauth1"
	"hpapp.yssk22.dev/go/service/bootstrap"
	"hpapp.yssk22.dev/go/service/bootstrap/http"
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
