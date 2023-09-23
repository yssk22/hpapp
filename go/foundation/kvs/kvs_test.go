package kvs

import (
	"context"
	"testing"

	"hpapp.yssk22.dev/go/foundation/assert"
)

func TestKVS(t *testing.T) {
	t.Run("Waterfall", func(t *testing.T) {
		a := assert.NewTestAssert(t)
		ctx := context.Background()
		s1 := NewMemoryStore()
		s2 := NewMemoryStore()

		a.Nil(Set(ctx, "foo", []byte("bar"), s1))
		a.Nil(Set(ctx, "foo", []byte("baz"), s2))
		a.Nil(Set(ctx, "hoge", []byte("fuga"), s2))

		value, err := Waterfall(ctx, "foo", s1, s2)
		a.Nil(err)
		a.Equals("bar", string(value))

		value, err = Waterfall(ctx, "foo", s2, s1)
		a.Nil(err)
		a.Equals("baz", string(value))

		value, err = Waterfall(ctx, "hoge", s1, s2)
		a.Nil(err)
		a.Equals("fuga", string(value))

		_, err = Waterfall(ctx, "piyo", s1, s2)
		a.Equals(ErrKeyNotFound, err)

	})
}
