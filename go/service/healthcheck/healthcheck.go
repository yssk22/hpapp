package healthcheck

import (
	"context"
	"fmt"

	"github.com/spf13/cobra"
	"github.com/yssk22/hpapp/go/service/bootstrap/config"
	"github.com/yssk22/hpapp/go/service/bootstrap/http/middleware"
	"github.com/yssk22/hpapp/go/service/bootstrap/http/task"
	"github.com/yssk22/hpapp/go/system/database"
)

// NewService returns a new Service for health check
func NewService() config.Service {
	return &healthCheck{}
}

type healthCheck struct{}

func (*healthCheck) Middleware() []middleware.HttpMiddleware {
	return nil
}

func (*healthCheck) Tasks() []task.Task {
	return []task.Task{
		task.NewTask("/healthcheck", task.NoParameter(), DefaultHealthCheck, task.AlwaysAllow[any]()),
	}
}

func (*healthCheck) Command() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "healthcheck",
		Short: "healthcheck utilities",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			err := DefaultHealthCheck(cmd.Context(), nil)
			if err != nil {
				return err
			}
			fmt.Println("OK")
			return nil
		},
	}
	return cmd
}

func DefaultHealthCheck(ctx context.Context, _ any) error {
	db := database.FromContext(ctx).DB
	err := db.PingContext(ctx)
	if err != nil {
		return err
	}
	return nil
}
