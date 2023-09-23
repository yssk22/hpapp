package scraping

import (
	"context"
	"encoding/xml"
	"io"
	"time"
)

// RSS2Doc is a struct to represent RSS 2.0 document
type RSS2Doc struct {
	XMLName xml.Name     `xml:"rss"`
	Channel *RSS2Channel `xml:"channel"`
}

// RSS2Channel represents `rss>channel` doc.
type RSS2Channel struct {
	Title          string       `xml:"title"`
	Link           string       `xml:"link"`
	Description    string       `xml:"description"`
	Language       string       `xml:"language"`
	Copyright      string       `xml:"copyright"`
	ManagingEditor string       `xml:"managingEditor"`
	WebMaster      string       `xml:"webMaster"`
	Images         []*RSS2Image `xml:"images"`
	LastBuildDate  XMLTime      `xml:"lastBuildDate"`
	Category       string       `xml:"category"`
	Generator      string       `xml:"generator"`
	Items          []*RSS2Item  `xml:"item"`
}

// RSS2Image represents `rss>channel>image` doc.
type RSS2Image struct {
	URL    string `xml:"url"`
	Title  string `xml:"title"`
	Link   string `xml:"link"`
	Width  int64  `xml:"width"`
	Height int64  `xml:"height"`
}

// RSS2Item represents `rss>item` doc.
type RSS2Item struct {
	Title          string  `xml:"title"`
	Link           string  `xml:"link"`
	Description    string  `xml:"description"`
	Author         string  `xml:"author"`
	Category       string  `xml:"category"`
	Comments       string  `xml:"comments"`
	GUID           string  `xml:"guid"`
	PubDate        XMLTime `xml:"pubDate"`
	ContentEncoded string  `xml:"encoded"`
}

type rss2Scraper[T any] func(context.Context, *RSS2Doc) (*T, error)

// RSS2 returns a scraper for RSS2 with a custom logic on top of RSS2 structs
func RSS2[T any](f func(context.Context, *RSS2Doc) (*T, error)) Scraper[T] {
	return rss2Scraper[T](f)
}

// Scrape implements Scraper#Scrape
func (f rss2Scraper[T]) Scrape(ctx context.Context, r io.Reader) (*T, error) {
	decoder := xml.NewDecoder(r)
	var doc RSS2Doc
	err := decoder.Decode(&doc)
	if err != nil {
		return nil, err
	}
	return f(ctx, &doc)
}

var timeFormats = []string{
	time.RFC822,
	time.RFC822Z,
	time.RFC1123,
	time.RFC1123Z,
}

// XMLTime is an alias type for time.Time to unmarshal XML doc.
type XMLTime time.Time

// UnmarshalXML to implement xml unmarshalization
func (t *XMLTime) UnmarshalXML(d *xml.Decoder, start xml.StartElement) error {
	var v string
	if err := d.DecodeElement(&v, &start); err != nil {
		return err
	}
	var tt time.Time
	var err error
	for _, format := range timeFormats {
		tt, err = time.Parse(format, v)
		if err == nil {
			*t = XMLTime(tt)
			return nil
		}
	}
	return err
}
