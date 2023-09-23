package main

import (
	"context"
	"os"

	"github.com/spf13/cobra"
	"github.com/yssk22/hpapp/go/devtool/generator"
	"github.com/yssk22/hpapp/go/devtool/generator/entgo"
	"github.com/yssk22/hpapp/go/devtool/generator/graphql/gqlgen"
)

func main() {
	cmd := &cobra.Command{
		Use:   "gen-enum",
		Short: "generate enum",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			dir := args[0]
			disablEntgo, _ := cmd.Flags().GetBool("disable-entgo")
			disablGqlgen, _ := cmd.Flags().GetBool("disable-gqlgen")
			var g []generator.Generator
			if !disablEntgo {
				g = append(g, entgo.NewEnumGenerator(dir))
			}
			if !disablGqlgen {
				g = append(g, gqlgen.NewEnumGenerator(dir))
			}
			return generator.Generate(g...)
		},
	}
	cmd.Flags().Bool("-disable-entgo", false, "disable for entgo")
	cmd.Flags().Bool("-disable-gqlgen", false, "disable for gqlgen")

	if err := cmd.ExecuteContext(context.Background()); err != nil {
		os.Exit(1)
	}
}
