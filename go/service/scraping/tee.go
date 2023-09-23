package scraping

import (
	"context"
	"io"

	"github.com/yssk22/hpapp/go/system/storage"
)

// NewStorageTeeScraper returns a new scraper that runs inner scraper while the content is copied to storage.
func NewStorageTeeScraper[T any](path string, inner Scraper[T]) (Scraper[T], error) {
	return &teeScraper[T]{
		path:  path,
		inner: inner,
	}, nil
}

type teeScraper[T any] struct {
	path  string
	inner Scraper[T]
}

func (s *teeScraper[T]) Scrape(ctx context.Context, r io.Reader) (*T, error) {
	st := storage.FromContext(ctx)
	w, err := st.OpenForWrite(ctx, s.path)
	if err != nil {
		return nil, err
	}
	defer w.Close()
	return s.inner.Scrape(ctx, io.TeeReader(r, w))
}
