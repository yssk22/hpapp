package extuser

import (
	"fmt"
	"sort"

	"github.com/spf13/cobra"
	"hpapp.yssk22.dev/go/foundation/cli"
	"hpapp.yssk22.dev/go/foundation/object"
)

const AuthFilePath = "./data/localauth.json"

func Command() *cobra.Command {
	authFile, err := LoadAuthFile(AuthFilePath)
	if err != nil {
		panic(err)
	}

	cmd := cobra.Command{
		Use:   "localauth",
		Short: "manage local authentication provider",
	}
	addAuthUser := cobra.Command{
		Use:   "generate",
		Short: "generate a new user",
		RunE: func(cmd *cobra.Command, args []string) error {
			token := authFile.AddUser()
			if err := authFile.Save(AuthFilePath); err != nil {
				return err
			}
			fmt.Printf("a new user is generated: %s\n", token)
			return nil
		},
	}
	listAuthUsers := cobra.Command{
		Use:   "list",
		Short: "list all users",
		RunE: func(cmd *cobra.Command, args []string) error {
			w := cli.NewTableWriter([]string{"token", "uid"})
			tokens := object.Keys(authFile.Users)
			sort.Strings(tokens)
			for _, t := range tokens {
				w.WriteRow([]string{t, authFile.Users[t]})
			}
			w.Flush()
			return nil
		},
	}
	resetAuthUsers := cobra.Command{
		Use:   "reset",
		Short: "reset all users",
		RunE: func(cmd *cobra.Command, args []string) error {
			if !cli.Confirm("Are you sure to remove all users?") {
				fmt.Println("canceled")
				return nil
			}
			authFile.Reset()
			if err := authFile.Save(AuthFilePath); err != nil {
				return err
			}
			fmt.Printf("all users are removed\n")
			return nil
		},
	}
	removeAuthUser := cobra.Command{
		Use:   "remove",
		Short: "remove a user",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			if !cli.Confirm(fmt.Sprintf("Are you sure to remove the user %s?", args[0])) {
				fmt.Println("canceled")
				return nil
			}
			authFile.RemoveUser(args[0])
			if err := authFile.Save(AuthFilePath); err != nil {
				return err
			}
			fmt.Printf("a user is removed\n")
			return nil
		},
	}
	cmd.AddCommand(&addAuthUser, &resetAuthUsers, &removeAuthUser, &listAuthUsers)
	return &cmd
}
