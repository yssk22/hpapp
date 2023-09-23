package external

import (
	"context"
	"net/http"

	"github.com/yssk22/hpapp/go/system/slog"
)

// Logger returns a *http.Client that logs the round trip
func Logger(ctx context.Context, c *http.Client) *http.Client {
	return Wrap(c, &logger{
		ctx:  ctx,
		base: c.Transport,
	})
}

type logger struct {
	ctx  context.Context
	base http.RoundTripper
}

func (r *logger) RoundTrip(req *http.Request) (*http.Response, error) {
	rt := r.base
	if rt == nil {
		rt = http.DefaultTransport
	}
	ctx := req.Context()
	return slog.Track(ctx, "system.http.external", func(la slog.Attributes) (*http.Response, error) {
		resp, err := rt.RoundTrip(req)
		if resp != nil {
			la.Set("status_code", resp.StatusCode)
		}
		return resp, err
	},
		slog.Attribute("uri", req.URL.String()),
		slog.Attribute("domain", req.URL.Hostname()),
	)
}
