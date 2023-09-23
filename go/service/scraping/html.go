package scraping

import (
	"context"
	"io"
	"net/url"
	"strings"

	"github.com/PuerkitoBio/goquery"
	"hpapp.yssk22.dev/go/foundation/stringutil"
)

// HTMLHead is a struct for tags data under <head> in an html content
type HTMLHead struct {
	Title     string     `json:"title"`
	Canonical string     `json:"canonical"`
	Meta      url.Values `json:"meta"`
	Rel       url.Values `json:"rel"`
}

// HTML returns a scraper for html contents with a custom logic on top of goquery
func HTML[T any](f func(context.Context, *goquery.Document, *HTMLHead) (*T, error)) Scraper[T] {
	return htmlScraper[T](f)
}

type htmlScraper[T any] func(context.Context, *goquery.Document, *HTMLHead) (*T, error)

// Scrape implements Scraper#Scrape
func (f htmlScraper[T]) Scrape(ctx context.Context, r io.Reader) (*T, error) {
	doc, err := goquery.NewDocumentFromReader(r)
	if err != nil {
		return nil, err
	}
	head := &HTMLHead{
		Meta: url.Values(make(map[string][]string)),
	}
	head.Title = strings.TrimSpace(doc.Find("head title").Text())
	doc.Find("head meta").Each(func(i int, s *goquery.Selection) {
		key := stringutil.Or(s.AttrOr("name", ""), s.AttrOr("property", ""))
		value := s.AttrOr("content", "")
		if key != "" {
			head.Meta.Add(key, value)
			return
		}
	})
	doc.Find("head link").Each(func(i int, s *goquery.Selection) {
		key := s.AttrOr("rel", "")
		if key != "" {
			head.Meta.Add(key, s.AttrOr("href", ""))
			if key == "canonical" {
				head.Canonical = s.AttrOr("href", "")
			}
			return
		}
	})
	return f(ctx, doc, head)
}
