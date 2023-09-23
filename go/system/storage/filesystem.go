package storage

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
)

// NewFileSystem returns a Storage object backed by the file system
func NewFileSystem(basePath string, baseUrl string) Storage {
	_, err := os.Stat(basePath)
	if err != nil && !os.IsNotExist(err) {
		panic(err)
	}
	if err = os.MkdirAll(basePath, 0755); err != nil {
		panic(err)
	}
	return &fileSystem{
		basePath: basePath,
		baseUrl:  baseUrl,
	}
}

type fileSystem struct {
	basePath string
	baseUrl  string
}

func (f *fileSystem) Exists(ctx context.Context, key string) bool {
	s, err := os.Stat(filepath.Join(f.basePath, f.normalizeKey(key)))
	if err != nil {
		return false
	}
	if s.IsDir() {
		return false
	}
	return true
}
func (f *fileSystem) OpenForRead(ctx context.Context, key string) (io.ReadSeekCloser, error) {
	return os.Open(filepath.Join(f.basePath, f.normalizeKey(key)))
}
func (f *fileSystem) OpenForWrite(ctx context.Context, key string) (io.WriteCloser, error) {
	path := filepath.Join(f.basePath, f.normalizeKey(key))
	err := os.MkdirAll(filepath.Dir(path), 0755)
	if err != nil {
		return nil, err
	}
	return os.OpenFile(filepath.Join(f.basePath, f.normalizeKey(key)), os.O_CREATE|os.O_TRUNC|os.O_WRONLY, 0644)
}

func (f *fileSystem) Delete(ctx context.Context, key string) error {
	return os.RemoveAll(filepath.Join(f.basePath, f.normalizeKey(key)))
}

func (f *fileSystem) Attrs(ctx context.Context, key string) (*Attrs, error) {
	path := filepath.Join(f.basePath, f.normalizeKey(key))
	stats, err := os.Stat(path)
	if err != nil {
		return nil, err
	}
	return &Attrs{
		Size: stats.Size(),
	}, nil
}

func (f *fileSystem) GetPublicURL(ctx context.Context, key string) (string, bool) {
	return fmt.Sprintf("%s/%s", f.baseUrl, key), true
}

func (f *fileSystem) normalizeKey(key string) string {
	if strings.HasSuffix(key, "/") {
		return fmt.Sprintf("%sindex", key)
	}
	return key
}
