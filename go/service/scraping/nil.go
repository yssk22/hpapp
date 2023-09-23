package scraping

import (
	"context"
	"io"
)

type nilScraper[T any] struct {
}

var nilScraperInstance = &nilScraper[int64]{}

// NewNilScraper returns a Scraper implemenation that doesn't do anything but just reading the reader and reports the number of bytes read.
func NewNilScraper(ctx context.Context) Scraper[int64] {
	return nilScraperInstance
}

func (is *nilScraper[T]) Scrape(ctx context.Context, r io.Reader) (*int64, error) {
	var bytesRead int64
	buff := make([]byte, 65536)
	for {
		n, err := r.Read(buff)
		bytesRead += int64(n)
		if err != nil {
			if err == io.EOF {
				return &bytesRead, nil
			}
			return &bytesRead, err
		}
	}
}
