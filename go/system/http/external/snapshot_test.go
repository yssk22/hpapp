package external

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"testing"

	"github.com/yssk22/hpapp/go/foundation/assert"
)

func TestSnapshot(t *testing.T) {
	a := assert.NewTestAssert(t)
	server := assert.X(UseLocalServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("x-my-header", "header-value")
		w.WriteHeader(201)
		_, err := w.Write([]byte("mizuki fukumura"))
		a.Nil(err)
	})))
	defer server.Close()
	baseDir := filepath.Join("testdata", "snapshot")
	a.Nil(os.RemoveAll(baseDir))

	client := Snapshot(baseDir, http.DefaultClient)
	resp, err := client.Get(fmt.Sprintf("http://%s/", server.Addr))
	a.Nil(err)
	defer os.RemoveAll(baseDir)
	defer resp.Body.Close()

	content, err := ioutil.ReadAll(resp.Body)
	a.Nil(err)
	a.Equals("mizuki fukumura", string(content))
	// metadata file should be created
	metadatajson, err := os.ReadFile(filepath.Join(baseDir, fmt.Sprintf("%s/index.html.metadata.json", server.Addr)))
	a.Nil(err)
	var metadata snapshotMetadata
	a.Nil(json.Unmarshal(metadatajson, &metadata))
	a.Equals(201, metadata.StatusCode)
	a.Equals("header-value", metadata.Header["X-My-Header"][0])
}
