package v3

import (
	"context"
)

type Misc struct {
}

func (*Misc) Version(ctx context.Context) (string, error) {
	return "v3.0.0", nil
}
