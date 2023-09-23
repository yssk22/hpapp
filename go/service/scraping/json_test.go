package scraping

import (
	"os"
	"testing"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"golang.org/x/net/context"
)

func TestJSON(t *testing.T) {
	type Foo struct {
		Field1 string `json:"field1"`
	}

	a := assert.NewTestAssert(t)
	s := JSON[Foo]()
	f, err := os.Open("./testdata/sample.json")
	a.Nil(err)
	defer f.Close()
	obj, err := s.Scrape(context.Background(), f)
	a.Nil(err)
	a.Equals("value", obj.Field1)
}
