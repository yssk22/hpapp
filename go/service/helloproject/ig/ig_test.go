package ig

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/timeutil"
	"github.com/yssk22/hpapp/go/service/bootstrap/test"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/hpfeeditem"
	"github.com/yssk22/hpapp/go/service/ent/hpigpost"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/helloproject/blob"
	"github.com/yssk22/hpapp/go/service/helloproject/member"
	"github.com/yssk22/hpapp/go/service/schema/jsonfields"
)

func TestIG(t *testing.T) {
	var timestamp = time.Date(2020, 10, 30, 0, 0, 0, 0, timeutil.JST)
	var patterns = []struct {
		Name      string
		Shortcode string
	}{
		// Test Posts
		// from @mizuki_fukumura.official
		{"IGTV", "CAAwnbMn2lH"},
		{"Multi Video", "CFCb2OBnbvH"},
		{"Multi Image", "CGpa_dhnWe3"},
		{"Mixed Media", "CJ6AUhgnQ4W"},
		{"Single Image", "CJqdKvIH6CP"},
		// from @juice_juice_official
		{"Tagging", "CqkWD5wpgH6"},
	}
	for _, pattern := range patterns {
		test.New(pattern.Name,
			test.WithHPMaster(),
			test.WithContextTime(timestamp),
			test.WithNow(timestamp),
		).Run(t, func(ctx context.Context, t *testing.T) {
			s := NewService(blob.NewCrawler(), member.NewSimpleTextMatchingTagger()).(*igService)
			a := assert.NewTestAssert(t)
			f := assert.X(os.Open(filepath.Join("testdata", fmt.Sprintf("args.%s.json", pattern.Shortcode))))
			defer f.Close()
			var args jsonfields.HPIgCrawlArgs
			a.Nil(json.NewDecoder(f).Decode(&args))
			post, err := s.CrawlOne(ctx, &args)
			a.Nil(err)

			// reload with Blob to make sure all fields are set
			p := entutil.NewClient(ctx).HPIgPost.Query().
				WithBlobs().WithAsset().WithOwnerArtist().WithOwnerMember().
				WithTaggedArtists(
					func(q *ent.HPArtistQuery) { q.Order(ent.Asc(hpigpost.FieldID)) },
				).
				WithTaggedMembers(
					func(q *ent.HPMemberQuery) { q.Order(ent.Asc(hpigpost.FieldID)) },
				).
				Where(hpigpost.IDEQ(post.ID)).FirstX(ctx)
			a.Snapshot(pattern.Shortcode, p)
		})
	}
	// integration wit CrawlerTarget
	test.New("latest posts",
		test.WithHPMaster(),
		test.WithContextTime(timestamp),
		test.WithNow(timestamp),
	).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		target := NewTargetFromFile(filepath.Join("testdata", "filetarget.json"))
		s := NewService(blob.NewCrawler(), member.NewSimpleTextMatchingTagger(), WithLatestTarget(target)).(*igService)
		entclient := entutil.NewClient(ctx)
		a.Nil(s.CrawlLatestTask(ctx, nil))
		a.Equals(1, entclient.HPIgPost.Query().CountX(ctx))
		post := entclient.HPIgPost.Query().FirstX(ctx)
		a.Equals("CXdvgAuhK2G", post.Shortcode)
		a.Snapshot("latest-post", post)
		// validate a feed is created.
		feed := entclient.HPFeedItem.Query().WithOwnerArtist().WithOwnerMember().
			WithTaggedArtists(
				func(q *ent.HPArtistQuery) { q.Order(ent.Asc(hpfeeditem.FieldID)) },
			).WithTaggedMembers(
			func(q *ent.HPMemberQuery) { q.Order(ent.Asc(hpfeeditem.FieldID)) },
		).Where(hpfeeditem.SourceIDEQ(post.ID)).FirstX(ctx)

		a.Snapshot("latest-feed", feed)
	})
}
