package settings

import (
	"context"
	"testing"
	"time"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/foundation/kvs"
)

func TestString(t *testing.T) {
	a := assert.NewTestAssert(t)
	s := kvs.NewMemoryStore()
	item := NewString("foo", "default_foo")
	ctx := context.Background()
	ctx = SetSettingsStore(ctx, s)
	value, err := Get(ctx, item)
	a.Equals(kvs.ErrKeyNotFound, err)
	a.Equals("default_foo", value)

	err = Set(ctx, item, "value")
	a.Nil(err)
	value, err = Get(ctx, item)
	a.Nil(err)
	a.Equals("value", value)
}

func TestInt(t *testing.T) {
	a := assert.NewTestAssert(t)
	s := kvs.NewMemoryStore()
	item := NewInt("foo", 2)
	ctx := context.Background()
	ctx = SetSettingsStore(ctx, s)
	value, err := Get(ctx, item)
	a.Equals(kvs.ErrKeyNotFound, err)
	a.Equals(2, value)

	err = Set(ctx, item, 20)
	a.Nil(err)
	value, err = Get(ctx, item)
	a.Nil(err)
	a.Equals(20, value)
}

func TestDuration(t *testing.T) {
	a := assert.NewTestAssert(t)
	s := kvs.NewMemoryStore()
	item := NewDuration("foo", 2*time.Hour)
	ctx := context.Background()
	ctx = SetSettingsStore(ctx, s)
	value, err := Get(ctx, item)
	a.Equals(kvs.ErrKeyNotFound, err)
	a.Equals(2*time.Hour, value)

	err = Set(ctx, item, 20*time.Minute)
	a.Nil(err)
	value, err = Get(ctx, item)
	a.Nil(err)
	a.Equals(20*time.Minute, value)
}
