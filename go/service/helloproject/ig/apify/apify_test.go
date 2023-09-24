package apify

import (
	"context"
	"os"
	"testing"
	"time"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/timeutil"
	"github.com/yssk22/hpapp/go/service/bootstrap/test"
)

func TestCrawlerArgs(t *testing.T) {
	var timestamp = time.Date(2020, 10, 30, 0, 0, 0, 0, timeutil.JST)

	test.New(
		"ApifyLatest",
		test.WithHPMaster(),
		test.WithContextTime(timestamp),
	).Run(t, func(ctx context.Context, t *testing.T) {
		token := os.Getenv("HPAPP_TEST_APIFY_TOKEN")
		if token == "" {
			t.Skip("environment variable:`HPAPP_TEST_APIFY_TOKEN` is not set")
			return
		}

		t.Run("InstagramScraper", func(t *testing.T) {
			a := assert.NewTestAssert(t)
			args, err := (&apifyLatest{
				token:     token,
				taskName:  "yssk22dev~for-go-test---instagram-scraper",
				actorType: ActorTypeInstagramScraper,
			}).GetCrawlArgs(ctx)
			a.Nil(err)
			a.Snapshot("apify.InstagramScraper", args)
		})

		t.Run("InstagramProfileScraper", func(t *testing.T) {
			a := assert.NewTestAssert(t)
			args, err := (&apifyLatest{
				token:     token,
				taskName:  "yssk22dev~for-go-test---instagram-profile-scraper",
				actorType: ActorTypeInstagramProfileScraper,
			}).GetCrawlArgs(ctx)
			a.Nil(err)
			a.Snapshot("apify.InstagramProfileScraper", args)
		})
	})
}
