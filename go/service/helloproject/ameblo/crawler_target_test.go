package ameblo

import (
	"context"
	"testing"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/foundation/slice"
	"hpapp.yssk22.dev/go/service/bootstrap/test"
	"hpapp.yssk22.dev/go/service/ent"
	"hpapp.yssk22.dev/go/service/ent/hpameblopost"
	"hpapp.yssk22.dev/go/service/entutil"
	"hpapp.yssk22.dev/go/system/clock"
)

func TestTarget(t *testing.T) {
	test.New("RSS", test.WithHPMaster()).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		rss := &targetRssFromAsset{
			assetKeys:                   []string{"morningmusume-9ki", "morningmusume-10ki"},
			excludeAssetKeys:            []string{},
			excludeUrlsIfAlreadyCrawled: false,
		}
		urls, err := rss.GetUrls(ctx)
		a.Nil(err)
		a.Snapshot("target.rss", urls)

		t.Run("excludeAssetKeys", func(t *testing.T) {
			a := assert.NewTestAssert(t)
			rss := &targetRssFromAsset{
				assetKeys:                   []string{"morningmusume-9ki", "morningmusume-10ki"},
				excludeAssetKeys:            []string{"morningmusume-10ki"},
				excludeUrlsIfAlreadyCrawled: false,
			}
			urls, err := rss.GetUrls(ctx)
			a.Nil(err)
			a.Snapshot("target-9ki-only.rss", urls)

			t.Run("excludeUrlsIfAlreadyCrawled", func(t *testing.T) {
				a := assert.NewTestAssert(t)
				entclient := entutil.NewClient(ctx)
				creates := assert.X(slice.Map(urls, func(i int, url string) (*ent.HPAmebloPostCreate, error) {
					return entclient.HPAmebloPost.Create().
						SetPath(urlToPath(url)).
						SetArtistKey("morningmusume").
						SetMemberKey("mizuki_fukumura").
						SetTitle("dummy").
						SetDescription("dummy").
						SetPostAt(clock.ContextTime(ctx)).
						SetSource(hpameblopost.SourceRss), nil
				}))
				entclient.HPAmebloPost.CreateBulk(creates...).SaveX(ctx)
				rss := &targetRssFromAsset{
					assetKeys:                   []string{"morningmusume-9ki", "morningmusume-10ki"},
					excludeAssetKeys:            []string{"morningmusume-10ki"},
					excludeUrlsIfAlreadyCrawled: true,
				}
				urls, err := rss.GetUrls(ctx)
				a.Nil(err)
				a.Equals(0, len(urls))
			})

		})
	})

	// test.New("query", test.WithHPMaster()).Run(t, func(ctx context.Context, t *testing.T) {
	// 	a := assert.NewTestAssert(t)
	// 	// post at 2020-05-23 22:20:02 (JST)
	// 	post, err := CrawlURL(ctx, "https://ameblo.jp/morningmusume-9ki/entry-12599048367.html", true)
	// 	a.Nil(err)
	// 	a.NotNil(post)

	// 	// post at 2023-03-13 22:53:41 (JST)
	// 	post2, err := CrawlURL(ctx, "https://ameblo.jp/morningmusume-9ki/entry-12793611077.html", true)
	// 	a.Nil(err)
	// 	a.NotNil(post2)

	// 	q := ent.NewClientFromContext(ctx).HPAmebloPost.Query().Order(ent.Desc(hpameblopost.FieldPostAt))
	// 	urls, err := (&targetHPAmebloPostQuery{q}).GetURLs(ctx)
	// 	a.Nil(err)
	// 	a.Equals(2, len(urls))
	// 	a.Equals("https://ameblo.jp/morningmusume-9ki/entry-12793611077.html", urls[0])
	// 	a.Equals("https://ameblo.jp/morningmusume-9ki/entry-12599048367.html", urls[1])

	// 	q = ent.NewClientFromContext(ctx).HPAmebloPost.Query().Order(ent.Asc(hpameblopost.FieldPostAt)).Limit(1)
	// 	urls, err = (&targetHPAmebloPostQuery{q}).GetURLs(ctx)
	// 	a.Nil(err)
	// 	a.Equals(1, len(urls))
	// 	a.Equals("https://ameblo.jp/morningmusume-9ki/entry-12599048367.html", urls[0])
	// })

	test.New("Url", test.WithHPMaster()).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		urls, err := (&targetUrls{urls: []string{
			"a",
		}}).GetUrls(ctx)
		a.Nil(err)
		a.Equals("a", urls[0])
	})

	test.New("Multi", test.WithHPMaster()).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		urls, err := (&targetMulti{
			[]CrawlerTarget{
				&targetUrls{urls: []string{"a"}},
				&targetUrls{urls: []string{"b"}},
				&targetUrls{urls: []string{"c"}},
				&targetUrls{urls: []string{"a"}},
			},
		}).GetUrls(ctx)
		a.Nil(err)
		a.Equals(3, len(urls))
		a.Equals("a", urls[0])
		a.Equals("b", urls[1])
		a.Equals("c", urls[2])
	})
}
