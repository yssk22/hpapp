package kvs

import (
	"context"
	"testing"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/errors"
)

func TestMemory(t *testing.T) {
	ctx := context.Background()
	a := assert.NewTestAssert(t)
	m := NewMemoryStore()
	err := m.SetMulti(ctx, []Item{
		{
			Key:   "foo1",
			Value: []byte("bar1"),
		},
		{
			Key:   "foo2",
			Value: []byte("bar2"),
		},
	}...)
	a.Nil(err)

	values, err := m.GetMulti(ctx, "foo1", "foo3")
	a.NotNil(err)
	err = err.(errors.MultiError).Get(1)
	a.Equals(ErrKeyNotFound, err)
	a.Equals("bar1", string(values[0]))
}
