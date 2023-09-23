package devcontainer

import (
	"context"
	"net/http"
	"os"
	"path/filepath"

	"hpapp.yssk22.dev/go/foundation/kvs"
	"hpapp.yssk22.dev/go/system/database"
	"hpapp.yssk22.dev/go/system/environment"
	"hpapp.yssk22.dev/go/system/http/external"
	"hpapp.yssk22.dev/go/system/http/s2s"
	"hpapp.yssk22.dev/go/system/push"
	"hpapp.yssk22.dev/go/system/settings"
	"hpapp.yssk22.dev/go/system/slog"
	"hpapp.yssk22.dev/go/system/storage"
)

type devcontainer struct {
	sqlite3Options   []database.SQLite3Option
	settiingsOptions []settings.JSONFileOption
}

type Option func(*devcontainer)

func WithDatabaseOptions(options ...database.SQLite3Option) Option {
	return func(d *devcontainer) {
		d.sqlite3Options = options
	}
}

func WithSettingsOptions(options ...settings.JSONFileOption) Option {
	return func(d *devcontainer) {
		d.settiingsOptions = options
	}
}

func NewEnvironment(opts ...Option) environment.Environment {
	e := &devcontainer{}
	for _, opt := range opts {
		opt(e)
	}
	return e
}

func NewDefault(opts ...Option) environment.Environment {
	options := []Option{
		WithDatabaseOptions(
			database.WithSQLite3File(database.DatabasePath),
			database.WithSQLite3Mode(database.SQLite3ModeFile),
		),
		WithSettingsOptions(settings.WithPath("./data/settings.json")),
	}
	options = append(options, opts...)
	return NewEnvironment(options...)
}

func (d *devcontainer) LogSink(ctx context.Context) slog.Sink {
	return slog.NewIOSink(os.Stderr, slog.JSONFormatter)
}

func (d *devcontainer) Database(ctx context.Context) *database.Info {
	return &database.Info{
		Name: "sqlite3",
		DB:   database.NewSQLite(d.sqlite3Options...),
	}
}

func (d *devcontainer) Settings(ctx context.Context) kvs.KVS {
	store, err := settings.NewJSONFile(ctx, d.settiingsOptions...)
	if err != nil {
		panic(err)
	}
	return store
}

func (g *devcontainer) PushClient(ctx context.Context) push.Client {
	return push.NewMockClient(ctx)
}

func (g *devcontainer) Storage(ctx context.Context) storage.Storage {
	return storage.NewFileSystem(filepath.Join(".", "data", "storage"), "http://localhost:8080/blob")
}

func (g *devcontainer) HttpClient(ctx context.Context) *http.Client {
	return external.Logger(ctx, http.DefaultClient)
}

func (g *devcontainer) S2SClient(ctx context.Context) s2s.Client {
	return s2s.NewLocalhost("")
}
