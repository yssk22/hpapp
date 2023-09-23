package settings

import (
	"context"
	"os"
	"testing"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/foundation/kvs"
)

func TestJSONFile(t *testing.T) {
	const jsonPath = "testdata/settings.json"
	ctx := context.Background()
	a := assert.NewTestAssert(t)
	a.Nil(os.RemoveAll(jsonPath))
	defer os.RemoveAll(jsonPath)

	store, err := NewJSONFile(ctx, WithPath(jsonPath))
	a.Nil(err)
	_, err = kvs.Get(ctx, "foo", store)
	a.Equals(kvs.ErrKeyNotFound, err)

	// when set, it creates a json file
	err = kvs.Set(ctx, "foo", []byte("bar"), store)
	a.Nil(err)
	_, err = os.Stat(jsonPath)
	a.Nil(err)

	value, err := kvs.Get(ctx, "foo", store)
	a.Nil(err)
	a.Equals([]byte("bar"), value)
}
