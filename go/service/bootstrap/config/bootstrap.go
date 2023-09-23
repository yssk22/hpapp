package config

import (
	"github.com/spf13/cobra"
	"github.com/yssk22/hpapp/go/service/bootstrap/http/middleware"
	"github.com/yssk22/hpapp/go/service/bootstrap/http/task"
)

// Service is an interface to configure a service
type Service interface {
	Command() *cobra.Command
	Middleware() []middleware.HttpMiddleware
	Tasks() []task.Task
}
