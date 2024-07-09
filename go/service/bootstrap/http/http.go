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
	"github.com/spf13/cobra"

	appgraphql "github.com/yssk22/hpapp/go/graphql"

	"github.com/yssk22/hpapp/go/service/auth/appuser/oauth1"
	"github.com/yssk22/hpapp/go/service/bootstrap/config"
	"github.com/yssk22/hpapp/go/service/bootstrap/http/middleware"
	"github.com/yssk22/hpapp/go/service/bootstrap/http/task"
	"github.com/yssk22/hpapp/go/system/environment"

	_ "github.com/yssk22/hpapp/go/service/ent/runtime"
)

type httpConfig struct {
	GraphQLSchemas        map[string]graphql.ExecutableSchema
	GraphQLPlaygroundPath string
	OAuth1Config          *oauth1.Config
	EnableCORS            bool
	services              []config.Service
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
		// CORS
		if cfg.EnableCORS {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Hpapp-Device-Info, X-Hpapp-Version, X-Hpapp-Expo-Version")
		}
		mux.ServeHTTP(w, r.WithContext(ctx))
	})
}

func Command(e environment.Environment, services ...config.Service) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "httpserver",
		Short: "Run HTTP Server",
		RunE: func(cmd *cobra.Command, args []string) error {
			enableCORS, _ := cmd.Flags().GetBool("enable-cors")
			quit := make(chan os.Signal, 1)
			signal.Notify(quit, syscall.SIGHUP, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT)
			go func() {
				port := os.Getenv("PORT")
				if port == "" {
					port = "8080"
				}
				cfg := &httpConfig{
					GraphQLSchemas: map[string]graphql.ExecutableSchema{
						"/graphql/v3": appgraphql.V3(),
					},
					GraphQLPlaygroundPath: "playground",
					OAuth1Config:          oauth1.NewConfig("oauth1", oauth1.NewTwitterOAuth()),
					EnableCORS:            enableCORS,
					services:              services,
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
			return nil
		},
	}
	cmd.Flags().Bool("enable-cors", false, "enable CORS")
	return cmd
}
