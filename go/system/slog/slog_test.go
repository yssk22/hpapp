package slog

import (
	"bytes"
	"context"
	"encoding/json"
	"strings"
	"testing"
	"time"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/foundation/timeutil"
	"hpapp.yssk22.dev/go/system/clock"
	ccontext "hpapp.yssk22.dev/go/system/context"
)

func TestSlog(t *testing.T) {
	t.Run("context integration", func(t *testing.T) {
		a := assert.NewTestAssert(t)

		ctx := ccontext.WithContext(context.Background())
		ccontext.SetAttribute(ctx, "foo", "bar")
		var buff bytes.Buffer
		s := NewIOSink(&buff, JSONLFormatter)
		ctx = SetSink(ctx, s)
		Info(ctx, "test1", Attribute("foo1", "bar1"))
		written := buff.String()
		lines := strings.Split(written, "\n")
		var r Record
		a.Nil(json.Unmarshal([]byte(lines[0]), &r))
		// excludes
		//   - source_line as it may change if we modify this file
		//   - source_path as it can be different between Github Actions and local environment
		a.Snapshot(
			"context-integration", r,
			assert.SnapshotExclude("source_line"),
			assert.SnapshotExclude("source_path"),
			assert.SnapshotExclude("timestamp"),
		)
	})

	t.Run("IO with JSONP", func(t *testing.T) {
		now := time.Date(1996, 10, 30, 0, 0, 0, 0, timeutil.JST)
		ctx := context.Background()
		ctx = clock.SetNow(ctx, now)
		a := assert.NewTestAssert(t)

		var buff bytes.Buffer
		s := NewIOSink(&buff, JSONLFormatter)
		ctx = SetSink(ctx, s)
		Info(ctx, "test1", Attribute("foo1", "bar1"))
		Info(ctx, "test2", Attribute("foo2", "bar2"))
		written := buff.String()
		lines := strings.Split(written, "\n")
		a.Equals(3, len(lines))
		var r Record
		var err error
		err = json.Unmarshal([]byte(lines[0]), &r)
		a.Nil(err)
		// excludes
		//   - source_line as it may change if we modify this file
		//   - source_path as it can be different between Github Actions and local environment
		a.Snapshot(
			"firstline", r,
			assert.SnapshotExclude("source_line"),
			assert.SnapshotExclude("source_path"),
		)

		err = json.Unmarshal([]byte(lines[1]), &r)
		a.Nil(err)
		a.Snapshot(
			"secondline", r,
			assert.SnapshotExclude("source_line"),
			assert.SnapshotExclude("source_path"),
		)
	})
}
