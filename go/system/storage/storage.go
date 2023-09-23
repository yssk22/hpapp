package storage

import (
	"context"
	"io"
	"io/ioutil"
)

// Storage is an abstract interface to read and write the object
type Storage interface {
	Exists(context.Context, string) bool
	OpenForRead(context.Context, string) (io.ReadSeekCloser, error)
	OpenForWrite(context.Context, string) (io.WriteCloser, error)
	Delete(context.Context, string) error
	Attrs(context.Context, string) (*Attrs, error)

	GetPublicURL(context.Context, string) (string, bool)
}

type Attrs struct {
	Size        int64
	ContentType *string
}

type contextStorageKey struct{}

var ctxStorageKey = contextStorageKey{}

func WithStorage(ctx context.Context, s Storage) context.Context {
	return context.WithValue(ctx, ctxStorageKey, s)
}

func FromContext(ctx context.Context) Storage {
	return ctx.Value(ctxStorageKey).(Storage)
}

func ReadAll(ctx context.Context, key string) ([]byte, error) {
	s := FromContext(ctx)
	r, err := s.OpenForRead(ctx, key)
	if err != nil {
		return nil, err
	}
	defer r.Close()
	return ioutil.ReadAll(r)
}
