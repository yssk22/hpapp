package clock

import (
	"context"
	"testing"
	"time"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/foundation/timeutil"

	ccontext "hpapp.yssk22.dev/go/system/context"
)

func TestContext(t *testing.T) {
	a := assert.NewTestAssert(t)
	ctx := context.Background()
	now := time.Date(1996, 10, 30, 0, 0, 0, 0, timeutil.JST)
	ctx = SetNow(ctx, now)
	a.Equals(Now(ctx), now)

	ctx = Reset(ctx)
	a.OK(now != Now(ctx))
}

func BenchmarkNow(b *testing.B) {
	ctx := context.Background()
	for i := 0; i < b.N; i++ {
		Now(ctx)
	}
}

func BenchmarkContextTime(b *testing.B) {
	ctx := ccontext.WithContext(
		context.Background(),
	)
	for i := 0; i < b.N; i++ {
		ContextTime(ctx)
	}
}
