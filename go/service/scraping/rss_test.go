package scraping

import (
	"context"
	"os"
	"testing"
	"time"

	"github.com/yssk22/hpapp/go/foundation/assert"
)

func TestRSS2(t *testing.T) {
	a := assert.NewTestAssert(t)
	s := RSS2(func(ctx context.Context, rss2 *RSS2Doc) (*RSS2Doc, error) {
		return rss2, nil
	})
	f, err := os.Open("./testdata/sample.rss2.xml")
	a.Nil(err)
	defer f.Close()
	feed, err := s.Scrape(context.Background(), f)
	a.Nil(err)
	a.NotNil(feed.Channel)
	a.Equals("Liftoff News", feed.Channel.Title)
	a.Equals("http://liftoff.msfc.nasa.gov/", feed.Channel.Link)
	a.Equals("Liftoff to Space Exploration.", feed.Channel.Description)
	a.Equals(time.Date(2003, 6, 10, 9, 41, 1, 0, time.FixedZone("GMT", 0)), time.Time(feed.Channel.LastBuildDate))
	a.Equals(4, len(feed.Channel.Items))
}
