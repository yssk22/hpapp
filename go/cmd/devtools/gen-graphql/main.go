package main

import (
	"context"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"
	"hpapp.yssk22.dev/go/devtool/generator"
	"hpapp.yssk22.dev/go/devtool/generator/graphql/schema"
)

func main() {
	cmd := &cobra.Command{
		Use:   "gen-graphql",
		Short: "generate graphql schema and server code",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			dst := args[0]
			roots, err := cmd.Flags().GetStringArray("root")
			if err != nil {
				return err
			}
			excludePackages, err := cmd.Flags().GetStringArray("exclude-package")
			if err != nil {
				return err
			}
			excludeTypes, err := cmd.Flags().GetStringArray("exclude-type")
			if err != nil {
				return err
			}
			config, err := cmd.Flags().GetString("config")
			if err != nil {
				return err
			}
			options := []schema.GeneratorOption{}
			if config != "" {
				options = append(options, schema.WithConfig(config))
			}
			options = append(
				options,
				schema.WithOutputFile(filepath.Join(dst, "schema.graphql")),
				schema.WithRoot(roots...),
				schema.WithExcludePackage(excludePackages...),
				schema.WithExcludeType(excludeTypes...),
			)

			err = generator.Generate(schema.NewGenerator(options...))
			return err
		},
	}
	cmd.Flags().String("config", "", "config file")
	cmd.Flags().StringArray("root", []string{}, "root struct names")
	cmd.Flags().StringArray("exclude-package", []string{}, "packages to exclude from generation")
	cmd.Flags().StringArray("exclude-type", []string{}, "types to exclude from generation")

	if err := cmd.ExecuteContext(context.Background()); err != nil {
		os.Exit(1)
	}
}
