package external

import (
	"context"
	"net/http"
)

type contextHttpClientKey struct{}

var ctxHttpClientKey = contextHttpClientKey{}

func WithHttpClient(ctx context.Context, c *http.Client) context.Context {
	return context.WithValue(ctx, ctxHttpClientKey, c)
}

func FromContext(ctx context.Context) *http.Client {
	return ctx.Value(ctxHttpClientKey).(*http.Client)
}

// Wrap returns a new *http.Client wrapping the transport function to extend client features
func Wrap(base *http.Client, rt http.RoundTripper) *http.Client {
	cc := new(http.Client)
	*cc = *base
	cc.Transport = rt
	return cc
}
