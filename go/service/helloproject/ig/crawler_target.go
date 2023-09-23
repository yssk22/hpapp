package ig

import (
	"context"
	"encoding/json"
	"os"

	"github.com/yssk22/hpapp/go/foundation/slice"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/hpigpost"
	"github.com/yssk22/hpapp/go/service/schema/jsonfields"
)

// CrawlerTarget is an abstract interface to get the crawl args for ig blobs
// All the necessary post metadata such as shortcode, ownername, ...etc must be included in the jsonfields.HPIgCrawlArgs
//
// In OSS codebase, we don't have a concrete implementation to get the crawl args from the original IG post since it needs a complex system setup.
type CrawlerTarget interface {
	GetCrawlArgs(context.Context) ([]jsonfields.HPIgCrawlArgs, error)
}

func NewTargetFromFile(path string) CrawlerTarget {
	return &fileTarget{
		path: path,
	}
}

type fileTarget struct {
	path string
}

func (r *fileTarget) GetCrawlArgs(ctx context.Context) ([]jsonfields.HPIgCrawlArgs, error) {
	var args []jsonfields.HPIgCrawlArgs
	f, err := os.Open(r.path)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	if err := json.NewDecoder(f).Decode(&args); err != nil {
		return nil, err
	}
	return args, nil
}

// NewTargetFromEntQuery returns a new CrawlerTarget from the ent query
func NewTargetFromEntQuery(query *ent.HPIgPostQuery) CrawlerTarget {
	return &entQuery{
		query: query,
	}
}

type entQuery struct {
	query *ent.HPIgPostQuery
}

func (q *entQuery) GetCrawlArgs(ctx context.Context) ([]jsonfields.HPIgCrawlArgs, error) {
	posts, err := q.query.Where(hpigpost.RecrawlArgsNotNil()).All(ctx)
	if err != nil {
		return nil, err
	}
	return slice.Map(posts, func(i int, p *ent.HPIgPost) (jsonfields.HPIgCrawlArgs, error) {
		return *p.RecrawlArgs, nil
	})
}
