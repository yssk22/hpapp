package config

import (
	"github.com/spf13/cobra"
	"hpapp.yssk22.dev/go/service/bootstrap/http/middleware"
	"hpapp.yssk22.dev/go/service/bootstrap/http/task"
)

// Service is an interface to configure a service
type Service interface {
	Command() *cobra.Command
	Middleware() []middleware.HttpMiddleware
	Tasks() []task.Task
}
