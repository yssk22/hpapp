package blob

import (
	"context"
	"fmt"
	"image"
	"io"

	_ "image/jpeg"
	_ "image/png"

	"github.com/abema/go-mp4"
	"github.com/sunfish-shogi/bufseekio"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/schema/enums"
	"github.com/yssk22/hpapp/go/service/schema/jsonfields"
	"github.com/yssk22/hpapp/go/service/scraping"
	"github.com/yssk22/hpapp/go/system/slog"
	"github.com/yssk22/hpapp/go/system/storage"
)

type VideoProcessor func(context.Context, *ent.HPBlobUpdateOne, *ent.HPBlob, io.Reader, slog.Attributes) error

func (p VideoProcessor) GetType() enums.HPBlobType {
	return enums.HPBlobTypeVideo
}

func (p VideoProcessor) Process(ctx context.Context, update *ent.HPBlobUpdateOne, b *ent.HPBlob, reader io.Reader, log slog.Attributes) error {
	return p(ctx, update, b, reader, log)
}

// videoProcessorProbe is a processor to store video metadata (height, width, and length)
var videoProcessorProbe = VideoProcessor(func(ctx context.Context, update *ent.HPBlobUpdateOne, b *ent.HPBlob, reader io.Reader, log slog.Attributes) error {
	if b.Height > 0 && b.Width > 0 {
		// skip
		return nil
	}
	readSeeker, ok := reader.(io.ReadSeeker)
	if !ok {
		return fmt.Errorf("invalid reader")
	}
	probe, err := mp4.Probe(bufseekio.NewReadSeeker(readSeeker, 64*1024, 4))
	if err != nil {
		return fmt.Errorf("cannot probe the video binary: %v", err)
	}
	update.SetDurationSeconds(float64(probe.Duration) / float64(probe.Timescale))
	for _, t := range probe.Tracks {
		if t.AVC.Width > 0 && t.AVC.Height > 0 {
			update.SetWidth(int(t.AVC.Width))
			update.SetHeight(int(t.AVC.Height))
			return nil
		}
	}
	return nil
})

// videoProcessorThumbnail is a processor to store thunbnail image of a video on the storage for clients to use.
var videoProcessorThumbnail = VideoProcessor(func(ctx context.Context, update *ent.HPBlobUpdateOne, b *ent.HPBlob, _ io.Reader, log slog.Attributes) error {
	if b.Thumbnail == nil {
		// no thumbnail is defined
		// TODO: generate thunbnail from the binary
		return nil
	}
	if b.Thumbnail.Width > 0 && b.Thumbnail.Height > 0 {
		// skip
		return nil
	}
	sc, err := scraping.NewStorageTeeScraper(b.Thumbnail.StoragePath, scraping.NewNilScraper(ctx))
	if err != nil {
		return fmt.Errorf("cannot create thumbnail scraper: %w", err)
	}
	bytesRead, err := scraping.Scrape(ctx, scraping.NewHTTPFetcher(
		ctx,
		b.Thumbnail.SourceImageURL,
	), sc)
	if err != nil {
		return fmt.Errorf("cannot download video thumbnail: %v", err)
	}
	if bytesRead != nil && *bytesRead == 0 {
		return fmt.Errorf("no bytes thumbnail downloaded")
	}
	// width and height should be same as the video so
	// try to get the width and height from the existing record OR the update mutation
	width := b.Width
	height := b.Height
	if height == 0 || width == 0 {
		width, _ = update.Mutation().Width()
		height, _ = update.Mutation().Height()
	}
	// try to get the width and height from the image binary
	if height == 0 || width == 0 {
		r, err := storage.FromContext(ctx).OpenForRead(ctx, b.Thumbnail.StoragePath)
		if err == nil {
			img, _, err := image.DecodeConfig(r)
			if err != nil {
				return fmt.Errorf("cannot decode thumbnail image: %v", err)
			}
			width = img.Width
			height = img.Height
		} else {
			return fmt.Errorf("cannot open thumbnail image: %v", err)
		}
	}
	update.SetThumbnail(&jsonfields.HPBlobThumbnail{
		StoragePath:    b.Thumbnail.StoragePath,
		SourceImageURL: b.Thumbnail.SourceImageURL,
		Width:          width,
		Height:         height,
	})
	return nil
})
