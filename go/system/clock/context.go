package clock

import (
	"context"
	"time"

	ccontext "github.com/yssk22/hpapp/go/system/context"
)

type contextNowKey struct{}

var ctxNowKey = contextNowKey{}

func SetNow(ctx context.Context, now time.Time) context.Context {
	return context.WithValue(ctx, ctxNowKey, now)
}

func Reset(ctx context.Context) context.Context {
	return context.WithValue(ctx, ctxNowKey, nil)
}

func Now(ctx context.Context) time.Time {
	v := ctx.Value(ctxNowKey)
	if v == nil {
		return time.Now()
	}
	return v.(time.Time)
}

func ContextTime(ctx context.Context) time.Time {
	return ccontext.GetInstance(ctx).Timestamp
}
