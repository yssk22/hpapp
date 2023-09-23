package settings

import (
	"context"
	"fmt"

	gcpdatastore "cloud.google.com/go/datastore"
	"github.com/yssk22/hpapp/go/foundation/errors"
	"github.com/yssk22/hpapp/go/foundation/kvs"
	"github.com/yssk22/hpapp/go/foundation/slice"
)

type datastore struct {
	client *gcpdatastore.Client
	kind   string
}

type DatastoreOption func(*datastore)

func WithKind(kind string) DatastoreOption {
	return func(ds *datastore) {
		ds.kind = kind
	}
}

type value struct {
	Value string `datastore:"value"`
}

// NewDatastore utilizes a Google Cloud Datastore as a KVS for settings
func NewDatastore(ctx context.Context, projectID string, opts ...DatastoreOption) (kvs.KVS, error) {
	client, err := gcpdatastore.NewClient(ctx, projectID)
	if err != nil {
		return nil, err
	}
	ds := &datastore{
		client: client,
		kind:   "Settings",
	}
	for _, opt := range opts {
		opt(ds)
	}
	return ds, nil
}

func (ds *datastore) GetMulti(ctx context.Context, keys ...string) ([][]byte, error) {
	dsKeys, _ := slice.Map(keys, func(_ int, key string) (*gcpdatastore.Key, error) {
		return gcpdatastore.NameKey(ds.kind, key, nil), nil
	})
	var dst = make([]*value, len(dsKeys))
	var errs []error
	var ok bool
	err := ds.client.GetMulti(ctx, dsKeys, dst)
	if err != nil {
		if errs, ok = err.(gcpdatastore.MultiError); !ok {
			return nil, err
		}
	}
	return slice.Map(dst, func(i int, v *value) ([]byte, error) {
		if v != nil {
			return []byte(v.Value), nil
		}
		if err := errs[i]; err != nil {
			if err == gcpdatastore.ErrNoSuchEntity {
				return nil, kvs.ErrKeyNotFound
			}
			return nil, err
		}
		return nil, fmt.Errorf("uknnown error: both value and err are nil")
	})
}

func (ds *datastore) SetMulti(ctx context.Context, items ...kvs.Item) error {
	dsKeys, _ := slice.Map(items, func(i int, v kvs.Item) (*gcpdatastore.Key, error) {
		return gcpdatastore.NameKey(ds.kind, v.Key, nil), nil
	})

	values, _ := slice.Map(items, func(i int, v kvs.Item) (*value, error) {
		return &value{
			Value: string(v.Value),
		}, nil
	})
	_, err := ds.client.PutMulti(ctx, dsKeys, values)
	if err != nil {
		if errs, ok := err.(gcpdatastore.MultiError); ok {
			return errors.MultiError(errs)
		}
		return err
	}
	return nil
}
