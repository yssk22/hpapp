package scraping

import (
	"context"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"

	"hpapp.yssk22.dev/go/foundation/object"
	"hpapp.yssk22.dev/go/system/http/external"
)

// ErrHttp is aservice error when fetch fails with non-200 code
type ErrHttp struct {
	Response *http.Response
	Content  []byte
	IOError  *string
}

func (e *ErrHttp) Error() string {
	return fmt.Sprintf("requested URL returns unsuccessful http status code: %d", e.Response.StatusCode)
}

func (e *ErrHttp) DoNotWrap() {}

// HttpOption sets fetcher options for http
type HttpOption func(*httpFetcher)

// WithHttpClient to set http.Client to fetch
func WithHttpClient(c *http.Client) HttpOption {
	return func(f *httpFetcher) {
		f.client = c
	}
}

// WithHttpHeader to set a request header to fetch
func WithHttpHeader(key string, value string) HttpOption {
	return func(f *httpFetcher) {
		f.header.Add(key, value)
	}
}

// httpFetcher is an implementation to fetch a content from an url.
type httpFetcher struct {
	url    string
	client *http.Client
	header http.Header
}

// NewHTTPFetcher returns a new *HTTPFetcher for the given url with http.Client.
// `client`` can be nil, then http.DefaultClient is used.
func NewHTTPFetcher(ctx context.Context, url string, options ...HttpOption) Fetcher {
	f := &httpFetcher{
		url:    url,
		client: external.FromContext(ctx),
		header: make(http.Header),
	}
	for _, o := range options {
		o(f)
	}
	return f
}

// Fetch implements Fetcher#Fetch
func (f *httpFetcher) Fetch(ctx context.Context) (io.Reader, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", f.url, nil)
	if err != nil {
		return nil, err
	}
	req.Header = f.header.Clone()
	resp, err := f.client.Do(req)
	if err != nil {
		return nil, err
	}
	if resp.StatusCode != 200 {
		defer resp.Body.Close()
		buff, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			return nil, &ErrHttp{Response: resp, Content: buff, IOError: object.Nullable(err.Error())}
		}
		return nil, &ErrHttp{Response: resp, Content: buff, IOError: nil}
	}
	return resp.Body, nil
}

func IsHttpStatusError(err error, code int) bool {
	if httperr, ok := err.(*ErrHttp); ok {
		return httperr.Response.StatusCode == code
	}
	return false
}
