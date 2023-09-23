package kvs

import (
	"context"
	"os"
	"strings"

	"github.com/yssk22/hpapp/go/foundation/errors"
	"github.com/yssk22/hpapp/go/foundation/slice"
)

// Evvar returns KVS interface to read the environment variables
func Envvar(context.Context) KVS {
	return &settingsEnvvar{}
}

type settingsEnvvar struct {
}

func (s *settingsEnvvar) GetMulti(ctx context.Context, keys ...string) ([][]byte, error) {
	return slice.Map(keys, func(_ int, key string) ([]byte, error) {
		v, ok := os.LookupEnv(strings.ToUpper(key))
		if !ok {
			return nil, ErrKeyNotFound
		}
		return []byte(v), nil
	})
}

func (s *settingsEnvvar) SetMulti(ctx context.Context, items ...Item) error {
	return errors.ErrUnsupportedOperation
}
