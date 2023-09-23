package cli

import (
	"context"
	"fmt"

	"github.com/spf13/cobra"

	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/auth/client"
	"github.com/yssk22/hpapp/go/service/bootstrap/config"
	"github.com/yssk22/hpapp/go/service/bootstrap/http/task"
	"github.com/yssk22/hpapp/go/system/database"
	"github.com/yssk22/hpapp/go/system/environment"
	"github.com/yssk22/hpapp/go/system/http/s2s"
	"github.com/yssk22/hpapp/go/system/settings"

	_ "github.com/yssk22/hpapp/go/service/ent/runtime"
)

// RunCLI runs a cmmand
func RunCLI(e environment.Environment, services ...config.Service) {
	cmd := &cobra.Command{}
	cmd.AddCommand(settings.SettingsCommand())
	cmd.AddCommand(database.Command())
	for _, s := range services {
		scmd := s.Command()
		if scmd != nil {
			cmd.AddCommand(scmd)
		}
	}
	taskCmd := &cobra.Command{
		Use:   "tasks",
		Short: "Run a task",
	}
	for _, s := range services {
		for _, t := range s.Tasks() {
			taskCmd.AddCommand(taskCommand(t))
		}
	}
	cmd.AddCommand(taskCmd)

	// setup context and exec
	ctx := environment.WithContext(context.Background(), e)
	ctx = appuser.WithUser(ctx, appuser.SuperAdmin())
	ctx = client.WithClient(ctx, client.SuperAdmin())
	err := cmd.ExecuteContext(ctx)
	if err != nil {
		panic(err)
	}
}

func taskCommand(t task.Task) *cobra.Command {
	path := t.Path()
	cmd := &cobra.Command{
		Use:   path,
		Short: fmt.Sprintf("Execute %s task", path),
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()
			// TODO: construct payload and options from args.
			// TODO: flag to select localhost or else.
			var authorization string
			adminToken, err := appuser.GetSuperAdminToken(ctx)
			if err != nil {
				fmt.Println("no admin token is available:", err)
				fmt.Println("using anonymous task request")
			} else {
				fmt.Println("using super admin token")
				authorization = fmt.Sprintf("Bearer %s", adminToken)
			}
			client := s2s.NewLocalhost(authorization)
			return client.Request(ctx, path, nil, nil)
		},
	}
	return cmd
}
