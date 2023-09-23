package errors

import (
	"errors"
	"fmt"
)

var (
	ErrUnsupportedOperation = fmt.Errorf("not supported operation")
)

var (
	As     = errors.As
	Is     = errors.Is
	New    = errors.New
	Unwrap = errors.Unwrap
)
