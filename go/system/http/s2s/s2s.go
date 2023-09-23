package s2s

import (
	"context"
	"net/http"
	"strings"
)

// Client implements Request
type Client interface {
	Request(ctx context.Context, path string, payload []byte, options map[string]string) error
}

type contextClientKey struct{}

var ctxClientKey = contextClientKey{}

func WithClient(ctx context.Context, c Client) context.Context {
	return context.WithValue(ctx, ctxClientKey, c)
}

func FromContext(ctx context.Context) Client {
	return ctx.Value(ctxClientKey).(Client)
}

func getHttpHeaderFromOptions(options map[string]string) http.Header {
	header := http.Header{}
	for k, v := range options {
		if strings.HasPrefix(k, "http_") {
			key := strings.TrimPrefix(k, "http_")
			header.Set(key, v)
		}
	}
	return header
}
