package external

import (
	"bytes"
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/system/slog"
)

// Snapshot returns *http.Client that creates snapshot files at {basedir}/{domain}/{path}
// (or {basedir}/{domain}/{md5 of path} if path is too long) if the snapshot file doesn't exist yet.
// if exists, it emulates the HTTP response form the file.
//
// This client can be utilized during testing. When you create a test that use external http requests,
// first run should be done on your machine to generate snapshot files and commit these files to the repository
// so CI (and other developers) don't have to make actual http requests to the external sites.
func Snapshot(basedir string, c *http.Client) *http.Client {
	s := &snapshot{
		basedir: basedir,
		base:    c.Transport,
	}
	return Wrap(c, s)
}

type snapshot struct {
	basedir string
	base    http.RoundTripper
}

func (r *snapshot) RoundTrip(req *http.Request) (*http.Response, error) {
	path := req.URL.Path
	if strings.HasSuffix(path, "/") {
		path = fmt.Sprintf("%s/index.html", path)
	}
	ext := filepath.Ext(filepath.Base(path))
	if req.URL.RawQuery != "" {
		path = fmt.Sprintf("%s?%s", path, req.URL.RawQuery)
	}
	path = filepath.Join(r.basedir, req.URL.Host, path)
	// linux filesytem doesn't allow file names longer than 255 bytes so
	// we should use SHA256 version of the path to avoid file system errors.
	// This doesn't solve the problem completely if host is too long or basedir is to long. but it's good enough for now.
	if len(path) > 254 {
		pathHash := sha256.Sum256([]byte(req.URL.Path))
		path = filepath.Join(r.basedir, req.URL.Host, fmt.Sprintf("%x.%s", pathHash[:], ext))
	}
	// if the snapshot file exists, use it
	resp, err := r.createResponseFromFile(path)
	if err == nil {
		resp.Request = req
		slog.Debug(req.Context(),
			fmt.Sprintf("using a snapshot reponse file for %s", req.URL.String()),
			slog.Name("system.http.external.snapshot"),
			slog.Attribute("path", path),
		)
		return resp, nil
	}
	// make a real http request to generate a snapshot file
	slog.Debug(req.Context(),
		fmt.Sprintf("making external call to %s", req.URL.String()),
		slog.Name("system.http.external.snapshot"),
	)
	rt := r.base
	if rt == nil {
		rt = http.DefaultTransport
	}
	resp, err = rt.RoundTrip(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	generateSnapshotFile(resp, path)
	resp, err = r.createResponseFromFile(path)
	if err == nil {
		resp.Request = req
	}
	return resp, err
}

type snapshotMetadata struct {
	StatusCode  int                 `json:"status_code"`
	Status      string              `json:"status"`
	Header      map[string][]string `json:"header"`
	ContentPath string              `json:"content_path"`
}

func generateSnapshotFile(resp *http.Response, path string) {
	// during generation, it may panic if there are any IO errors due to the file system.

	// create a snapshot metadata json file.
	metadataPath := fmt.Sprintf("%s.metadata.json", path)
	dirpath := filepath.Dir(path)
	jsoncontent := assert.X(json.MarshalIndent(&snapshotMetadata{
		StatusCode:  resp.StatusCode,
		Status:      resp.Status,
		Header:      resp.Header,
		ContentPath: path,
	}, "", "\t"))
	assert.Nil(os.MkdirAll(dirpath, 0755))
	metadataFile := assert.X(os.Create(metadataPath))
	defer metadataFile.Close()
	assert.X(metadataFile.Write(jsoncontent))

	// create a snapshot content file
	contentFile := assert.X(os.Create(path))
	defer contentFile.Close()
	assert.X(io.Copy(contentFile, resp.Body))
}

func (r *snapshot) createResponseFromFile(path string) (*http.Response, error) {
	metadataPath := fmt.Sprintf("%s.metadata.json", path)
	jsoncontent, err := ioutil.ReadFile(metadataPath)
	if err != nil {
		return nil, err
	}
	var metadata snapshotMetadata
	if err := json.Unmarshal(jsoncontent, &metadata); err != nil {
		return nil, err
	}
	stat, err := os.Stat(metadata.ContentPath)
	if err != nil {
		return nil, err
	}
	return &http.Response{
		StatusCode:    metadata.StatusCode,
		Status:        metadata.Status,
		Close:         false,
		Header:        make(map[string][]string),
		ContentLength: stat.Size(),
		Body:          assert.X(os.Open(metadata.ContentPath)),
		// we don't fully support following fields.
		Proto:        "HTTP/1.1", // e.g. "HTTP/1.0"
		ProtoMajor:   1,
		ProtoMinor:   1,
		Uncompressed: true,
		TLS:          nil,
	}, nil
}

type SnapshotResponseOption func(r *http.Response)

func HttpStatusCode(statusCode int) SnapshotResponseOption {
	return func(r *http.Response) {
		r.StatusCode = statusCode
	}
}

func HttpStatus(status string) SnapshotResponseOption {
	return func(r *http.Response) {
		r.Status = status
	}
}

func Content(content []byte) SnapshotResponseOption {
	return func(r *http.Response) {
		r.ContentLength = int64(len(content))
		r.Body = io.NopCloser(bytes.NewBuffer(content))
	}
}

func ContentFromFile(path string) SnapshotResponseOption {
	return func(r *http.Response) {
		f := assert.X(os.Open(path))
		r.Body = f
	}
}

func CreateHttpSnapshot(path string, options ...SnapshotResponseOption) {
	resp := &http.Response{
		StatusCode:    200,
		Status:        "OK",
		Close:         false,
		Header:        make(map[string][]string),
		ContentLength: 0,
		Body:          io.NopCloser(bytes.NewBuffer([]byte{})),
		// we don't fully support following fields.
		Proto:        "HTTP/1.1", // e.g. "HTTP/1.0"
		ProtoMajor:   1,
		ProtoMinor:   1,
		Uncompressed: true,
		TLS:          nil,
	}
	for _, opt := range options {
		opt(resp)
	}
	defer resp.Body.Close()
	generateSnapshotFile(resp, path)
}
