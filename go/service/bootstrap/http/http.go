package http

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path"
	"syscall"
	"time"

	"github.com/99designs/gqlgen/graphql"

	"hpapp.yssk22.dev/go/service/auth/appuser/oauth1"
	"hpapp.yssk22.dev/go/service/bootstrap/config"
	"hpapp.yssk22.dev/go/service/bootstrap/http/middleware"
	"hpapp.yssk22.dev/go/service/bootstrap/http/task"
	"hpapp.yssk22.dev/go/system/environment"

	_ "hpapp.yssk22.dev/go/service/ent/runtime"
)

type httpConfig struct {
	GraphQLSchemas        map[string]graphql.ExecutableSchema
	GraphQLPlaygroundPath string
	OAuth1Config          *oauth1.Config
	services              []config.Service
}

type HttpOption func(cfg *httpConfig)

func WithService(s ...config.Service) HttpOption {
	return func(cfg *httpConfig) {
		cfg.services = append(cfg.services, s...)
	}
}

// RunHttpServer runs a http server instance
func RunHttpServer(e environment.Environment, options ...HttpOption) {
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGHUP, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT)
	go func() {
		port := os.Getenv("PORT")
		if port == "" {
			port = "8080"
		}
		cfg := &httpConfig{
			GraphQLSchemas:        make(map[string]graphql.ExecutableSchema),
			GraphQLPlaygroundPath: "playground",
		}
		for _, o := range options {
			o(cfg)
		}
		handler := cfg.GenHandler(e)
		server := &http.Server{
			Addr:              fmt.Sprintf(":%s", port),
			ReadHeaderTimeout: 10 * time.Second,
			Handler:           handler,
		}
		fmt.Printf("http server started on %s\n", port)
		err := server.ListenAndServe()
		if err != nil {
			log.Fatal(err) //nolint:gocritic // we want to show an error on the console anyway as slog sink may not be available
		}
	}()
	fmt.Println("Ctrl-C to quit")
	<-quit
	fmt.Println("quiting")
}

func (cfg *httpConfig) GenHandler(e environment.Environment) http.Handler {
	mux := http.NewServeMux()
	for p, s := range cfg.GraphQLSchemas {
		endpoint := path.Join("/", p)
		mux.Handle(endpoint, genGraphQLHandler(s))
		if cfg.GraphQLPlaygroundPath != "" {
			mux.Handle(path.Join(endpoint, cfg.GraphQLPlaygroundPath), genGraphQLPlaygroundHandler(endpoint))
		}
	}
	if cfg.OAuth1Config != nil {
		cfg.OAuth1Config.RegisterMux(mux)
	}

	var middleware []middleware.HttpMiddleware
	for _, s := range cfg.services {
		tasks := s.Tasks()
		for _, t := range tasks {
			mux.Handle(t.Path(), t)
		}
		middleware = append(middleware, s.Middleware()...)
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := environment.WithContext(r.Context(), e)
		ctx = task.WithRequestHeader(ctx, r.Header)
		for _, m := range middleware {
			result := m.Process(r.WithContext(ctx))
			if result.Code >= 400 {
				http.Error(w, result.Message, result.Code)
				return
			}
			ctx = result.Context
		}
		mux.ServeHTTP(w, r.WithContext(ctx))
	})
}
