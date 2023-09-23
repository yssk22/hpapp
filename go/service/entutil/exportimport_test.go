package entutil

import (
	"context"
	"path/filepath"
	"testing"

	"github.com/yssk22/hpapp/go/foundation/assert"
)

// TestExportAndImport is defined in ./test directory to avoid cyclic import

func TestFindExportFile(t *testing.T) {
	a := assert.NewTestAssert(t)
	_, err := FindExportFile(context.Background(), ".", filepath.Join("data", "hp_artists.csv"))
	a.Nil(err)

	_, err = FindExportFile(context.Background(), ".", filepath.Join("xxxxxx"))
	a.NotNil(err)
	a.Equals(ErrExportFileNotFound, err)
}
