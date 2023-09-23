package settings

import (
	"context"
	"encoding/json"
	"os"
	"path/filepath"
	"sync"

	"github.com/yssk22/hpapp/go/foundation/kvs"
	"github.com/yssk22/hpapp/go/system/slog"
)

type jsonfile struct {
	path string
	lock sync.Mutex
}

type JSONFileOption func(*jsonfile)

func WithPath(path string) JSONFileOption {
	return func(f *jsonfile) {
		f.path = path
	}
}

// NewJsonFile utilizes a local json file as a KVS for settings
func NewJSONFile(ctx context.Context, opts ...JSONFileOption) (kvs.KVS, error) {
	f := &jsonfile{
		path: "settings.json",
	}
	for _, opt := range opts {
		opt(f)
	}
	return f, nil
}

func (f *jsonfile) GetMulti(ctx context.Context, keys ...string) ([][]byte, error) {
	// always read from a file
	store, err := f.memoryStoreFromFile(ctx)
	if err != nil {
		return nil, err
	}
	return kvs.MemoryStore(store).GetMulti(ctx, keys...)
}

func (f *jsonfile) SetMulti(ctx context.Context, items ...kvs.Item) error {
	f.lock.Lock()
	defer f.lock.Unlock()
	store, err := f.memoryStoreFromFile(ctx)
	if err != nil {
		return err
	}
	err = kvs.MemoryStore(store).SetMulti(ctx, items...)
	if err != nil {
		return slog.LogIfError(ctx, "system.settings.jsonfile", err)
	}
	absPath, err := filepath.Abs(f.path)
	if err != nil {
		return slog.LogIfError(ctx, "system.settings.jsonfile", err)
	}
	dir := filepath.Dir(absPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return slog.LogIfError(ctx, "system.settings.jsonfile", err)
	}
	r, err := os.OpenFile(f.path, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)
	if err != nil {
		return slog.LogIfError(ctx, "system.settings.jsonfile", err)
	}
	defer r.Close()
	enc := json.NewEncoder(r)
	enc.SetIndent("", "  ")
	return enc.Encode(f.toFileFormat(store))
}

func (f *jsonfile) memoryStoreFromFile(ctx context.Context) (map[string][]byte, error) {
	r, err := os.Open(f.path)
	if err != nil {
		if !os.IsNotExist(err) {
			return nil, slog.LogIfError(ctx, "system.settings.jsonfile", err)
		}
		return kvs.MemoryStore(make(map[string][]byte)), nil
	}
	defer r.Close()
	var store = make(map[string]string)
	err = json.NewDecoder(r).Decode(&store)
	if err != nil {
		return nil, slog.LogIfError(ctx, "system.settings.jsonfile", err)
	}
	return f.toMemoryFormat(store), nil
}

func (f *jsonfile) toFileFormat(store map[string][]byte) map[string]string {
	// we want to store the value as a string instead of []byte for json file readability
	var m = make(map[string]string)
	for k, v := range store {
		m[k] = string(v)
	}
	return m
}

func (f *jsonfile) toMemoryFormat(store map[string]string) map[string][]byte {
	var m = make(map[string][]byte)
	for k, v := range store {
		m[k] = []byte(v)
	}
	return m
}
