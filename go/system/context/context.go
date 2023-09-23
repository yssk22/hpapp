package context

import (
	"context"
	"time"
)

var (
	WithValue   = context.WithValue
	WithTimeout = context.WithTimeout
	WithCancel  = context.WithCancel
)

type Context context.Context

type Instance struct {
	ID         string                 `json:"id"`
	Timestamp  time.Time              `json:"timestamp"`
	Attributes map[string]interface{} `json:"attributes,omitempty"`
}

type contextInstanceKey struct{}

var ctxInstanceKey = contextInstanceKey{}

func GetInstance(ctx context.Context) *Instance {
	v, ok := ctx.Value(ctxInstanceKey).(*Instance)
	if !ok {
		return nil
	}
	return v
}

// SetAttribute sets a key value pair on the current context. These values are recorded via slog.
// Note that this function doesn't support concurrent access by multiple goroutines
func SetAttribute(ctx context.Context, name string, value interface{}) {
	v, ok := ctx.Value(ctxInstanceKey).(*Instance)
	if !ok {
		return
	}
	v.Attributes[name] = value
}

func setInstasnce(ctx context.Context, i *Instance) context.Context {
	return context.WithValue(ctx, ctxInstanceKey, i)
}

type Option func(*Instance)

func Timestamp(t time.Time) Option {
	return func(i *Instance) {
		i.Timestamp = t
	}
}

func ID(id string) Option {
	return func(i *Instance) {
		i.ID = id
	}
}

func WithContext(ctx context.Context, opts ...Option) context.Context {
	i := &Instance{
		ID:         "TBD",
		Timestamp:  time.Now(), //nolint:gocritic // always use the actual system clock as it can be overwriten by option.
		Attributes: make(map[string]interface{}),
	}
	for _, opt := range opts {
		opt(i)
	}
	ctx = setInstasnce(ctx, i)
	return ctx
}
