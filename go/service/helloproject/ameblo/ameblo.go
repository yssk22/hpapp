package ameblo

import (
	"bytes"
	"context"
	"fmt"
	"net/url"

	"github.com/spf13/cobra"
	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/cli"
	"github.com/yssk22/hpapp/go/foundation/object"
	"github.com/yssk22/hpapp/go/foundation/slice"
	"github.com/yssk22/hpapp/go/service/auth"
	"github.com/yssk22/hpapp/go/service/bootstrap/config"
	"github.com/yssk22/hpapp/go/service/bootstrap/http/middleware"
	"github.com/yssk22/hpapp/go/service/bootstrap/http/task"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/hpameblopost"
	"github.com/yssk22/hpapp/go/service/ent/hpasset"
	"github.com/yssk22/hpapp/go/service/ent/hpblob"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/errors"
	"github.com/yssk22/hpapp/go/service/helloproject/blob"
	"github.com/yssk22/hpapp/go/service/helloproject/member"
	"github.com/yssk22/hpapp/go/service/push"
	"github.com/yssk22/hpapp/go/service/schema/enums"
	"github.com/yssk22/hpapp/go/service/scraping"
	"github.com/yssk22/hpapp/go/system/clock"
	"github.com/yssk22/hpapp/go/system/settings"
	"github.com/yssk22/hpapp/go/system/slog"
)

var (
	MaxUrlsPerCrawlerTask = settings.NewInt("service.helloproject.ameblo.max_urls_per_crawler_task", 200)
	ExcludedAssetKeys     = settings.NewStringArray("service.helloproject.ameblo.excluded_asset_keys", []string{
		"satodamai",
		"countrygirls",
		"kobushi-factory",
	})
)

var (
	ErrPostOwnerMissing          = fmt.Errorf("post owner is missing")
	ErrAmebaIsInMaitenance       = fmt.Errorf("ameba is in maintenance")
	ErrInconsistentAssetAndOwner = fmt.Errorf("owner member is not in the asset member list")
)

type amebloService struct {
	blobCrawler blob.Crawler
	tagger      member.Tagger
}

func NewService(blobCrawler blob.Crawler, tagger member.Tagger) config.Service {
	return &amebloService{
		blobCrawler: blobCrawler,
		tagger:      tagger,
	}
}

func (*amebloService) Middleware() []middleware.HttpMiddleware {
	return nil
}

func (s *amebloService) Tasks() []task.Task {
	return []task.Task{
		s.CrawlRssFeedsTask(),
		s.CrawlUrlsTask(),
	}
}

func (s *amebloService) Command() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "ameblo",
		Short: "operate ameblo posts",
	}
	cmd.AddCommand(&cobra.Command{
		Use:   "crawl-urls",
		Short: "crawl urls locally",
		Args:  cobra.MinimumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()
			posts, err := slice.Map(args, func(i int, url string) (*ent.HPAmebloPost, error) {
				return s.crawl(ctx, url, true)
			})
			if err != nil {
				return err
			}
			w := cli.NewTableWriter([]string{"Url", "ID", "Title"})
			for i, p := range posts {
				url := args[i]
				w.WriteRow([]string{url, fmt.Sprintf("%d", p.ID), p.Title})
			}
			w.Flush()
			return nil
		},
	})
	return cmd
}

// CrawlRssFeedsTask crawl rss feeds and call CrawlUrlsTask() for newly found urls.
// This task should be called periodically as many as possible to send a notification when a new post is found.
func (s *amebloService) CrawlRssFeedsTask() *task.TaskSpec[CrawlRssFeedsTaskArgs] {
	return task.NewTask[CrawlRssFeedsTaskArgs](
		"/helloproject/ameblo/crawl-rss-feeds",
		&task.JSONParameter[CrawlRssFeedsTaskArgs]{},
		s.crawlRssFeedsFunc,
		auth.AllowAdmins[CrawlRssFeedsTaskArgs](),
	)
}

// CrawlUrlsTask crawl urls and store them to the database.
func (s *amebloService) CrawlUrlsTask() *task.TaskSpec[CrawlUrlsTaskArgs] {
	return task.NewTask[CrawlUrlsTaskArgs](
		"/helloproject/ameblo/crawl-urls",
		&task.JSONParameter[CrawlUrlsTaskArgs]{},
		s.crawlPostsFunc,
		auth.AllowAdmins[CrawlUrlsTaskArgs](),
	)
}

// CrawlExisintsPostsToRefresh crawl any existing posts flagged with 'recrawl_required'.
func (s *amebloService) CrawlFlaggedPosts() *task.TaskSpec[any] {
	return task.NewTask[any](
		"/helloproject/ameblo/crawl-flagged-posts",
		task.NoParameter(),
		s.crawlFlaggedPostsFunc,
		auth.AllowAdmins[any](),
	)
}

type CrawlRssFeedsTaskArgs struct {
	AssetKeys                   []string `json:"asset_keys"`
	ExcludeAssetKeys            []string `json:"exclude_asset_keys"`
	ExcludeUrlsIfAlreadyCrawled bool     `json:"exclude_urls_if_already_crawled"`
}

func (s *amebloService) crawlRssFeedsFunc(ctx context.Context, args CrawlRssFeedsTaskArgs) error {
	excludes := settings.GetX(ctx, ExcludedAssetKeys)
	rss := targetRssFromAsset{
		assetKeys:                   args.AssetKeys,
		excludeAssetKeys:            excludes,
		excludeUrlsIfAlreadyCrawled: false,
	}
	_, err := s.crawlTarget(ctx, &rss, true)
	return err
}

type CrawlUrlsTaskArgs struct {
	Urls []string `json:"urls"`
}

func (s *amebloService) crawlPostsFunc(ctx context.Context, args CrawlUrlsTaskArgs) error {
	target := targetUrls{
		urls: args.Urls,
	}
	_, err := s.crawlTarget(ctx, &target, true)
	return err
}

func (s *amebloService) crawlFlaggedPostsFunc(ctx context.Context, _ any) error {
	max := settings.GetX(ctx, MaxUrlsPerCrawlerTask)
	flaggedTarget := targetHPAmebloPostQuery{
		query: entutil.NewClient(ctx).HPAmebloPost.Query().Where(hpameblopost.RecrawlRequiredEQ(true)).Limit(max),
	}
	_, err := s.crawlTarget(ctx, &flaggedTarget, false)
	return err
}

func (s *amebloService) crawlTarget(ctx context.Context, t CrawlerTarget, recrawl bool) ([]*ent.HPAmebloPost, error) {
	urls, err := t.GetUrls(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get urls: %w", err)
	}
	max := settings.GetX(ctx, MaxUrlsPerCrawlerTask)
	urlChunks := slice.Chunk(urls, max)
	if len(urlChunks) > 1 {
		remains := slice.Flatten(urlChunks[1:])
		err := s.CrawlUrlsTask().Request(ctx, &CrawlUrlsTaskArgs{
			Urls: remains,
		}, nil)
		if err != nil {
			slog.Warning(ctx, "failed to request remaining urls",
				slog.Name("helloproject.ameblo.crawlTarget"),
				slog.A("total_urls", len(urls)),
				slog.A("remaining_urls", len(remains)),
			)
		}
	}
	return slice.Map(urlChunks[0], func(i int, url string) (*ent.HPAmebloPost, error) {
		return s.crawl(ctx, url, recrawl)
	})
}

func (s *amebloService) crawl(ctx context.Context, url string, recrawl bool) (*ent.HPAmebloPost, error) {
	// we want to reuse raw HTML for futher processing so store it on the blob.
	return slog.Track(ctx, "helloproject.ameblo.crawlOne", func(la slog.Attributes) (*ent.HPAmebloPost, error) {
		la.Set("url", url)
		entblob, err := s.blobCrawler.Crawl(ctx, enums.HPBlobTypeText, enums.HPBlobSubTypeHtml, url, blob.ForceRecrawl(recrawl))
		if err != nil {
			if scraping.IsHttpStatusError(err, 503) {
				la.Set("is_in_maintenance", true)
				return nil, ErrAmebaIsInMaitenance
			}
			// if a post exists, it should increment error count
			post, getError := GetPostByUrl(ctx, url)
			if getError != nil {
				slog.Warning(ctx, "failed to increment error count",
					slog.Name("helloproject.ameblo.crawlOne"),
					slog.Attribute("url", url),
					slog.Attribute("crawl_error", err.Error()),
					slog.Err(getError),
				)
				return nil, err
			}
			_, updateErr := post.Update().AddErrorCount(1).SetLastErrorMessage(err.Error()).Save(ctx)
			if updateErr != nil {
				slog.Warning(ctx, "failed to increment error count",
					slog.Name("helloproject.ameblo.crawlOne"),
					slog.Attribute("url", url),
					slog.Attribute("crawl_error", err.Error()),
					slog.Err(updateErr),
				)
			}
			return nil, err
		}
		la.Set("blob_id", entblob.ID)
		if entblob.Status != enums.HPBlobStatusReadyToHost {
			la.Set("blob_status", entblob.Status)
			la.Set("blob_error", entblob.StatusMessage)
			return nil, fmt.Errorf("blob is not ready to host")
		}
		entry, err := s.scrapePost(ctx, entblob, la)
		if err != nil {
			return nil, err
		}
		asset, err := getAssetByKey(ctx, entry)
		if err != nil {
			return nil, err
		}
		la.Set("asset_id", asset.ID)
		ownerMember, taggedMembers, err := s.getTaggedMembersFromText(ctx, entry)
		if err != nil {
			return nil, err
		}
		if ownerMember != nil {
			la.Set("owner_memebr_id", ownerMember.ID)
			assetOwnerConsistet := slice.ContainsFunc(asset.Edges.Artist.Edges.Members, func(i int, m *ent.HPMember) bool {
				return m.ID == ownerMember.ID
			})
			if !assetOwnerConsistet {
				// There is a case that member tagger don't handle multi key members like 井上玲音 who are
				// in both Kobushi Factory (/w rei_inoue_k) and Juice=Juice (/w rei_inoue).
				// In this case, we utilize assert artist to fix the owner
				multikeyMember := assert.X(slice.Filter(asset.Edges.Artist.Edges.Members, func(i int, m *ent.HPMember) (bool, error) {
					return m.Name == ownerMember.Name, nil
				}))
				if len(multikeyMember) == 1 {
					ownerMember = multikeyMember[0]
				} else {
					return nil, ErrInconsistentAssetAndOwner
				}
			}
		}
		entImages, err := slice.Map(entry.ImageUrls, func(i int, imgUrl string) (*ent.HPBlob, error) {
			return s.blobCrawler.Crawl(ctx, enums.HPBlobTypeImage, enums.HPBlobSubTypeJpeg, imgUrl, blob.SourceHTMLURL(url))
		})
		if err != nil {
			slog.Warning(ctx, "some imagse are failed to crawl",
				slog.Name("helloproject.ameblo.crawlOne"),
				slog.Err(err),
			)
		}
		la.Set("image_blob_ids", assert.X(slice.Map(entImages, func(i int, img *ent.HPBlob) (int, error) {
			return img.ID, nil
		})))
		post, err := upsertHPAmebloPost(ctx, entblob, entry, asset, ownerMember, taggedMembers, entImages)
		if err == nil {
			la.Set("post_id", post.ID)
		}
		return post, err
	})
}

func (s *amebloService) scrapePost(ctx context.Context, entblob *ent.HPBlob, la slog.Attributes) (*postEntryData, error) {
	entry, err := blob.ScrapeFromBlob(ctx, entblob, amebloPostScraper)
	if err != nil {
		return nil, err
	}
	la.Set("ameblo_ids", map[string]interface{}{
		"ameba_id": entry.AmebaID,
		"blog_id":  entry.BlogID,
		"entry_id": entry.EntryID,
	})
	statsUrl := fmt.Sprintf(
		"https://ameblo.jp/_api/blogEntryReactions;amebaId=%s;blogId=%d;entryIds=%d?returnMeta=true",
		entry.AmebaID,
		entry.BlogID,
		entry.EntryID,
	)
	postStats, err := scraping.Scrape(ctx, scraping.NewHTTPFetcher(ctx, statsUrl), amebloPostStatsScraper)
	if err != nil {
		return nil, err
	}
	stats, ok := postStats.Data[fmt.Sprintf("%d", entry.EntryID)]
	if ok {
		entry.Comments = object.Nullable(stats.Comments)
		entry.Likes = object.Nullable(stats.Likes)
		entry.Reblogs = object.Nullable(stats.Reblogs)
	}
	return entry, nil
}

func (s *amebloService) getTaggedMembersFromText(ctx context.Context, post *postEntryData) (*ent.HPMember, []*ent.HPMember, error) {
	// What we've seen so far:
	//   1) the owner member name is used in ThemeName, but rarely not. (e.g: https://ameblo.jp/juicejuice-official/entry-12797578027.html)
	//   2) the owner member name is also used in EntryTitle (last part), but sometimes missing (e.g: https://ameblo.jp/angerme-amerika/entry-12792338631.html)
	//   3) EntryTitle may contain other member names (e.g: https://ameblo.jp/morningmusume-10ki/entry-12540780771.html)
	//   4) it looks like a member set's the title while staff sets the theme. so if theme and title is conflicted, then ownership from EntryTitle could be correct.
	//      (e.g: https://ameblo.jp/juicejuice-official/entry-11599064407.html)
	//   5) There is a case that theme and title doesn't have an owner name, but have it in EntryText. (e.g: https://ameblo.jp/morningm-13ki/entry-12340773412.html)
	//   6) There are the posts by staff, not members. (e.g: https://ameblo.jp/morningmusume-9ki/entry-11620694542.html)
	//      The post have prev/next pointer so we want to store these posts as same as members' posts.
	// so we need to check tagged members in each section to get the owner member.
	var owner *ent.HPMember
	var taggedMembers []*ent.HPMember
	members := s.tagger.GetTaggedMembers(ctx, bytes.NewBufferString(post.EntryTitle))
	if len(members) > 0 {
		taggedMembers = append(taggedMembers, members...)
		owner = members[len(members)-1]
	}
	members = s.tagger.GetTaggedMembers(ctx, bytes.NewBufferString(post.ThemeName))
	if len(members) > 0 {
		taggedMembers = append(taggedMembers, members...)
		if owner == nil {
			owner = members[0]
		}
	}
	members = s.tagger.GetTaggedMembers(ctx, bytes.NewBufferString(post.EntryText))
	if len(members) > 0 {
		taggedMembers = append(taggedMembers, members...)
		if owner == nil {
			owner = members[0]
		}
	}
	if owner == nil {
		return nil, taggedMembers, nil
	}
	// make sure the owner should be in the first position and append remainig tagged members including ones from EntryTitle.
	taggedMembers = append([]*ent.HPMember{owner}, taggedMembers...)
	return owner, taggedMembers, nil
}

func getAssetByKey(ctx context.Context, post *postEntryData) (*ent.HPAsset, error) {
	return entutil.NewClient(ctx).HPAsset.Query().WithArtist(func(q *ent.HPArtistQuery) {
		q.WithMembers()
	}).WithMembers().Where(
		hpasset.AssetTypeEQ(enums.HPAssetTypeAmeblo),
		hpasset.Key(post.AmebaID),
	).Only(ctx)
}

func upsertHPAmebloPost(ctx context.Context, entblob *ent.HPBlob, rawPost *postEntryData, asset *ent.HPAsset, ownerMember *ent.HPMember, taggedMembers []*ent.HPMember, images []*ent.HPBlob) (*ent.HPAmebloPost, error) {
	timestamp := clock.ContextTime(ctx)
	entclient := entutil.NewClient(ctx)
	path := fmt.Sprintf("/%s/entry-%d.html", rawPost.AmebaID, rawPost.EntryID)
	jsonImages := blob.GetJsonMediaList(ctx, images, blob.JsonMediaUseStorage(false))
	blobs := append([]*ent.HPBlob{entblob}, images...)
	blobIds := assert.X(slice.Map(blobs, func(_ int, b *ent.HPBlob) (int, error) {
		return b.ID, nil
	}))
	// bulk update ownership of blob (both html and images)
	if ownerMember != nil {
		err := entclient.HPBlob.Update().
			Where(hpblob.IDIn(blobIds...)).
			SetOwnerArtistID(*ownerMember.ArtistID).SetOwnerMemberID(ownerMember.ID).Exec(ctx)
		if err != nil {
			slog.Warning(ctx, "failed to update blob ownership",
				slog.Name("helloproject.ameblo.upsertHPAmebloPost"),
				slog.Attribute("blob_ids", blobIds),
				slog.Err(err))
		}
	}
	// we don't use upsert but create and update because we want to send notifications only when a new post is created
	create := entclient.HPAmebloPost.Create().
		SetPath(path).
		SetTitle(rawPost.EntryTitle).
		SetTheme(rawPost.ThemeName).
		SetPostAt(rawPost.EntryCreatedDateTime).
		SetSource(hpameblopost.SourceEntry).
		SetCrawledAt(timestamp).
		SetNillableNextPath(rawPost.NextPath).
		SetNillablePrevPath(rawPost.PrevPath).
		SetDescription(rawPost.Description).
		AddTaggedArtistIDs(asset.Edges.Artist.ID).
		SetNillableLikes(rawPost.Likes).
		SetNillableComments(rawPost.Comments).
		SetNillableReblogs(rawPost.Reblogs).
		SetImages(jsonImages).
		AddBlobs(blobs...).
		SetAssetID(asset.ID).
		SetArtistKey(asset.Edges.Artist.Key).
		SetOwnerArtistID(asset.Edges.Artist.ID).
		AddTaggedMembers(taggedMembers...)

	if ownerMember != nil {
		create = create.SetMemberKey(ownerMember.Key).
			SetOwnerMemberID(ownerMember.ID)
	}

	entpost, err := create.Save(ctx)
	if err != nil && !ent.IsConstraintError(err) {
		return nil, err
	}
	if err == nil {
		_, err := push.Deliver(ctx, &amebloPostNotification{
			record: entpost,
		})
		if err != nil && err != push.ErrNoReceivers {
			slog.Warning(ctx, "cannot send a notification for ameblo post",
				slog.Name("helloproject.ameblo.upsertHPAmebloPost"),
				slog.A("post_id", entpost.ID),
				slog.Err(err),
			)
		}
		return entpost, nil
	}
	// if entpost is not created, try to update it
	entpost, err = entclient.HPAmebloPost.Query().Where(hpameblopost.PathEQ(path)).First(ctx)
	if err != nil {
		return nil, err
	}
	update := entpost.Update().
		SetTitle(rawPost.EntryTitle).
		SetTheme(rawPost.ThemeName).
		SetPostAt(rawPost.EntryCreatedDateTime).
		SetSource(hpameblopost.SourceEntry).
		SetCrawledAt(timestamp).
		SetNillableNextPath(rawPost.NextPath).
		SetNillablePrevPath(rawPost.PrevPath).
		SetDescription(rawPost.Description).
		ClearTaggedArtists().
		AddTaggedArtistIDs(asset.Edges.Artist.ID).
		SetNillableLikes(rawPost.Likes).
		SetNillableComments(rawPost.Comments).
		SetNillableReblogs(rawPost.Reblogs).
		SetImages(jsonImages).
		SetErrorCount(0).
		ClearLastErrorMessage().
		SetRecrawlRequired(false).
		ClearTaggedMembers().
		AddTaggedMembers(taggedMembers...).
		ClearBlobs().
		AddBlobs(blobs...).
		SetAssetID(asset.ID).
		SetOwnerArtistID(asset.Edges.Artist.ID).
		SetArtistKey(asset.Edges.Artist.Key)
	if ownerMember != nil {
		update = update.
			SetMemberKey(ownerMember.Key).
			SetOwnerMemberID(ownerMember.ID)
	}
	return update.Save(ctx)
}

// GetPostByUrl returns *ent.HPAmebloPost by rawUrl
func GetPostByUrl(ctx context.Context, rawUrl string) (*ent.HPAmebloPost, error) {
	urlobj, err := url.Parse(rawUrl)
	if err != nil {
		return nil, errors.Wrap(ctx, err, errors.SlogOptions(slog.Attribute("url", rawUrl)))
	}
	post, err := entutil.NewClient(ctx).HPAmebloPost.Query().Where(hpameblopost.PathEQ(urlobj.Path)).First(ctx)
	if err := ent.MaskNotFound(err); err != nil {
		return nil, errors.Wrap(ctx, err, errors.SlogOptions(slog.Attribute("url", rawUrl)))
	}
	return post, err
}
