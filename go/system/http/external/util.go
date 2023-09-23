package external

import (
	"net"
	"net/http"
)

// UseStubServer launches a stub server configured by handler
// and execute test function f.
func UseLocalServer(handler http.Handler) (*http.Server, error) {
	server := &http.Server{} //nolint:gosec // we use this server for testing purpose only.
	listener, err := net.Listen("tcp", "localhost:0")
	if err != nil {
		return nil, err
	}
	server.Addr = listener.Addr().String()
	server.Handler = handler
	go func() {
		err := server.Serve(listener)
		if err != nil && err != http.ErrServerClosed {
			panic(err)
		}
	}()
	return server, nil
}
