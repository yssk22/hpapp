package assert

import (
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
)

// mockReporter captures the arguments of Fail method.
type mockReporter struct {
	hasFailed bool
	caller    *Caller
	expect    string
	got       string
	message   string
}

func (r *mockReporter) Fail(c *Caller, expect, got, message string) {
	r.hasFailed = true
	r.caller = c
	r.expect = expect
	r.got = got
	r.message = message
}

func TestAssert(t *testing.T) {
	t.Run("Fail", func(t *testing.T) {
		r := &mockReporter{}
		a := New(r)
		_, _, line, _ := runtime.Caller(0)
		a.Fail(1, 2, "message")
		if r.expect != "1" {
			t.Errorf("expect: %v, got:%v", 1, r.expect)
		}
		if r.got != "2" {
			t.Errorf("expect: %v, got:%v", 2, r.got)
		}
		if r.message != "message" {
			t.Errorf("expect: %v, got:%v", "message", r.message)
		}
		if !strings.HasSuffix(r.caller.SourcePath, "/assert_test.go") {
			t.Errorf("expect: %v, got:%v", ".../assert_test.go", r.caller.SourcePath)
		}
		if r.caller.Line != line+1 {
			t.Errorf("expect: %v, got:%v", 25, r.caller.Line)
		}
	})

	t.Run("Equals", func(t *testing.T) {
		r := &mockReporter{}
		a := New(r)
		a.Equals(1, 1)
		if r.hasFailed {
			t.Errorf("expect: `not called`, got: `called`")
		}

		r = &mockReporter{}
		a = New(r)
		a.Equals(1, 2)
		if !r.hasFailed {
			t.Errorf("expect: `called`, got: `not called`")
		}
	})

	t.Run("OK", func(tt *testing.T) {
		r := &mockReporter{}
		a := New(r)
		a.OK(true)
		if r.hasFailed {
			t.Errorf("expect: `not called`, got: `called`")
		}

		r = &mockReporter{}
		a = New(r)
		a.OK(false)
		if !r.hasFailed {
			t.Errorf("expect: `called`, got: `not called`")
		}
	})

	t.Run("Nil", func(t *testing.T) {
		r := &mockReporter{}
		a := New(r)
		a.Nil(nil)
		if r.hasFailed {
			t.Errorf("expect: `not called`, got: `called`")
		}

		r = &mockReporter{}
		a = New(r)
		a.Nil(struct{}{})
		if !r.hasFailed {
			t.Errorf("expect: `called`, got: `not called`")
		}
	})

	t.Run("NotNil", func(t *testing.T) {
		r := &mockReporter{}
		a := New(r)
		a.NotNil(struct{}{})
		if r.hasFailed {
			t.Errorf("expect: `not called`, got: `called`")
		}

		r = &mockReporter{}
		a = New(r)
		a.NotNil(nil)
		if !r.hasFailed {
			t.Errorf("expect: `called`, got: `not called`")
		}
	})

	t.Run("Snapshot", func(t *testing.T) {
		const snapshotName = "SnapshotTest"
		var snapshotPath = filepath.Join("testdata", fmt.Sprintf("snapshot.%s.json", snapshotName))
		os.RemoveAll(snapshotPath)
		r := &mockReporter{}
		a := New(r)
		a.Snapshot(snapshotName, "test value")
		if r.hasFailed {
			t.Errorf("expect: `not called`, got: `called`")
		}
		_, err := os.Stat(snapshotPath)
		if err != nil {
			t.Errorf("expect: nil, got: %v", err)
		}

		r = &mockReporter{}
		a = New(r)
		a.Snapshot(snapshotName, "test value")
		if r.hasFailed {
			t.Errorf("expect: `not called`, got: `called`: %s", r.message)
		}

		r = &mockReporter{}
		a = New(r)
		a.Snapshot(snapshotName, "test value2")
		if !r.hasFailed {
			t.Errorf("expect: `called`, got: `not called`")
		}

		t.Run("ExcludeFields Option", func(t *testing.T) {
			type Obj struct {
				Field1        string
				ExcludedField string
			}

			const snapshotName = "SnappshotTest-ExcludeFields"
			var snapshotPath = filepath.Join("testdata", fmt.Sprintf("snapshot.%s.json", snapshotName))
			os.RemoveAll(snapshotPath)
			r := &mockReporter{}
			a := New(r)
			a.Snapshot(snapshotName, &Obj{
				Field1:        "Foo",
				ExcludedField: "Bar",
			}, SnapshotExclude("ExcludedField"))
			if r.hasFailed {
				t.Errorf("expect: `not hasFailed`, got: `hasFailed`")
			}
			_, err := os.Stat(snapshotPath)
			if err != nil {
				t.Errorf("expect: nil, got: %v", err)
			}

			r = &mockReporter{}
			a = New(r)
			a.Snapshot(snapshotName, &Obj{
				Field1:        "Foo",
				ExcludedField: "Bar",
			}, SnapshotExclude("ExcludedField"))
			if r.hasFailed {
				t.Errorf("expect: `not hasFailed`, got: `hasFailed` with %s", r.got)
			}

			r = &mockReporter{}
			a = New(r)
			a.Snapshot(snapshotName, &Obj{
				Field1:        "Foo",
				ExcludedField: "Bar2",
			}, SnapshotExclude("ExcludedField"))
			if r.hasFailed {
				t.Errorf("expect: `not hasFailed`, got: `hasFailed` with %s", r.got)
			}

			r = &mockReporter{}
			a = New(r)
			a.Snapshot(snapshotName, &Obj{
				Field1:        "Foo2",
				ExcludedField: "Bar2",
			}, SnapshotExclude("ExcludedField"))
			if !r.hasFailed {
				t.Errorf("expect: `hasFailed`, got: `not hasFailed`")
			}
		})
	})
}
