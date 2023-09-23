package assert

import (
	"fmt"
	"testing"
)

// Reporter is an interface to report assersion failures and quit the logic immediately
type Reporter interface {
	Fail(c *Caller, expect, got, message string)
}

type testingReporter struct {
	t *testing.T
}

func (r *testingReporter) Fail(c *Caller, expect, got, message string) {
	r.t.Fatalf(
		"> %s| %s\n"+
			"\texpect: %s\n"+
			"\tgot: %s",
		fmt.Sprintf("%s:%d", c.SourcePath, c.Line),
		message,
		expect,
		got,
	)
}

// NewTestAssert returns Assert for testing.T
func NewTestAssert(t *testing.T) Assert {
	t.Helper()
	return &assert{
		&testingReporter{t},
	}
}
