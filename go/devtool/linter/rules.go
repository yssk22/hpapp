//go:build ruleguard
// +build ruleguard

// nolint
package linter

import (
	"github.com/quasilyte/go-ruleguard/dsl"
)

func importLogUse(m dsl.Matcher) {

	m.Import("log")
	m.Match(`log.$x`).
		Where(!m.File().PkgPath.Matches("hpapp.yssk22.dev/go/system/slog")).
		Report("use hpapp.yssk22.dev/go/system/slog package instead or remove it")
}

func timeNowUse(m dsl.Matcher) {
	m.Import("time")
	m.Match(`time.Now()`).
		Where(!m.File().PkgPath.Matches("hpapp.yssk22.dev/go/system/clock")).
		Report("use clock.Now(ctx) package instead")
}
