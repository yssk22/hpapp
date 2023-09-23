package assert

import (
	"fmt"
	"path/filepath"
	"reflect"
	"runtime"
	"time"
)

type Assert interface {
	// TODO: OSS - use [T interface{}]
	// TODO: OSS - rename
	// Equals checks the equality of two values.
	Equals(expect interface{}, got interface{}, messages ...interface{})
	// OK checks the boolean value is true.
	OK(v bool, messages ...interface{})
	// Nil checks if the value is nil.
	Nil(v interface{}, messages ...interface{})
	// NotNil checks if the value is not nil.
	NotNil(v interface{}, messages ...interface{})
	// Fail fails the assersion
	Fail(expect interface{}, got interface{}, messages ...interface{})
	// Snapshot compares the value with the snapshot file. If the snapshot file does not exist, it will be created.
	Snapshot(name string, v interface{}, options ...SnapshotOption)
}

type assert struct {
	r Reporter
}

// Caller is an object contains source path and line for the assersion caller.
type Caller struct {
	SourcePath string
	Line       int
}

// New returns Assert with Reporter
func New(r Reporter) Assert {
	return &assert{r}
}

func (a *assert) Fail(expect interface{}, got interface{}, messages ...interface{}) {
	var caller *Caller
	var i = 0
	for {
		_, sourcePath, line, ok := runtime.Caller(i)
		if !ok {
			break
		}
		if sourcePath != assertFilePath {
			caller = &Caller{
				SourcePath: sourcePath,
				Line:       line,
			}
			break
		}
		i++
		if i > 1000 {
			break
		}
	}
	if caller == nil {
		caller = &Caller{
			SourcePath: "unknown",
			Line:       0,
		}
	}
	if len(messages) > 0 {
		a.r.Fail(caller, fmt.Sprintf("%v", expect), fmt.Sprintf("%v", got), fmt.Sprintf(fmt.Sprintf("%v", messages[0]), messages[1:]...))
	} else {
		a.r.Fail(caller, fmt.Sprintf("%v", expect), fmt.Sprintf("%v", got), "")
	}
}

func (a *assert) Equals(expect interface{}, got interface{}, messages ...interface{}) {
	if t, ok := expect.(time.Time); ok {
		if tt, ok := got.(time.Time); ok && t.Equal(tt) {
			return
		}
		a.Fail(expect, got, messages...)
		return
	}
	if reflect.DeepEqual(expect, got) {
		return
	}
	a.Fail(expect, got, messages...)
}

func (a *assert) OK(v bool, messages ...interface{}) {
	if v {
		return
	}
	a.Fail("true", "false", messages...)
}

func (a *assert) Nil(v interface{}, messages ...interface{}) {
	if a.isNil(v) {
		return
	}
	a.Fail("<nil>", v, messages...)
}

func (a *assert) NotNil(v interface{}, messages ...interface{}) {
	if !a.isNil(v) {
		return
	}
	a.Fail("<not-nil>", v, messages...)
}

func (a *assert) Snapshot(name string, v interface{}, options ...SnapshotOption) {
	snapshotPath := filepath.Join("testdata", fmt.Sprintf("snapshot.%s.json", name))
	err := generateSnapshotOrCompare(snapshotPath, v, options...)
	a.Nil(err, fmt.Sprintf("snapshot(%s) failed", snapshotPath))
}

func (a *assert) isNil(v interface{}) bool {
	if v == nil {
		return true
	}
	val := reflect.ValueOf(v)
	switch val.Kind() {
	case reflect.Interface, reflect.Map, reflect.Ptr, reflect.Slice:
		if val.IsNil() {
			return true
		}
	}
	return false
}

var assertFilePath string

func init() {
	_, assertFilePath, _, _ = runtime.Caller(0)
}

// X asserts the error is nil and returns the value. if not nil, it panics.
func X[T any](v T, err error) T {
	if err != nil {
		panic(err)
	}
	return v
}

// Nil asserts the error is nil.
func Nil(err error) {
	if err != nil {
		panic(err)
	}
}
