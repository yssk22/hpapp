package errors

import (
	"fmt"
)

// MultiError is a slice of error
type MultiError []error

// Error implemnts error.Error()
func (me MultiError) Error() string {
	var firstError error
	var errorCount int
	for _, e := range me {
		if e != nil {
			if firstError == nil {
				firstError = e
			}
			errorCount++
		}
	}
	switch errorCount {
	case 0:
		return ""
	case 1:
		return firstError.Error()
	}
	return fmt.Sprintf("%s (and %d other errors)", firstError.Error(), errorCount-1)
}

// Get returns an error at the index `i`
func (me MultiError) Get(i int) error {
	return me[i]
}

// HasError returns if there is an error in the errors.
func (me MultiError) HasError() bool {
	for _, e := range me {
		if e != nil {
			return true
		}
	}
	return false
}

// ToReturn returns itself if MultiError has an error, otherwise nil
func (me MultiError) ToReturn() error {
	if me.HasError() {
		return me
	}
	return nil
}

func IsMultiError(err error) bool {
	_, ok := err.(MultiError)
	return ok
}
