package external

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"
	"testing"
	"time"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"golang.org/x/time/rate"
)

func TestRateLimitter(t *testing.T) {
	a := assert.NewTestAssert(t)
	var numServerCalled = 0
	server := assert.X(UseLocalServer(http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		numServerCalled++
		assert.X(w.Write([]byte("This is stub server")))
	})))
	defer server.Close()

	serverURL := fmt.Sprintf("http://%s/", server.Addr)
	limit := 200 * time.Millisecond
	client := RateLimitter(context.Background(), http.DefaultClient, DomainRateConfig{
		DomainName: "127.0.0.1",
		R:          rate.Every(limit),
		B:          1,
	})
	n := time.Now() //nolint:gocritic // no clock context is available here
	for range make([]int, 5) {
		resp := assert.X(client.Get(serverURL))
		got := assert.X(ioutil.ReadAll(resp.Body))
		a.Equals("This is stub server", string(got))
	}
	a.Equals(5, numServerCalled)
	timeTaken := time.Since(n)
	a.OK(timeTaken > limit*4 && timeTaken < limit*6, "took: %s", timeTaken)
}
