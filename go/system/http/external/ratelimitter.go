package external

import (
	"context"
	"net/http"
	"strings"
	"sync"

	"golang.org/x/time/rate"
	"hpapp.yssk22.dev/go/system/slog"
)

type DomainRateConfig struct {
	DomainName string
	R          rate.Limit
	B          int
}

// RateLimitter returns a *http.Client that has a request rate limit
// This rate limit is applied to the instance / process level.
// If you have 4 instances and have 2 requests / sec to example.com, then you can request up to 8 requests / sec.
func RateLimitter(ctx context.Context, c *http.Client, domains ...DomainRateConfig) *http.Client {
	return Wrap(c, &rateLimiter{
		ctx:       ctx,
		base:      c.Transport,
		domains:   domains,
		limitters: sync.Map{},
	})
}

type rateLimiter struct {
	ctx       context.Context
	base      http.RoundTripper
	domains   []DomainRateConfig
	limitters sync.Map
}

func (r *rateLimiter) RoundTrip(req *http.Request) (*http.Response, error) {
	domain := req.URL.Hostname()
	var limiter *rate.Limiter
	for _, config := range r.domains {
		if strings.HasSuffix(domain, config.DomainName) {
			v, _ := r.limitters.LoadOrStore(config.DomainName, rate.NewLimiter(config.R, config.B))
			limiter = v.(*rate.Limiter)
		}
	}
	ctx := req.Context()
	if limiter != nil {
		if err := limiter.Wait(req.Context()); err != nil {
			return nil, err
		}
	} else {
		slog.Warning(ctx,
			"no rate limit configured",
			slog.Name("system.http.external.rate_limitter"),
			slog.Attribute("domain", domain),
		)
	}

	rt := r.base
	if rt == nil {
		rt = http.DefaultTransport
	}

	return rt.RoundTrip(req)
}
