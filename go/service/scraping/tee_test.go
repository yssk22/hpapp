package scraping

import (
	"context"
	"os"
	"testing"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/service/bootstrap/test"
)

func TestTee(t *testing.T) {
	test.New("Storage").Run(t, func(ctx context.Context, t *testing.T) {
		type Foo struct {
			Field1 string `json:"field1"`
		}

		a := assert.NewTestAssert(t)
		inner := JSON[Foo]()
		r, err := os.Open("./testdata/sample.json")
		a.Nil(err)
		defer r.Close()
		a.Nil(os.RemoveAll("./testdata/storage/tee-copy.json"))

		s := assert.X(NewStorageTeeScraper("tee-copy.json", inner))
		obj, err := s.Scrape(ctx, r)
		a.Nil(err)
		a.Equals("value", obj.Field1)

		// w also has the same content
		rcopy, err := os.Open("./testdata/storage/tee-copy.json")
		a.Nil(err)
		defer rcopy.Close()
		copy, err := inner.Scrape(ctx, rcopy)
		a.Nil(err)
		a.Equals("value", copy.Field1)
	})
}
