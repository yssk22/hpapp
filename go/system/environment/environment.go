// package environment provides a way to access environment dependent resources
package environment

import (
	"context"
	"net/http"

	"hpapp.yssk22.dev/go/foundation/kvs"
	ccontext "hpapp.yssk22.dev/go/system/context"
	"hpapp.yssk22.dev/go/system/database"
	"hpapp.yssk22.dev/go/system/http/external"
	"hpapp.yssk22.dev/go/system/http/s2s"
	"hpapp.yssk22.dev/go/system/push"
	"hpapp.yssk22.dev/go/system/settings"
	"hpapp.yssk22.dev/go/system/slog"
	"hpapp.yssk22.dev/go/system/storage"
)

// Environment is an interface that provides a set of resources that can be used to bootstrap a context.Context
type Environment interface {
	LogSink(context.Context) slog.Sink
	PushClient(context.Context) push.Client
	Database(context.Context) *database.Info
	Settings(context.Context) kvs.KVS
	Storage(context.Context) storage.Storage
	HttpClient(context.Context) *http.Client
	S2SClient(context.Context) s2s.Client
}

func WithContext(ctx context.Context, e Environment, options ...ccontext.Option) context.Context {
	ctx = ccontext.WithContext(ctx, options...)
	ctx = slog.SetSink(ctx, e.LogSink(ctx))
	db := e.Database(ctx)
	ctx = database.SetDatabase(ctx, db.Name, db.DB)
	ctx = settings.SetSettingsStore(ctx, e.Settings(ctx))
	ctx = storage.WithStorage(ctx, e.Storage(ctx))
	ctx = external.WithHttpClient(ctx, e.HttpClient(ctx))
	ctx = s2s.WithClient(ctx, e.S2SClient(ctx))
	ctx = push.WithClient(ctx, e.PushClient(ctx))
	return ctx
}
