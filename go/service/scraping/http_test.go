package scraping

import (
	"context"
	"io"
	"io/ioutil"
	"testing"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/service/bootstrap/test"
)

func TestHTTP(t *testing.T) {
	test.New("example.com").Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		fetcher := NewHTTPFetcher(ctx, "http://example.com/")
		r, err := fetcher.Fetch(ctx)
		a.Nil(err)
		defer r.(io.Closer).Close()
		buff, err := ioutil.ReadAll(r)
		a.Nil(err)
		a.OK(len(buff) > 0)
	})
}
