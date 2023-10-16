package elineupmall

import (
	"bytes"
	"context"
	"fmt"
	"strconv"
	"strings"

	"github.com/PuerkitoBio/goquery"
	"github.com/spf13/cobra"
	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/cli"
	"github.com/yssk22/hpapp/go/foundation/slice"
	"github.com/yssk22/hpapp/go/service/auth"
	"github.com/yssk22/hpapp/go/service/bootstrap/config"
	"github.com/yssk22/hpapp/go/service/bootstrap/http/middleware"
	"github.com/yssk22/hpapp/go/service/bootstrap/http/task"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/hpelineupmallitem"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/helloproject/blob"
	"github.com/yssk22/hpapp/go/service/helloproject/member"
	"github.com/yssk22/hpapp/go/service/schema/jsonfields"
	"github.com/yssk22/hpapp/go/service/scraping"
	"github.com/yssk22/hpapp/go/system/clock"
	"github.com/yssk22/hpapp/go/system/settings"
	"github.com/yssk22/hpapp/go/system/slog"
)

var (
	// ErrArtistPageWithoutItemLinks is an error when the artist page has the next page without any item links.
	// If this error happens, it means that the artist page is no longer a valid artist page or need to update the scraper.
	ErrArtistPageWithoutItemLinks = fmt.Errorf("artist page has the next page without any item links")
)

type elineupmallService struct {
	blobCrawler          blob.Crawler
	tagger               member.Tagger
	salesPeriodExtractor SalesPeriodExtractor
	categoryResolver     CategoryResolver
}

func NewService(blobCrawler blob.Crawler, tagger member.Tagger, salesPeriodExtractor SalesPeriodExtractor, categoryResolver CategoryResolver) config.Service {
	return &elineupmallService{
		blobCrawler:          blobCrawler,
		tagger:               tagger,
		salesPeriodExtractor: salesPeriodExtractor,
		categoryResolver:     categoryResolver,
	}
}

func (*elineupmallService) Middleware() []middleware.HttpMiddleware {
	return nil
}

func (s *elineupmallService) Tasks() []task.Task {
	return []task.Task{
		s.CrawlArtistPageTask(),
		s.CrawlItemPagesTask(),
	}
}

func (s *elineupmallService) Command() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "elineupmall",
		Short: "operate elineupmall items",
	}
	cmd.AddCommand(&cobra.Command{
		Use:   "crawl-items",
		Short: "crawl elineupmall item page locally",
		Args:  cobra.MinimumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()
			err := s.crawlItemPagesFunc(ctx, CrawlItemPagesArgs{
				Urls: args,
			})
			if err != nil {
				return err
			}
			items := entutil.NewClient(ctx).HPElineupMallItem.Query().Where(hpelineupmallitem.PermalinkIn(
				args...,
			)).AllX(ctx)
			permalinkMap := slice.ToMap(items, func(i int, r *ent.HPElineupMallItem) string {
				return r.Permalink
			})
			w := cli.NewTableWriter([]string{"Permalink", "ID", "Name"})
			for _, permalink := range args {
				item := permalinkMap[permalink]
				if item == nil {
					w.WriteRow([]string{
						permalink,
						"-",
						"-",
					})
				} else {
					w.WriteRow([]string{
						permalink,
						fmt.Sprintf("%d", item.ID),
						item.Name,
					})
				}
			}
			w.Flush()
			return nil
		},
	})
	return cmd
}

// CrawlArtistPageArgs is an argument for CrawlArtistPageTask.
// This controls the batch execution of the elineupmall crawler.
// The crawl always crawl the item list page of "ハロー！プロジェクト" (https://www.elineupmall.com/c671/c181/c197/),
// which would have 4000+ items and the page is actually split into multiple pages.
// `ListItemsPerPage` parameter is used to crawl all pages of the artist, which shows the links of item pages. If you set the lower number,
//  you will have more http tasks to crawl all item list pages. And if you set the higher number, you may likely to have a timeout or 5xx error.
// we recommend not to set the number too high and should keep the lower than 1000.
// Then once the crawler gets the item links, it will crawl these links up to MaxItemsPerList **per each item list page**, not all links since
// most of items shouldn't have any changes - the change would be only in `IsOutOfStock` (or rarely in name and description).
// So you don't have to crawl all items in every batch but can crall all items in a few batches.
//
// for example,
//   - if you set PerPage=1000 and ListItemsPerPage=200, then you need 5 batches to crawl all items to keep them updated.
//   - if you set PerPage=1 and MaxItemsPerCrawl=1, then you need only 1 batch to crawl all items but you will have `4000+ * 2` (one list page and one item page)
//     http async task requets.
//
// Default values can be controlled by settings.
type CrawlArtistPageArgs struct {
	Index            int `json:"index"`
	ListItemsPerPage int `json:"list_items_per_page"` // elineupmall can show up to 1000 items per a page.
	MaxItemsPerList  int `json:"max_items_per_list"`  // how many items to crawl per a batch
}

var (
	CrawlArtistPageArgsListItemsPerPage = settings.NewInt("service.helloproject.elineupmall.list_items_per_page", 1000)
	CrawlArtistPageArgsMaxItemsPerCrawl = settings.NewInt("service.helloproject.elineupmall.max_items_per_crawl", 200)
)

func (s *elineupmallService) CrawlArtistPageTask() *task.TaskSpec[CrawlArtistPageArgs] {
	return task.NewTask[CrawlArtistPageArgs](
		"/helloproject/elineupmall/crawl-artist-page",
		&task.JSONParameter[CrawlArtistPageArgs]{},
		s.crawlArtistPageFunc,
		auth.AllowAdmins[CrawlArtistPageArgs](),
	)
}

func (s *elineupmallService) crawlArtistPageFunc(ctx context.Context, args CrawlArtistPageArgs) error {
	if args.ListItemsPerPage <= 0 {
		args.ListItemsPerPage = settings.GetX(ctx, CrawlArtistPageArgsListItemsPerPage)
		slog.Info(ctx,
			"using services.helloproject.elineupmall.CrawlArtistPageArgsPerPageDefault",
			slog.Name("service.helloproject.elineupmall.CrawlArtistPageTask"),
			slog.Attribute("value", args.ListItemsPerPage),
		)
	}
	if args.MaxItemsPerList <= 0 {
		args.MaxItemsPerList = settings.GetX(ctx, CrawlArtistPageArgsMaxItemsPerCrawl)
		slog.Info(ctx,
			"using services.helloproject.elineupmall.CrawlArtistPageArgsMaxItemsPerCrawlDefault",
			slog.Name("service.helloproject.elineupmall.CrawlArtistPageTask"),
			slog.Attribute("value", args.MaxItemsPerList),
		)
	}
	const baseUrl = "https://www.elineupmall.com/c671/c181/c197/"
	url := fmt.Sprintf("%spage-%d/?items_per_page=%d", baseUrl, args.Index, args.ListItemsPerPage)
	page, err := scraping.Scrape(ctx, scraping.NewHTTPFetcher(ctx, url), artistPageScraper)
	if err != nil {
		return err
	}
	// crawl items asynchronously to avoid timeout of crawling item pages.
	s.requestNewItemPagesTask(ctx, page.itemLinks, args.MaxItemsPerList)
	if len(page.itemLinks) == 0 || !page.hasNext {
		slog.Info(ctx, "crawl artist page completed",
			slog.Name("service.helloproject.elineupmall.CrawlArtistPageTask"),
			slog.Attribute("at_page", args.Index),
		)
		return nil
	}
	slog.Info(ctx, "crawling artist page recursively",
		slog.Name("service.helloproject.elineupmall.CrawlArtistPageTask"),
		slog.Attribute("at_page", args.Index),
	)
	return s.CrawlArtistPageTask().Request(ctx, &CrawlArtistPageArgs{
		Index:            args.Index + 1,
		ListItemsPerPage: args.ListItemsPerPage,
		MaxItemsPerList:  args.MaxItemsPerList,
	}, nil)
}

func (s *elineupmallService) requestNewItemPagesTask(ctx context.Context, itemLinks []string, maxItemsPerList int) {
	// we would have 1000 item links but some of them are already in database.
	// we don't want to put too much load on the server so prioritize the items with the rules below.
	// 1) items that are not in database should be crawled.
	// 2) items that are in database are prioritized by the crawled_at.
	items, err := entutil.NewClient(ctx).HPElineupMallItem.Query().
		Where(
			hpelineupmallitem.PermalinkIn(itemLinks...),
		).Order(ent.Asc(hpelineupmallitem.FieldCrawledAt)).
		All(ctx)
	if err != nil {
		slog.Error(ctx, "cannot fetch existing items",
			slog.Name("service.helloproject.elineupmall.CrawlArtistPageTask"),
			slog.Attribute("links", itemLinks),
			slog.Attribute("error", err.Error()),
		)
		return
	}
	permalinkMap := slice.ToMap(items, func(i int, r *ent.HPElineupMallItem) string {
		return r.Permalink
	})
	permalinks := assert.X(slice.Filter(itemLinks, func(i int, permalink string) (bool, error) {
		_, ok := permalinkMap[permalink]
		return !ok, nil
	}))
	// items are already sorted by the crawled_at.
	if len(permalinks) > maxItemsPerList {
		permalinks = permalinks[:maxItemsPerList]
	} else {
		// we have (n - len(permalink)) capacity to crawl
		cap := maxItemsPerList - len(permalinks)
		if len(items) > cap {
			items = items[:cap]
		}
		permalinks = append(permalinks, assert.X(slice.Map(items, func(i int, item *ent.HPElineupMallItem) (string, error) {
			return item.Permalink, nil
		}))...)
	}
	slog.Info(ctx,
		fmt.Sprintf("crawl %d items asynchronously", len(permalinks)),
		slog.Name("service.helloproject.elineupmall.CrawlArtistPageTask"),
		slog.Attribute("permalinks", permalinks),
	)
	err = s.CrawlItemPagesTask().Request(ctx, &CrawlItemPagesArgs{
		Urls: permalinks,
	}, nil)
	if err != nil {
		// err could happen not only by infrastructure reason but also by application logic.
		// e.g. if # of links are too many and exceeds the payload limit.
		slog.Error(ctx, "failed to request item pages task from the artist page",
			slog.Name("service.helloproject.elineupmall.CrawlArtistPageTask"),
			slog.Attribute("links", permalinks),
			slog.Attribute("error", err.Error()),
		)
	}
}

type artistPage struct {
	itemLinks []string
	hasNext   bool
}

var artistPageScraper = scraping.HTML(func(ctx context.Context, doc *goquery.Document, h *scraping.HTMLHead) (*artistPage, error) {
	var result artistPage
	result.hasNext = h.Meta.Get("next") != ""
	doc.Find("div.ty-grid-list__item-name a").Each(func(i int, link *goquery.Selection) {
		if href, ok := link.Attr("href"); ok {
			result.itemLinks = append(result.itemLinks, href)
		}
	})
	if result.hasNext && len(result.itemLinks) == 0 {
		return nil, ErrArtistPageWithoutItemLinks
	}

	return &result, nil
})

type CrawlItemPagesArgs struct {
	Urls []string `json:"urls"`
}

func (s *elineupmallService) CrawlItemPagesTask() *task.TaskSpec[CrawlItemPagesArgs] {
	return task.NewTask[CrawlItemPagesArgs](
		"/helloproject/elineupmall/crawl-item-pages",
		&task.JSONParameter[CrawlItemPagesArgs]{},
		s.crawlItemPagesFunc,
		auth.AllowAdmins[CrawlItemPagesArgs](),
	)
}

func (s *elineupmallService) crawlItemPagesFunc(ctx context.Context, args CrawlItemPagesArgs) error {
	entclient := entutil.NewClient(ctx) // .Debug()
	creates, err := slice.MapAsync(args.Urls, func(i int, permalink string) (*ent.HPElineupMallItemCreate, error) {
		p, err := scraping.Scrape(ctx, scraping.NewHTTPFetcher(ctx, permalink), itemPageScraper)
		if err != nil {
			return nil, err
		}
		return s.prepareCreate(ctx, entclient, permalink, p), nil
	})
	if err != nil {
		slog.Error(ctx, "some pages are failed to be scraped",
			slog.Name("services.helloproject.elineupmall.CrawlItemPagesTask"),
			slog.Attribute("error", err.Error()))
	}
	creates = assert.X(slice.Filter(creates, func(i int, v *ent.HPElineupMallItemCreate) (bool, error) {
		return v != nil, nil
	}))
	if len(creates) == 0 {
		slog.Warning(ctx, "no items to upsert", slog.Name("services.helloproject.elineupmall.CrawlItemPagesTask"))
		return nil
	}
	// creates actually use upsert feature and it shouldn't touch the m2m edge as it can fail because of UpdateNewValues() option.
	err = entclient.HPElineupMallItem.CreateBulk(creates...).OnConflictColumns(hpelineupmallitem.FieldPermalink).UpdateNewValues().Exec(ctx)
	if err != nil {
		slog.Error(ctx, "failed to upsert items",
			slog.Name("services.helloproject.elineupmall.CrawlItemPagesTask"),
			slog.Attribute("error", err.Error()))
		return err
	}
	// update m2m
	items := entclient.HPElineupMallItem.Query().WithTaggedArtists().WithTaggedMembers().Where(hpelineupmallitem.PermalinkIn(args.Urls...)).AllX(ctx)
	_, err = slice.Map(items, func(i int, p *ent.HPElineupMallItem) (any, error) {
		content := fmt.Sprintf("%s %s", p.Name, p.Description)
		artists := s.tagger.GetTaggedArtists(ctx, bytes.NewBufferString(content))
		members := s.tagger.GetTaggedMembers(ctx, bytes.NewBufferString(content))
		update := p.Update().ClearTaggedArtists().ClearTaggedMembers()
		if len(artists) > 0 {
			update.AddTaggedArtists(artists...)
		}
		if len(members) > 0 {
			update.AddTaggedMembers(members...)
		}
		if len(artists) == 0 && len(members) == 0 {
			slog.Warning(ctx,
				"tagging artists/members may not support a product",
				slog.Name("service.helloproject.elineupmall.CrawlItemPagesTask"),
				slog.Attribute("name", p.Name),
				slog.Attribute("permalink", p.Permalink),
			)
		}
		return nil, update.Exec(ctx)
	})
	return err
}

func (s *elineupmallService) prepareCreate(ctx context.Context, entclient *ent.Client, permalink string, p *ItemPage) *ent.HPElineupMallItemCreate {
	timestamp := clock.ContextTime(ctx)
	salesPeriod := s.salesPeriodExtractor.ExtractSalesPeriod(ctx, p)
	category := s.categoryResolver.Resolve(ctx, p)
	create := entclient.HPElineupMallItem.Create().
		SetPermalink(permalink).
		SetName(p.Name).
		SetDescription(p.Description).
		SetSupplier(p.Supplier).
		SetPrice(p.Price).
		SetIsLimitedToFc(p.IsLimitedToFC).
		SetIsOutOfStock(p.IsOutOfStock).
		SetCategory(category).
		SetImages(assert.X(slice.Map(p.Images, func(i int, v string) (jsonfields.Media, error) {
			return jsonfields.Media{
				Url: v,
			}, nil
		}))).
		SetCrawledAt(timestamp).
		SetErrorCount(0).
		SetLastErrorMessage("")
	if salesPeriod != nil {
		create.SetNillableOrderStartAt(salesPeriod.From)
		create.SetNillableOrderEndAt(salesPeriod.To)
	}
	return create
}

// ItemPage contains the structured data scraped from the item page html.
type ItemPage struct {
	Name          string
	Supplier      string
	Price         int
	IsLimitedToFC bool
	IsOutOfStock  bool
	Images        []string
	Description   string
	Options       map[string]bool
}

var itemPageDescriptionNormalizer = map[string]string{
	"\n": "",
	"（":  "(",
	"）":  ")",
	"：":  ":",
}

var itemPageScraper = scraping.HTML(func(ctx context.Context, doc *goquery.Document, h *scraping.HTMLHead) (*ItemPage, error) {
	var result ItemPage
	result.Options = make(map[string]bool)
	result.Name = strings.TrimSpace(doc.Find("h1.ty-product-block-title").Text())
	result.Description = strings.TrimSpace(doc.Find("div#content_description").Text())
	for k, v := range itemPageDescriptionNormalizer {
		result.Description = strings.ReplaceAll(result.Description, k, v)
	}
	result.IsLimitedToFC = doc.Find("ul.status-icon-group li.status-icon-hpfc").Length() > 0
	doc.Find("div.ty-product-block__price-actual span.ty-price-num").Each(func(i int, price *goquery.Selection) {
		value, _ := strconv.Atoi(
			strings.ReplaceAll(strings.TrimSpace(price.Text()), ",", ""),
		)
		if value > 0 {
			result.Price = value
		}
	})
	doc.Find("label.ty-control-group__label").Each(func(i int, label *goquery.Selection) {
		labelText := strings.TrimSpace(label.Text())
		switch labelText {
		case "サプライヤー:":
			result.Supplier = strings.TrimSpace(label.Parent().Find("span.ty-control-group__item").Text())
		case "在庫状況:":
			result.IsOutOfStock = strings.TrimSpace(label.Parent().Find("span.ty-control-group__item").Text()) != "在庫あり"
		default:
			break
		}
	})
	doc.Find("div.ty-product-options select option").Each(func(i int, option *goquery.Selection) {
		result.Options[strings.TrimSpace(option.Text())] = true
	})
	doc.Find("div.ty-product-img img").Each(func(i int, img *goquery.Selection) {
		src := img.AttrOr("src", "")
		if src != "" {
			result.Images = append(result.Images, src)
		}
	})
	return &result, nil
})
