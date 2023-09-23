package scraping

import (
	"context"
	"io"
)

// Fetcher is an interface to get a raw resource for crawled targed.
type Fetcher interface {
	Fetch(context.Context) (io.Reader, error)
}

// Scraper is an interface to scrape a content
type Scraper[T any] interface {
	Scrape(ctx context.Context, r io.Reader) (*T, error)
}

// ScraperFunc is a function wrapper for Scraper interface
type ScraperFunc[T any] func(ctx context.Context, r io.Reader) (*T, error)

// Scrape implements Scraper#Scrape
func (f ScraperFunc[T]) Scrape(ctx context.Context, r io.Reader) (*T, error) {
	return f(ctx, r)
}

// Scrape execute the fetcher and pass the content to the scraper to scrape
func Scrape[T any](ctx context.Context, fetcher Fetcher, scraper Scraper[T]) (*T, error) {
	content, err := fetcher.Fetch(ctx)
	if err != nil {
		return nil, err
	}
	if closer, ok := content.(io.Closer); ok {
		defer closer.Close()
	}
	return scraper.Scrape(ctx, content)
}
