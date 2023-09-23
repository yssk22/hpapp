package main

import (
	"context"
	"fmt"
	"os"

	"entgo.io/contrib/entgql"
	"entgo.io/ent/entc"
	"entgo.io/ent/entc/gen"
	"github.com/spf13/cobra"
)

// gen-ent schema-path ent-path graphql-path
func main() {
	cmd := &cobra.Command{
		Use:   "gen-ent",
		Short: "generate ent",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			ymlPath, err := cmd.Flags().GetString("gqlgen-config-path")
			if err != nil {
				return err
			}
			schemaPath, err := cmd.Flags().GetString("graphql-schema-path")
			if err != nil {
				return err
			}
			ex, err := entgql.NewExtension(
				entgql.WithConfigPath(ymlPath),
				entgql.WithSchemaGenerator(),
				entgql.WithRelaySpec(true),
				entgql.WithSchemaPath(schemaPath),
				// entgql.WithWhereInputs(true),
			)
			if err != nil {
				return fmt.Errorf("entgql error: %w", err)
			}
			// run entc
			schemaDir := args[0]
			targetDir := args[1]
			opts := []entc.Option{
				entc.FeatureNames("privacy", "sql/upsert", "schema/snapshot", "entql"),
				entc.Extensions(ex),
			}
			return entc.Generate(
				schemaDir,
				&gen.Config{
					Target:  targetDir,
					Package: "hpapp.yssk22.dev/go/service/ent",
				},
				opts...,
			)
		},
	}
	cmd.Flags().String("gqlgen-config-path", "", "gqlgen yaml config path")
	cmd.Flags().String("graphql-schema-path", "", "GraphQL schema.yml path")
	// cmd.Flags().String("gqlgen-config-path", "", "gqlgen yaml config path")

	if err := cmd.ExecuteContext(context.Background()); err != nil {
		os.Exit(1)
	}
}
