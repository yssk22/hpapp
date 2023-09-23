package errorstest

import (
	"context"
	"fmt"
	"testing"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/service/bootstrap/test"
	"hpapp.yssk22.dev/go/service/errors"
)

func TestServiceError(t *testing.T) {
	test.New("New").Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		err := errors.New("message")
		a.Equals("message", err.Error())
	})

	test.New("Wrap").Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		err := errors.Wrap(ctx, fmt.Errorf("foo"))
		a.Equals("internal service error", err.Error())
	})

}
