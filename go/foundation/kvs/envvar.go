package kvs

import (
	"context"
	"os"
	"strings"

	"hpapp.yssk22.dev/go/foundation/errors"
	"hpapp.yssk22.dev/go/foundation/slice"
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
