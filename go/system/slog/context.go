package slog

import "context"

type contextSinkKey struct{}

var ctxSinkKey = contextSinkKey{}

func SetSink(ctx context.Context, s Sink) context.Context {
	return context.WithValue(ctx, ctxSinkKey, s)
}
