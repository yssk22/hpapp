package kvs

import (
	"context"

	"hpapp.yssk22.dev/go/foundation/slice"
)

// MemmoryStore is a simple in-memory key-value store.
type MemoryStore map[string][]byte

func (s MemoryStore) GetMulti(ctx context.Context, keys ...string) ([][]byte, error) {
	return slice.Map(keys, func(_ int, key string) ([]byte, error) {
		v, ok := s[key]
		if !ok {
			return nil, ErrKeyNotFound
		}
		return v, nil
	})
}

func (s MemoryStore) SetMulti(ctx context.Context, items ...Item) error {
	_, err := slice.MapPtr(items, func(_ int, v *Item) (any, error) {
		s[v.Key] = v.Value
		return nil, nil
	})
	return err
}

func NewMemoryStore() KVS {
	return MemoryStore(make(map[string][]byte))
}
