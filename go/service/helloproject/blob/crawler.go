package blob

import (
	"context"
	"fmt"
	"io"

	"hpapp.yssk22.dev/go/foundation/slice"
	"hpapp.yssk22.dev/go/service/ent"
	"hpapp.yssk22.dev/go/service/ent/hpblob"
	"hpapp.yssk22.dev/go/service/entutil"
	"hpapp.yssk22.dev/go/service/errors"
	"hpapp.yssk22.dev/go/service/schema/enums"
	"hpapp.yssk22.dev/go/service/schema/jsonfields"
	"hpapp.yssk22.dev/go/service/scraping"
	"hpapp.yssk22.dev/go/system/slog"
	"hpapp.yssk22.dev/go/system/storage"
)

var (
	ErrMaxRetriesExceeded = errors.New("max retries exceeded")
)

// Crawler is an interface to crawl a blob from a source URL and store it's binary on the storage and metadata on the database (ent.HPBlob).
type Crawler interface {
	Crawl(ctx context.Context, t enums.HPBlobType, subt enums.HPBlobSubType, sourceBlobURL string, options ...CrawlOption) (*ent.HPBlob, error)
}

type crawler struct {
	maxDownloadRetries int
	processors         []Processor
}

type CrawlerOption func(*crawler)

func WithProcessor(p Processor) CrawlerOption {
	return func(o *crawler) {
		o.processors = append(o.processors, p)
	}
}

func NewCrawler(options ...CrawlerOption) Crawler {
	c := &crawler{
		maxDownloadRetries: 5,
		processors: []Processor{
			imageProcessorDimention,
			videoProcessorThumbnail,
			videoProcessorProbe,
		},
	}
	for _, opt := range options {
		opt(c)
	}
	return c
}

type Processor interface {
	GetType() enums.HPBlobType
	Process(context.Context, *ent.HPBlobUpdateOne, *ent.HPBlob, io.Reader, slog.Attributes) error
}

type CrawlOption func(*crawlOption) (*crawlOption, error)

type crawlOption struct {
	ForceRecrawl            bool   `json:"force_recrawl"`
	OwnerMemberID           int    `json:"owner_member_id"`
	OwnerArtistID           int    `json:"owner_artist_id"`
	SourceHTMLURL           string `json:"source_html_url"`
	StoragePath             string `json:"storage_path"`
	ThumbnailSourceImageURL string `json:"thumbnail_source_image_url"`
	ThumbnailStoragePath    string `json:"thumbnail_storage_path"`
}

func ForceRecrawl(value bool) CrawlOption {
	return func(opts *crawlOption) (*crawlOption, error) {
		opts.ForceRecrawl = value
		return opts, nil
	}
}

func OwnerMemberID(id int) CrawlOption {
	return func(opts *crawlOption) (*crawlOption, error) {
		opts.OwnerMemberID = id
		return opts, nil
	}
}

func OwnerArtistID(id int) CrawlOption {
	return func(opts *crawlOption) (*crawlOption, error) {
		opts.OwnerArtistID = id
		return opts, nil
	}
}

func SourceHTMLURL(url string) CrawlOption {
	return func(opts *crawlOption) (*crawlOption, error) {
		opts.SourceHTMLURL = url
		return opts, nil
	}
}

func StoragePath(path string) CrawlOption {
	return func(opts *crawlOption) (*crawlOption, error) {
		opts.StoragePath = path
		return opts, nil
	}
}

func ThumbnailSourceImageURL(url string) CrawlOption {
	return func(opts *crawlOption) (*crawlOption, error) {
		opts.ThumbnailSourceImageURL = url
		return opts, nil
	}
}

func ThumbnailStoragePath(path string) CrawlOption {
	return func(opts *crawlOption) (*crawlOption, error) {
		opts.ThumbnailStoragePath = path
		return opts, nil
	}
}

func (c *crawler) Crawl(ctx context.Context, t enums.HPBlobType, subt enums.HPBlobSubType, sourceBlobUrl string, options ...CrawlOption) (*ent.HPBlob, error) {
	var err error
	storagePath := GetStoragePathFromUrl(ctx, sourceBlobUrl) // default by sourceBlobUrl
	opt := &crawlOption{
		SourceHTMLURL: sourceBlobUrl,
		StoragePath:   storagePath,
	}
	for _, o := range options {
		opt, err = o(opt)
		if err != nil {
			return nil, errors.Wrap(ctx, err)
		}
	}
	if opt.ThumbnailSourceImageURL != "" && opt.ThumbnailStoragePath == "" {
		opt.ThumbnailStoragePath = GetStoragePathFromUrl(ctx, opt.ThumbnailSourceImageURL)
	}

	return slog.Track(ctx, "service.helloproject.blob.Crawl", func(la slog.Attributes) (*ent.HPBlob, error) {
		la.Set("blob_type", t)
		la.Set("blob_sub_type", subt)
		la.Set("blob_url", sourceBlobUrl)
		la.Set("options", opt)
		b, err := c.crawlInternal(ctx, t, subt, sourceBlobUrl, opt, la)
		return b, errors.Wrap(ctx,
			err,
		)
	})
}

func (c *crawler) crawlInternal(ctx context.Context, t enums.HPBlobType, subt enums.HPBlobSubType, sourceBlobURL string, opt *crawlOption, la slog.Attributes) (*ent.HPBlob, error) {
	b, err := upsertBlobEnt(ctx, t, subt, sourceBlobURL, opt)
	if err != nil {
		return nil, err
	}
	la.Set("blob_id", b.ID)
	la.Set("blob_status_before_crawling", b.Status)
	la.Set("blob_status_error_count_before_crawling", b.StatusErrorCount)

	// crawl and store the binary on storage
	// for text -> always crawl
	// for non text -> crawl only when the status is not `ready_to_host`
	size := b.Size
	update := b.Update()
	if b.Status != enums.HPBlobStatusReadyToHost || opt.ForceRecrawl {
		if (b.StatusErrorCount > c.maxDownloadRetries) && !opt.ForceRecrawl {
			la.Set("max_download_retries", c.maxDownloadRetries)
			return nil, ErrMaxRetriesExceeded
		}
		bytesRead, err := c.crawlAndStoreBlob(ctx, update, b)
		la.Set("crawlAndStoreBlob", err == nil)
		if err != nil {
			if _, updateError := update.Save(ctx); updateError != nil {
				la.Set("update_error", updateError)
			}
			return b, err
		}
		size = *bytesRead
	}
	// now media is available on storage so we can do processing to collect more data from the binary
	// the stream is opened for each processor as some processor might not need entire binary, but this might be a problem for large binary.
	// TODO: we many need to donwload the binrary on the local file system rather than having it in memory
	la.Set("blob_size", size)
	_, err = slice.Map(c.processors, func(i int, p Processor) (any, error) {
		reader, err := storage.FromContext(ctx).OpenForRead(ctx, b.StoragePath)
		if err != nil {
			return nil, fmt.Errorf("cannot open blob from storage: %v", err)
		}
		defer reader.Close()
		if b.Type == p.GetType() {
			return nil, p.Process(ctx, update, b, reader, la)
		}
		return nil, nil
	})
	if err != nil {
		la.Set("processor_errors", err.Error())
	}
	return update.Save(ctx)
}

func (c *crawler) crawlAndStoreBlob(ctx context.Context, update *ent.HPBlobUpdateOne, current *ent.HPBlob) (*int64, error) {
	sc, err := scraping.NewStorageTeeScraper(current.StoragePath, scraping.NewNilScraper(ctx))
	if err != nil {
		return nil, fmt.Errorf("cannot create scraper: %w", err)
	}
	bytesRead, err := scraping.Scrape(ctx, scraping.NewHTTPFetcher(
		ctx,
		current.SourceURL,
	), sc)
	if err == nil && *bytesRead == 0 {
		err = fmt.Errorf("no byte read: %s in %s", current.SourceURL, current.SourceHTMLURL)
	}
	if err != nil {
		update.SetStatusMessage(err.Error())
		update.SetStatusErrorCount(current.StatusErrorCount + 1)
		update.SetStatus(enums.HPBlobStatusError)
	} else {
		update.SetStatusMessage("")
		update.SetStatusErrorCount(0)
		update.SetStatus(enums.HPBlobStatusReadyToHost)
		update.SetSize(*bytesRead)
	}
	return bytesRead, err
}

func upsertBlobEnt(ctx context.Context, t enums.HPBlobType, subt enums.HPBlobSubType, sourceBlobURL string, options *crawlOption) (*ent.HPBlob, error) {
	entClient := entutil.NewClient(ctx)
	create := entClient.HPBlob.Create().
		SetType(t).
		SetSubType(subt).
		SetStoragePath(options.StoragePath).
		SetStatus(enums.HPBlobStatusNeedDownload).
		SetSourceHTMLURL(options.SourceHTMLURL).
		SetSourceURL(sourceBlobURL)
	if options.OwnerArtistID > 0 {
		create.SetOwnerArtistID(options.OwnerArtistID)
	}
	if options.OwnerMemberID > 0 {
		create.SetOwnerMemberID(options.OwnerMemberID)
	}
	if options.ThumbnailSourceImageURL != "" {
		create.SetThumbnail(&jsonfields.HPBlobThumbnail{
			SourceImageURL: options.ThumbnailSourceImageURL,
			StoragePath:    options.ThumbnailStoragePath,
		})
	}
	upsert := create.OnConflictColumns(hpblob.FieldStoragePath).
		SetType(t).
		SetSubType(subt).
		SetSourceHTMLURL(options.SourceHTMLURL).
		SetSourceURL(sourceBlobURL)

	if options.OwnerArtistID > 0 {
		upsert.SetOwnerArtistID(options.OwnerArtistID)
	}
	if options.OwnerMemberID > 0 {
		upsert.SetOwnerMemberID(options.OwnerMemberID)
	}
	id, err := upsert.ID(ctx)
	if err != nil {
		return nil, err
	}
	return entClient.HPBlob.Get(ctx, id)
}
