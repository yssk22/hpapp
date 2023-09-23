package devtool

import (
	"testing"

	"github.com/yssk22/hpapp/go/foundation/assert"
)

func TestParseFullQualifiedName(t *testing.T) {
	a := assert.NewTestAssert(t)
	pkg, name := ParseFullQualifiedName("github.com/yssk22/hpapp/go/foundation/assert.Foo")
	a.Equals("github.com/yssk22/hpapp/go/foundation/assert", pkg)
	a.Equals("Foo", name)

	pkg, name = ParseFullQualifiedName("github.com/yssk22/hpapp/go/foundation/assert")
	a.Equals("github.com/yssk22/hpapp/go/foundation/assert", pkg)
	a.Equals("", name)

	pkg, name = ParseFullQualifiedName("Foo")
	a.Equals("", pkg)
	a.Equals("Foo", name)

	pkg, name = ParseFullQualifiedName("a.b.c.Foo")
	a.Equals("a.b.c", pkg)
	a.Equals("Foo", name)

}
