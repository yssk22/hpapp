package devtool

import (
	"testing"

	"hpapp.yssk22.dev/go/foundation/assert"
)

func TestParseFullQualifiedName(t *testing.T) {
	a := assert.NewTestAssert(t)
	pkg, name := ParseFullQualifiedName("hpapp.yssk22.dev/go/foundation/assert.Foo")
	a.Equals("hpapp.yssk22.dev/go/foundation/assert", pkg)
	a.Equals("Foo", name)

	pkg, name = ParseFullQualifiedName("hpapp.yssk22.dev/go/foundation/assert")
	a.Equals("hpapp.yssk22.dev/go/foundation/assert", pkg)
	a.Equals("", name)

	pkg, name = ParseFullQualifiedName("Foo")
	a.Equals("", pkg)
	a.Equals("Foo", name)

	pkg, name = ParseFullQualifiedName("a.b.c.Foo")
	a.Equals("a.b.c", pkg)
	a.Equals("Foo", name)

}
