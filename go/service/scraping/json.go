package scraping

import (
	"context"
	"encoding/json"
	"io"
)

// JSON returns a scraper for json contents to a typed struct
func JSON[T any]() Scraper[T] {
	return jsonScraper[T]{}
}

type jsonScraper[T any] struct{}

// Scrape implements Scraper#Scrape
func (f jsonScraper[T]) Scrape(ctx context.Context, r io.Reader) (*T, error) {
	var v T
	err := json.NewDecoder(r).Decode(&v)
	if err != nil {
		return nil, err
	}
	return &v, nil
}
