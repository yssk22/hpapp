package storage

import (
	"context"
	"fmt"
	"io"
	"strings"

	gcpstorage "cloud.google.com/go/storage"
)

type gcs struct {
	client *gcpstorage.Client
}

func NewGCS(client *gcpstorage.Client) (Storage, error) {
	return &gcs{
		client: client,
	}, nil
}

func (s *gcs) Exists(ctx context.Context, key string) bool {
	obj := s.getObject(ctx, key)
	_, err := obj.Attrs(ctx)
	return err == nil
}

func (s *gcs) Attrs(ctx context.Context, key string) (*Attrs, error) {
	obj := s.getObject(ctx, key)
	attrs, err := obj.Attrs(ctx)
	if err != nil {
		return nil, err
	}
	return &Attrs{
		Size:        attrs.Size,
		ContentType: &attrs.ContentType,
	}, nil
}

func (s *gcs) OpenForRead(ctx context.Context, key string) (io.ReadSeekCloser, error) {
	obj := s.getObject(ctx, key)
	attrs, err := obj.Attrs(ctx)
	if err != nil {
		return nil, err
	}
	return &gcsReaderWrapper{
		ctx:    ctx,
		handle: obj,
		size:   attrs.Size,
	}, nil
}

func (s *gcs) OpenForWrite(ctx context.Context, key string) (io.WriteCloser, error) {
	obj := s.getObject(ctx, key)
	return obj.NewWriter(ctx), nil
}

func (s *gcs) Delete(ctx context.Context, key string) error {
	obj := s.getObject(ctx, key)
	return obj.Delete(ctx)
}

func (f *gcs) GetPublicURL(ctx context.Context, key string) (string, bool) {
	return fmt.Sprintf("https://storage.googleapis.com/%s", key), true
}

func (s *gcs) getObject(ctx context.Context, key string) *gcpstorage.ObjectHandle {
	paths := strings.Split(key, "/")
	bucketName := paths[0]
	return s.client.Bucket(bucketName).Object(strings.Join(paths[1:], "/"))
}

// gcsReaderWrapper is an wrapper to gcpstorage.Reader to implement io.Seeker
type gcsReaderWrapper struct {
	ctx    context.Context
	handle *gcpstorage.ObjectHandle
	reader *gcpstorage.Reader
	offset int64
	size   int64
}

func (rsc *gcsReaderWrapper) Read(p []byte) (int, error) {
	if rsc.reader == nil {
		reader, err := rsc.handle.NewRangeReader(rsc.ctx, rsc.offset, rsc.size-rsc.offset)
		if err != nil {
			return 0, err
		}
		rsc.reader = reader
	}
	return rsc.reader.Read(p)
}

func (rsc *gcsReaderWrapper) Seek(offset int64, whence int) (int64, error) {
	var newOffset int64
	switch whence {
	case io.SeekStart:
		newOffset = offset
	case io.SeekCurrent:
		newOffset = rsc.offset + offset
	case io.SeekEnd:
		newOffset = rsc.size - offset
	}
	rsc.Close()
	rsc.reader = nil
	rsc.offset = newOffset
	return rsc.offset, nil
}

func (rsc *gcsReaderWrapper) Close() error {
	if rsc.reader != nil {
		return rsc.reader.Close()
	}
	return nil
}
