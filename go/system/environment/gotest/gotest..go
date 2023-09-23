package gotest

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/foundation/kvs"
	"hpapp.yssk22.dev/go/foundation/slice"
	"hpapp.yssk22.dev/go/system/database"
	"hpapp.yssk22.dev/go/system/environment"
	"hpapp.yssk22.dev/go/system/http/external"
	"hpapp.yssk22.dev/go/system/http/s2s"
	"hpapp.yssk22.dev/go/system/push"
	"hpapp.yssk22.dev/go/system/slog"
	"hpapp.yssk22.dev/go/system/storage"
)

type gotest struct {
	id string
}

func NewEnvironment(testID string) environment.Environment {
	return &gotest{
		id: testID,
	}
}

func (g *gotest) LogSink(ctx context.Context) slog.Sink {
	envvalue := os.Getenv("ENABLE_LOGGING")
	if envvalue != "" {
		sink := slog.NewIOSink(os.Stderr, slog.JSONFormatter)
		if envvalue == "1" {
			return sink
		}
		events := assert.X(slice.Map(strings.Split(envvalue, ","), func(i int, s string) (string, error) {
			return strings.TrimSpace(s), nil
		}))
		return slog.NewEventFilter(events, sink)
	}
	return slog.NewNullSink()
}

func (g *gotest) Database(ctx context.Context) *database.Info {
	// each environment should use the different file name to isolate tests.
	return &database.Info{
		Name: "sqlite3",
		DB: database.NewSQLite(
			database.WithSQLite3Mode(database.SQLite3ModeMemory),
			database.WithSQLite3File(fmt.Sprintf("sqlite3test[%s].db", g.id)),
		),
	}
}

func (g *gotest) Settings(ctx context.Context) kvs.KVS {
	return kvs.NewMemoryStore() // always use a new memory space per a context
}

func (g *gotest) PushClient(ctx context.Context) push.Client {
	return push.NewMockClient(ctx)
}

func (g *gotest) Storage(ctx context.Context) storage.Storage {
	return storage.NewFileSystem(filepath.Join("testdata", "storage"), "http://localhost:8080/blob")
}

func (g *gotest) HttpClient(ctx context.Context) *http.Client {
	return external.Logger(
		ctx,
		external.Snapshot(
			filepath.Join("testdata", "httpsnapshot"),
			http.DefaultClient,
		),
	)
}

func (g *gotest) S2SClient(ctx context.Context) s2s.Client {
	return s2s.NewMockClient()
}
