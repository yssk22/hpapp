package push

import (
	"strconv"

	"github.com/spf13/cobra"
	"github.com/yssk22/hpapp/go/foundation/cli"
	"github.com/yssk22/hpapp/go/service/bootstrap/config"
	"github.com/yssk22/hpapp/go/service/bootstrap/http/middleware"
	"github.com/yssk22/hpapp/go/service/bootstrap/http/task"
	"github.com/yssk22/hpapp/go/service/ent/user"
	"github.com/yssk22/hpapp/go/service/entutil"
)

type pushService struct {
}

func NewService() config.Service {
	return &pushService{}
}

func (*pushService) Middleware() []middleware.HttpMiddleware {
	return nil
}

func (s *pushService) Tasks() []task.Task {
	return []task.Task{}
}

func (s *pushService) Command() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "push",
		Short: "operate push infrastructure",
	}
	cmd.AddCommand(&cobra.Command{
		Use:   "list-tokens",
		Short: "list tokens for the specific user id",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()
			entclient := entutil.NewClient(ctx)
			uid, err := strconv.Atoi(args[0])
			if err != nil {
				return err
			}
			user, err := entclient.User.Query().Where(user.IDEQ(uid)).WithNotificationSettings().First(ctx)
			if err != nil {
				return err
			}
			w := cli.NewTableWriter([]string{"Token", "Slug"})
			for _, ns := range user.Edges.NotificationSettings {
				w.WriteRow([]string{
					ns.Token, ns.Slug,
				})
			}
			w.Flush()
			return nil
		},
	})
	return cmd
}
