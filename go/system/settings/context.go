package settings

import (
	"context"

	"hpapp.yssk22.dev/go/foundation/kvs"
)

type contextKvsKey struct{}

var ctxKvsKey = contextKvsKey{}

func SetSettingsStore(ctx context.Context, store kvs.KVS) context.Context {
	return context.WithValue(ctx, ctxKvsKey, store)
}

func GetX[T any](ctx context.Context, item Item[T]) T {
	return getXFromKVS(ctx, item, getSettingsStore(ctx))
}

func Get[T any](ctx context.Context, item Item[T]) (T, error) {
	return getFromKVS(ctx, item, getSettingsStore(ctx))
}

func Set[T any](ctx context.Context, item Item[T], value T) error {
	return setOnKVS(ctx, item, value, getSettingsStore(ctx))
}

func getSettingsStore(ctx context.Context) kvs.KVS {
	store := ctx.Value(ctxKvsKey)
	if store != nil {
		return store.(kvs.KVS)
	}
	return kvs.Envvar(ctx)
}

func getXFromKVS[T any](ctx context.Context, item Item[T], store kvs.KVS) T {
	v, err := getFromKVS(ctx, item, store)
	if err != nil {
		if err != kvs.ErrKeyNotFound {
			panic(err)
		}
		return item.Default()
	}
	return v
}

func getFromKVS[T any](ctx context.Context, item Item[T], store kvs.KVS) (T, error) {
	v, err := kvs.Get(ctx, item.Key(), store)
	if err != nil {
		if err != kvs.ErrKeyNotFound {
			var z T
			return z, err
		}
		return item.Default(), kvs.ErrKeyNotFound
	}
	return item.FromBytes(v)
}

func setOnKVS[T any](ctx context.Context, item Item[T], value T, store kvs.KVS) error {
	v := item.ToBytes(value)
	return kvs.Set(ctx, item.Key(), v, store)
}
