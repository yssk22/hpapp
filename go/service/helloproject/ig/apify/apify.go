package apify

import (
	"context"
	"fmt"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/slice"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/hpigpost"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/helloproject/ig"
	"github.com/yssk22/hpapp/go/service/schema/jsonfields"
	"github.com/yssk22/hpapp/go/service/scraping"
	"github.com/yssk22/hpapp/go/system/http/external"
	"github.com/yssk22/hpapp/go/system/settings"
	"github.com/yssk22/hpapp/go/system/slog"
)

const (
	datasetUrl      = "https://api.apify.com/v2/datasets/%s/items"
	taskRunsListUrl = "https://api.apify.com/v2/actor-tasks/%s/runs?desc=1&status=SUCCEEDED"
)

type ApifyActorType string

const (
	// ApifyActorTypeInstagramScraper is a type to use Apify Instagram Scraper.
	// it returns the posts
	// $4.25/1,000 posts
	// ref: https://console.apify.com/actors/shu8hvrXbJbY3Eb9W#/information/latest/readme
	ActorTypeInstagramScraper ApifyActorType = "apify~instagram-scraper"
	// ApifyActorTypeInstagramProfileScraper is a type to use Apify Instagram Profile Scraper.
	// it returns the basic profile information and the latest posts from that profile.
	// $5.50/1000 profiles (=5000 latest posts)
	// ref: https://console.apify.com/actors/dSCLg0C3YEZ83HzYX#/information/latest/readme
	ActorTypeInstagramProfileScraper ApifyActorType = "apify~instagram-profile-scraper"
)

var (
	ApifyLatestToken      = settings.NewString("service.helloproject.ig.apify.apify_latest_token", "")
	ApifyLatestTaskName   = settings.NewString("service.helloproject.ig.apify.apify_latest_task_name", "yssk22~instagram-profile-scraper-task")
	ApifyBackfillToken    = settings.NewString("service.helloproject.ig.apify.apify_backfill_token", "")
	ApifyBackfillTaskName = settings.NewString("service.helloproject.ig.apify.apify_backfill_task_name", "yssk22dev~instagram-scraper-task-backfill")
)

// NewLatestTarget ruturns ig.CrawlerTarget to scrape the latest posts from the Apify.
func NewLatestTarget() ig.CrawlerTarget {
	return &apifySettings{
		tokenSettings:    ApifyLatestToken,
		taskNameSettings: ApifyLatestTaskName,
		actorType:        ActorTypeInstagramProfileScraper,
		prevalidation:    false,
	}
}

// NewBackfillTarget rtuturns ig.CrawlerTarget to scrape the posts from Apify backfill task
func NewBackfillTarget() ig.CrawlerTarget {
	return &apifySettings{
		tokenSettings:    ApifyBackfillToken,
		taskNameSettings: ApifyBackfillTaskName,
		actorType:        ActorTypeInstagramScraper,
		prevalidation:    true,
	}
}

type apifySettings struct {
	tokenSettings    settings.Item[string]
	taskNameSettings settings.Item[string]
	actorType        ApifyActorType
	prevalidation    bool
}

func (a *apifySettings) GetCrawlArgs(ctx context.Context) ([]jsonfields.HPIgCrawlArgs, error) {
	token := settings.GetX(ctx, a.tokenSettings)
	if token == "" {
		slog.Warning(ctx,
			"apify tokenSettings is empty so nothing is crawled.",
			slog.Name("services.helloproject.iig.apify.tokenSettings"),
		)
		return []jsonfields.HPIgCrawlArgs{}, nil
	}
	taskName := settings.GetX(ctx, a.taskNameSettings)
	if taskName == "" {
		slog.Warning(ctx,
			"apify taskName is empty so nothing is crawled.",
			slog.Name("services.helloproject.iig.apify.taskNameSettings"),
		)
		return []jsonfields.HPIgCrawlArgs{}, nil
	}
	return NewTargetFromApifyLatest(token, a.actorType, taskName, a.prevalidation).GetCrawlArgs(ctx)
}

// NewTargetFromApifyLatest returns a new CrawlerTarget from the Apify latest result.
func NewTargetFromApifyLatest(token string, actorType ApifyActorType, taskName string, prevalidation bool) ig.CrawlerTarget {
	return &apifyLatest{
		token:         token,
		actorType:     actorType,
		taskName:      taskName,
		prevalidation: prevalidation,
	}
}

type apifyLatest struct {
	token         string
	actorType     ApifyActorType
	taskName      string
	prevalidation bool
}

func (a *apifyLatest) GetCrawlArgs(ctx context.Context) ([]jsonfields.HPIgCrawlArgs, error) {
	list, err := scraping.Scrape(
		ctx,
		newApifyHttpFetcher(ctx, fmt.Sprintf(taskRunsListUrl, a.taskName), a.token),
		actorsListScraper,
	)
	if err != nil {
		return nil, err
	}
	if len(list.Data.Items) == 0 {
		return nil, fmt.Errorf("no run found")
	}
	return NewTargetFromApifyDataset(a.token, a.actorType, list.Data.Items[0].DefaultDatasetId, a.prevalidation).GetCrawlArgs(ctx)
}

// NewTargetFromApifyDataset returns a new CrawlerTarget from the Apify dataset.
func NewTargetFromApifyDataset(token string, actorType ApifyActorType, datasetId string, prevalidation bool) ig.CrawlerTarget {
	return &apifyDataset{
		token:         token,
		actorType:     actorType,
		datasetId:     datasetId,
		prevalidation: prevalidation,
	}
}

type apifyDataset struct {
	token         string
	datasetId     string
	actorType     ApifyActorType
	prevalidation bool
}

func (a *apifyDataset) GetCrawlArgs(ctx context.Context) ([]jsonfields.HPIgCrawlArgs, error) {
	var list []jsonfields.HPIgCrawlArgs
	switch a.actorType {
	case ActorTypeInstagramProfileScraper:
		profiles, err := scraping.Scrape(
			ctx,
			newApifyHttpFetcher(ctx, fmt.Sprintf(datasetUrl, a.datasetId), a.token),
			actorRunDataSetInstagramProfileScraper,
		)
		if err != nil {
			return nil, err
		}
		list = slice.Flatten(assert.X(slice.Map(*profiles, func(i int, v actorRunInstagramProfilerScraperDatasetItem) ([]jsonfields.HPIgCrawlArgs, error) {
			return v.LatestPosts, nil
		})))
	case ActorTypeInstagramScraper:
		result, err := scraping.Scrape(
			ctx,
			newApifyHttpFetcher(ctx, fmt.Sprintf(datasetUrl, a.datasetId), a.token),
			actorRunDatasetInstagramScraper,
		)
		if err != nil {
			return nil, err
		}
		list = *result
	default:
		return nil, fmt.Errorf("unknown actorType(%s)", a.actorType)
	}
	// actorRunDatasetInstagramScraper may contain invalid data in their list so filter them out.
	list = assert.X(slice.Filter(list, func(i int, arg jsonfields.HPIgCrawlArgs) (bool, error) {
		return arg.Shortcode != "", nil
	}))
	if !a.prevalidation {
		return list, nil
	}
	return a.prevalidate(ctx, list), nil
}

func (a *apifyDataset) prevalidate(ctx context.Context, list []jsonfields.HPIgCrawlArgs) []jsonfields.HPIgCrawlArgs {
	total := len(list)
	shortcodes := assert.X(slice.Map(list, func(i int, arg jsonfields.HPIgCrawlArgs) (string, error) {
		return arg.Shortcode, nil
	}))
	posts := entutil.NewClient(ctx).HPIgPost.Query().WithBlobs().Where(hpigpost.ShortcodeIn(shortcodes...)).AllX(ctx)
	postsMap := map[string]*ent.HPIgPost{}
	for _, post := range posts {
		postsMap[post.Shortcode] = post
	}
	targets := assert.X(slice.Filter(list, func(i int, args jsonfields.HPIgCrawlArgs) (bool, error) {
		if post, ok := postsMap[args.Shortcode]; ok {
			ok, _ := ig.ValidatePost(ctx, &args, post)
			if ok {
				return false, nil
			}
		}
		return true, nil
	}))
	remains := len(targets)
	slog.Info(ctx,
		fmt.Sprintf("%d posts (out of %d) needs to be in the target", remains, total),
		slog.Name("helloproject.apify.prevalidate.remains"),
	)
	return targets
}

func newApifyHttpFetcher(ctx context.Context, url string, token string) scraping.Fetcher {
	return scraping.NewHTTPFetcher(
		ctx,
		url,
		scraping.WithHttpClient(external.FromContext(ctx)),
		scraping.WithHttpHeader("Authorization", fmt.Sprintf("Bearer %s", token)),
	)
}

type actorsList struct {
	Data struct {
		Items []actorResult `json:"items"`
	} `json:"data"`
}

type actorResult struct {
	ID               string `json:"id"`
	DefaultDatasetId string `json:"defaultDatasetId"`
}

type actorRunInstagramProfilerScraperDatasetItem struct {
	ID          string                     `json:"id"`
	Username    string                     `json:"username"`
	PostsCount  int                        `json:"postsCount"`
	LatestPosts []jsonfields.HPIgCrawlArgs `json:"latestPosts"`
}

var actorsListScraper = scraping.JSON[actorsList]()

var actorRunDatasetInstagramScraper = scraping.JSON[[]jsonfields.HPIgCrawlArgs]()
var actorRunDataSetInstagramProfileScraper = scraping.JSON[[]actorRunInstagramProfilerScraperDatasetItem]()
