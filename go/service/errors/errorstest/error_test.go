package errorstest

import (
	"context"
	"fmt"
	"testing"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/service/bootstrap/test"
	"github.com/yssk22/hpapp/go/service/errors"
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
