package http

import (
	"hpapp.yssk22.dev/go/service/auth/appuser/oauth1"
)

// WithGraphQLSchema sets up the graphql endoints under the given path
// This option can be called multiple times to add multiple graphql endpoints
func WithOAuth1Providers(p ...oauth1.Provider) HttpOption {
	return func(cfg *httpConfig) {
		cfg.OAuth1Config = oauth1.NewConfig("oauth1", p...)
	}
}
