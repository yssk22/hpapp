/*
Package assert provides a simple assertion mechanism for testing.

# Snapshot Assertion

In addition to common Boolean assertions, Nil assertions, and equivalence assertions, you can use snapshot assertions.

Object snapshot testing is a mechanism that simplifies test code by saving the expected data structure as an external file
when testing complex objects (such as ent records).

To use snapshot assersion, write a code as following:

	import (
		"testing"
		"hellproject.app/go/foundation/assert"
	)

	func TestSomething(t *testing.T){
		a := assert.NewTestAssert(t)
		obj := createSomethingComplex()
		a.Snapshot("something", obj)
	}

When executing this test code at first time, it saves the snapshot file `testdata/snapshot.something.json` that is converted `obj` to JSON format.
At the first time of test execution, you should check whether the content of this file matches the expected data.

For the next time after, when `a.Snapshot("something", obj)` is executed, it reads the file `testdata/snapshot.something.json` first, and checks whether it matches `obj`.
If it does not match, the assertion fails. The fail message contains the JSON diff.

# Tips

If the assertion failure message becomes too large, you can delete `testdata/snapshot.something.json` once, run the test to regenerate the snapshot file, and then check the detailed changes in the vscode git diff viewer.

In some cases such as using snapshot test alog with ent records, snapshot file may change every time. In this case, you can avoid assertion failure by specifying fields
that should not be included in the snapshot file for the `assert.Snapshot` function.

	a.Snapshot(
		"obj", obj,
		assert.SnapshotExclude("dynamic_field1"),
		assert.SnapshotExclude("dynamic_field2"),
	)
*/
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
