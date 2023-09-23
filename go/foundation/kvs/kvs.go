package kvs

import (
	"context"
	"fmt"

	"github.com/yssk22/hpapp/go/foundation/errors"
)

var (
	ErrKeyNotFound = fmt.Errorf("kvs: key not found")
)

type Item struct {
	Key   string
	Value []byte
}

// KVS is an interface to store a key value pairs.
type KVS interface {
	GetMulti(context.Context, ...string) ([][]byte, error)
	SetMulti(context.Context, ...Item) error
}

// Get is a syntax suger to get the value with one key using kvs.GetMulti()
func Get(ctx context.Context, key string, kvs KVS) ([]byte, error) {
	values, err := kvs.GetMulti(ctx, key)
	if err != nil {
		errs, ok := err.(errors.MultiError)
		if ok {
			return nil, errs[0]
		}
		return nil, err
	}
	return values[0], nil
}

// Set is a syntax suger to set the value with one key using kvs.SetMulti()
func Set(ctx context.Context, key string, value []byte, kvs KVS) error {
	err := kvs.SetMulti(ctx, Item{Key: key, Value: value})
	if err != nil {
		errs, ok := err.(errors.MultiError)
		if ok {
			return errs[0]
		}
		return err
	}
	return nil
}

// Waterfall gets the value from the list of KVS storage and returns the first value when found
func Waterfall(ctx context.Context, key string, list ...KVS) ([]byte, error) {
	var value []byte
	var err error
	for _, kvs := range list {
		value, err = Get(ctx, key, kvs)
		if err == nil {
			return value, nil
		}
	}
	return nil, ErrKeyNotFound
}
