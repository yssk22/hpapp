package ameblo

import (
	"context"
	"fmt"
	"net/url"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/slice"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/hpameblopost"
	"github.com/yssk22/hpapp/go/service/ent/hpasset"
	"github.com/yssk22/hpapp/go/service/ent/predicate"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/schema/enums"
	"github.com/yssk22/hpapp/go/service/scraping"
)

// CrawlerTarget is an abstract interface to get the crawl args for ameblo URLs
type CrawlerTarget interface {
	GetUrls(context.Context) ([]string, error)
}

type targetRssFromAsset struct {
	assetKeys                   []string
	excludeAssetKeys            []string
	excludeUrlsIfAlreadyCrawled bool
}

func (rss *targetRssFromAsset) GetUrls(ctx context.Context) ([]string, error) {
	entclient := entutil.NewClient(ctx)
	var where = []predicate.HPAsset{
		hpasset.AssetTypeEQ(enums.HPAssetTypeAmeblo),
	}
	if len(rss.assetKeys) > 0 {
		where = append(where, hpasset.KeyIn(rss.assetKeys...))
	}
	if len(rss.excludeAssetKeys) > 0 {
		where = append(where, hpasset.KeyNotIn(rss.excludeAssetKeys...))
	}

	assets, err := entclient.HPAsset.Query().Where(where...).All(ctx)
	if err != nil {
		return nil, err
	}
	list, err := slice.MapAsync(assets, func(i int, asset *ent.HPAsset) ([]string, error) {
		url := fmt.Sprintf("http://rssblog.ameba.jp/%s/rss20.xml", asset.Key)
		urls, err := scraping.Scrape(ctx, scraping.NewHTTPFetcher(ctx, url), amebloRssToURLScraper)
		if err != nil {
			return nil, fmt.Errorf("cannot crawl %s: %w", url, err)
		}
		return *urls, err
	})
	if err != nil {
		return nil, err
	}
	target := slice.Flatten(list)
	if !rss.excludeUrlsIfAlreadyCrawled {
		return target, nil
	}
	targetPaths := assert.X(slice.Map(target, func(i int, rawUrl string) (string, error) {
		obj, err := url.Parse(rawUrl)
		if err != nil {
			return "", err
		}
		return obj.Path, nil
	}))
	posts, err := entclient.HPAmebloPost.Query().Where(hpameblopost.PathIn(targetPaths...)).All(ctx)
	if err != nil {
		return nil, fmt.Errorf("cannot fetch HPAmebloPost: %v", err)
	}
	pathToPostMap := slice.ToMap(posts, func(i int, post *ent.HPAmebloPost) string {
		return fmt.Sprintf("https://ameblo.jp%s", post.Path)
	})
	target = assert.X(slice.Filter(target, func(i int, v string) (bool, error) {
		_, ok := pathToPostMap[v]
		return !ok, nil
	}))
	return target, nil
}

var amebloRssToURLScraper = scraping.RSS2(func(ctx context.Context, rss *scraping.RSS2Doc) (*[]string, error) {
	urls, err := slice.Map(rss.Channel.Items, func(i int, v *scraping.RSS2Item) (string, error) {
		return v.Link, nil
	})
	if err != nil {
		return nil, err
	}
	return &urls, nil
})

type targetUrls struct {
	urls []string
}

func (t *targetUrls) GetUrls(ctx context.Context) ([]string, error) {
	return t.urls, nil
}

func NewURLsTarget(urls ...string) CrawlerTarget {
	return &targetUrls{
		urls: urls,
	}
}

type targetMulti struct {
	targets []CrawlerTarget
}

func (t *targetMulti) GetUrls(ctx context.Context) ([]string, error) {
	urls, err := slice.Map(t.targets, func(i int, t CrawlerTarget) ([]string, error) {
		return t.GetUrls(ctx)
	})
	if err != nil {
		return nil, err
	}
	return slice.Unique(slice.Flatten(urls), func(i int, v string) string {
		return v
	}), nil
}

type targetHPAmebloPostQuery struct {
	query *ent.HPAmebloPostQuery
}

func (t *targetHPAmebloPostQuery) GetUrls(ctx context.Context) ([]string, error) {
	posts, err := t.query.All(ctx)
	if err != nil {
		return nil, err
	}
	return slice.Map(posts, func(i int, p *ent.HPAmebloPost) (string, error) {
		return fmt.Sprintf("https://ameblo.jp%s", p.Path), nil
	})
}
