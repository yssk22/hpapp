package object

import (
	"testing"
	"time"

	"github.com/yssk22/hpapp/go/foundation/assert"
)

func TestEqual(t *testing.T) {
	a := assert.NewTestAssert(t)
	a.OK(Equal(1, 1))
	a.OK(!Equal(1, 2))

	// for time.Time, t1 and t2 is the same time but have a different *time.Location object so
	// t1 == t2 should return false so it is recommended to use `t1.Equal(t2)`
	// Compare(t1, t2) should returns as same
	t1 := time.Date(1996, 10, 30, 1, 2, 3, 4, time.FixedZone("JST", 9*60*60))
	t2 := time.Date(1996, 10, 30, 1, 2, 3, 4, time.FixedZone("JST", 9*60*60))
	a.OK(t1 != t2)
	a.Equals(t1, t2)
	a.OK(t1.Equal(t2))
	a.OK(Equal(t1, t2))
}
