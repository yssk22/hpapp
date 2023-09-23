package auth

import (
	"github.com/spf13/cobra"
	"hpapp.yssk22.dev/go/service/auth/extuser"
)

const AuthFilePath = "./data/localauth.json"

func Command() *cobra.Command {
	cmd := cobra.Command{
		Use:   "auth",
		Short: "manage authentication",
	}
	cmd.AddCommand(extuser.Command())
	return &cmd
}
