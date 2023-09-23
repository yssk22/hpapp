package blob

import (
	"context"
	"fmt"
	"net/url"
	"path/filepath"
	"strings"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/foundation/slice"
	"hpapp.yssk22.dev/go/service/ent"
	"hpapp.yssk22.dev/go/service/ent/hpblob"
	"hpapp.yssk22.dev/go/service/entutil"
	"hpapp.yssk22.dev/go/service/schema/enums"
	"hpapp.yssk22.dev/go/service/schema/jsonfields"
	"hpapp.yssk22.dev/go/service/scraping"
	"hpapp.yssk22.dev/go/system/settings"
	"hpapp.yssk22.dev/go/system/storage"
)

var (
	BucketName = settings.NewString("service.helloproject.blob.bucket_name", "hpblob.hpapp.yssk22.dev")
)

// GetStoragePathFromUrl returns a storage path from a blob source URL.
func GetStoragePathFromUrl(ctx context.Context, sourceUrl string) string {
	bk := settings.GetX(ctx, BucketName)
	urlObj := assert.X(url.Parse(sourceUrl))
	return fmt.Sprintf("%s/%s%s", bk, urlObj.Host, urlObj.EscapedPath())
}

func GetFaceStoragePath(storagePath string, i int) string {
	extName := filepath.Ext(storagePath)
	return fmt.Sprintf("%s.face%d%s", strings.TrimRight(storagePath, extName), i, extName)
}

func Get(ctx context.Context, sourceUrl string) (*ent.HPBlob, error) {
	return entutil.NewClient(ctx).HPBlob.Query().Where(hpblob.SourceURLEQ(sourceUrl)).First(ctx)
}

type jsonMediaOption struct {
	useStorage     bool
	skipIfNotReady bool
}

type JsonMediaOption func(*jsonMediaOption)

func JsonMediaUseStorage(v bool) JsonMediaOption {
	return func(o *jsonMediaOption) {
		o.useStorage = v
	}
}

func JsonMediaSkipIfNotReady(v bool) JsonMediaOption {
	return func(o *jsonMediaOption) {
		o.skipIfNotReady = v
	}
}

// GetJsonMediaList returns a list of jsonfields.Media from a list of blobs
func GetJsonMediaList(ctx context.Context, blobs []*ent.HPBlob, options ...JsonMediaOption) []jsonfields.Media {
	o := &jsonMediaOption{
		useStorage:     false,
		skipIfNotReady: false,
	}
	for _, opt := range options {
		opt(o)
	}
	if o.useStorage && o.skipIfNotReady {
		blobs, _ = slice.Filter(blobs, func(i int, b *ent.HPBlob) (bool, error) {
			return b.Status == enums.HPBlobStatusReadyToHost, nil
		})
	}
	return assert.X(slice.Map(blobs, func(i int, b *ent.HPBlob) (jsonfields.Media, error) {
		m := jsonfields.Media{
			Url:    b.SourceURL,
			BlobID: b.ID,
			Type:   b.Type,
			Width:  b.Width,
			Height: b.Height,
		}
		if b.Thumbnail != nil {
			m.ThumbnailUrl = b.Thumbnail.SourceImageURL
			m.ThumbnailWidth = b.Thumbnail.Width
			m.ThumbnailHeight = b.Thumbnail.Height
		}
		if !o.useStorage {
			return m, nil
		}
		var ok bool
		m.Url, ok = storage.FromContext(ctx).GetPublicURL(ctx, b.StoragePath)
		if !ok {
			return m, fmt.Errorf("storage path (%s) is not avaibale for public URL", b.StoragePath)
		}
		if b.Thumbnail != nil {
			m.ThumbnailUrl, ok = storage.FromContext(ctx).GetPublicURL(ctx, b.Thumbnail.StoragePath)
			if !ok {
				return m, fmt.Errorf("storage path (%s) is not avaibale for public URL", b.Thumbnail.StoragePath)
			}
		}
		return m, nil
	}))
}

func ScrapeFromBlob[T any](ctx context.Context, entblob *ent.HPBlob, scaper scraping.Scraper[T]) (*T, error) {
	reader, err := storage.FromContext(ctx).OpenForRead(ctx, entblob.StoragePath)
	if err != nil {
		return nil, err
	}
	defer reader.Close()
	return scaper.Scrape(ctx, reader)
}
