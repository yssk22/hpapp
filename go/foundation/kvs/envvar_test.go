package kvs

import (
	"context"
	"testing"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/errors"
)

func TestEnvvar(t *testing.T) {
	t.Run("Get", func(tt *testing.T) {
		ctx := context.Background()
		a := assert.NewTestAssert(t)
		s := Envvar(ctx)
		_, err := s.GetMulti(ctx, "foo")
		a.Equals(ErrKeyNotFound, err.(errors.MultiError).Get(0))

		tt.Setenv("FOO", "hogehoge")
		value, err := s.GetMulti(ctx, "foo")
		a.Nil(err)
		a.Equals("hogehoge", string(value[0]))
	})

	t.Run("Set", func(tt *testing.T) {
		ctx := context.Background()
		a := assert.NewTestAssert(t)
		s := Envvar(ctx)
		err := s.SetMulti(ctx, Item{
			Key:   "foo",
			Value: []byte("bar"),
		})
		a.Equals(errors.ErrUnsupportedOperation, err)
	})
}
