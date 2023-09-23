package entutil

import (
	"fmt"
	"os"
	"path/filepath"

	"entgo.io/ent/dialect/sql/schema"
	"github.com/spf13/cobra"
	"hpapp.yssk22.dev/go/foundation/cli"
	"hpapp.yssk22.dev/go/foundation/slice"
	"hpapp.yssk22.dev/go/service/ent/migrate"
	"hpapp.yssk22.dev/go/system/database"
)

var cmdExport = &cobra.Command{
	Use:   "export",
	Short: "Export data",
	Args:  cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		absPath, err := filepath.Abs(args[0])
		if err != nil {
			return err
		}
		dir, err := os.Stat(absPath)
		if err != nil {
			return err
		}
		if !dir.IsDir() {
			return fmt.Errorf("%s must be directory", absPath)
		}

		var tables = []string{
			"hp_artists",
			"hp_assets",
			"hp_members",
			"hp_member_assets",
		}
		_, err = slice.MapAsync(tables, func(i int, t string) (any, error) {
			file, err := os.OpenFile(filepath.Join(absPath, fmt.Sprintf("%s.csv", t)), os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0644)
			if err != nil {
				return nil, err
			}
			defer file.Close()
			return nil, ExportTable(cmd.Context(), file, t)
		})
		return err
	},
}

var cmdImport = &cobra.Command{
	Use:   "import",
	Short: "Import data",
	Args:  cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		absPath, err := filepath.Abs(args[0])
		if err != nil {
			return err
		}
		dir, err := os.Stat(absPath)
		if err != nil {
			return err
		}
		if !dir.IsDir() {
			return fmt.Errorf("%s must be directory", absPath)
		}

		var tables = []string{
			"hp_artists",
			"hp_assets",
			"hp_members",
			"hp_member_assets",
		}
		_, err = slice.MapAsync(tables, func(i int, t string) (any, error) {
			file, err := os.OpenFile(filepath.Join(absPath, fmt.Sprintf("%s.csv", t)), os.O_RDONLY, 0644)
			if err != nil {
				return nil, err
			}
			defer file.Close()
			return nil, ImportTable(cmd.Context(), file, t)
		})
		return err
	},
}

var cmdProductionize = &cobra.Command{
	Use:   "productionize",
	Short: "run a migration script on production",
	Args:  cobra.ExactArgs(0),
	RunE: func(cmd *cobra.Command, args []string) error {
		ctx := cmd.Context()
		entclient := NewClient(ctx)
		options := []schema.MigrateOption{
			migrate.WithDropIndex(true),
			migrate.WithDropColumn(true),
			migrate.WithGlobalUniqueID(true),
			migrate.WithForeignKeys(true),
		}
		if err := entclient.Schema.WriteTo(ctx, os.Stdout, options...); err != nil {
			return fmt.Errorf("cannot dump schema changes: %w", err)
		}
		fmt.Println("-------------------------------------------------")
		db := database.FromContext(ctx)
		fmt.Println("Target Database", db.Name)
		if !cli.Confirm("Are you sure to run SQL above?") {
			return fmt.Errorf("canceled")
		}
		if err := entclient.Schema.Create(ctx, options...); err != nil {
			return fmt.Errorf("cannot run schema changesL %w", err)
		}
		fmt.Println("done")
		return nil
	},
}
