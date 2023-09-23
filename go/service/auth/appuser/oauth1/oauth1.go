/**
oauth1 provides a service to authenticate users using OAuth 1.0a.
this package is maintained due to Twitter OAuth1 flow.
*/
package oauth1

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"path"

	"github.com/yssk22/hpapp/go/service/errors"
	"github.com/yssk22/hpapp/go/system/slog"
)

// Provider is an interface to process oauth
type Provider interface {
	GetSlug() string
	RequestToken(context.Context, string) (*RequestTokenResponse, error)
	AccessToken(context.Context, string, string, string) (*AccessTokenResponse, error)
}

type RequestTokenResponse struct {
	OAuthToken             string `json:"oauth_token"`
	OAuthTokenSecret       string `json:"oauth_token_secret"`
	OAuthCallbackConfirmed bool   `json:"oauth_callback_confirmed"`
}

type AccessTokenResponse struct {
	AccessToken       string `json:"access_token"`
	AccessTokenSecret string `json:"access_token_secret"`
}

// Config is a list of oauth backend providers and setup the Server Mux.
type Config struct {
	base      string
	providers []Provider
}

func NewConfig(base string, providers ...Provider) *Config {
	return &Config{
		base:      base,
		providers: providers,
	}
}

func (config *Config) RegisterMux(mux *http.ServeMux) {
	for _, provider := range config.providers {
		mux.HandleFunc(
			fmt.Sprintf("/%s", path.Join(config.base, provider.GetSlug(), "request-token")),
			func(w http.ResponseWriter, r *http.Request) {
				ctx := r.Context()
				resp, err := provider.RequestToken(ctx, r.URL.Query().Get("callback_url"))
				config.writeResponse(ctx, w, resp, err)
			},
		)
		mux.HandleFunc(
			fmt.Sprintf("/%s", path.Join(config.base, provider.GetSlug(), "access-token")),
			func(w http.ResponseWriter, r *http.Request) {
				ctx := r.Context()
				resp, err := provider.AccessToken(
					ctx,
					r.URL.Query().Get("oauth_token"),
					r.URL.Query().Get("oauth_secret"),
					r.URL.Query().Get("oauth_verifier"),
				)
				config.writeResponse(ctx, w, resp, err)
			},
		)
	}
}

func (config Config) writeResponse(ctx context.Context, w http.ResponseWriter, obj interface{}, err error) {
	e := json.NewEncoder(w)
	w.Header().Set("content-type", "application/json")
	if err != nil {
		err = errors.Wrap(ctx, err, errors.SlogOptions(slog.Name("service.auth.extuser.oauth1")))
		w.WriteHeader(500)
		_ = e.Encode(map[string]interface{}{
			"ok":    false,
			"error": err.Error(),
		})
		return
	}
	w.WriteHeader(200)
	_ = e.Encode(obj)
}
