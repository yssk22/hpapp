package scraping

import (
	"context"
	"os"
	"testing"

	"github.com/PuerkitoBio/goquery"
	"github.com/yssk22/hpapp/go/foundation/assert"
)

func TestHTML(t *testing.T) {
	a := assert.NewTestAssert(t)
	s := HTML(func(ctx context.Context, doc *goquery.Document, h *HTMLHead) (*HTMLHead, error) {
		return h, nil
	})
	f, err := os.Open("./testdata/sample.html")
	a.Nil(err)
	defer f.Close()
	h, err := s.Scrape(context.Background(), f)
	a.Nil(err)
	a.Equals("The Rock (1996)", h.Title)
	a.Equals("The Rock", h.Meta.Get("og:title"))
}
