package database

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"
	"github.com/yssk22/hpapp/go/foundation/cli"
)

const (
	DatabasePath = "./data/helloproject.db"
)

func Command() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "db",
		Short: "Local SQLite3  management",
	}
	clear := &cobra.Command{
		Use:   "clear",
		Short: "Database management",
		RunE: func(cmd *cobra.Command, args []string) error {
			path, _ := filepath.Abs(DatabasePath)
			if cli.Confirm(fmt.Sprintf("Are you sure to reset the database (%s)?", path)) {
				os.RemoveAll(DatabasePath)
			}
			fmt.Println("database removed, please run `go run ./cmd/admin/ ent productionize` again")
			return nil
		},
	}
	cmd.AddCommand(clear)
	return cmd
}
