// package environment provides a way to access environment dependent resources
package environment

import (
	"context"
	"net/http"

	"github.com/yssk22/hpapp/go/foundation/kvs"
	ccontext "github.com/yssk22/hpapp/go/system/context"
	"github.com/yssk22/hpapp/go/system/database"
	"github.com/yssk22/hpapp/go/system/http/external"
	"github.com/yssk22/hpapp/go/system/http/s2s"
	"github.com/yssk22/hpapp/go/system/push"
	"github.com/yssk22/hpapp/go/system/settings"
	"github.com/yssk22/hpapp/go/system/slog"
	"github.com/yssk22/hpapp/go/system/storage"
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
