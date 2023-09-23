package settings

import (
	"fmt"

	"github.com/spf13/cobra"
	"github.com/yssk22/hpapp/go/foundation/cli"
	"github.com/yssk22/hpapp/go/foundation/kvs"
	"github.com/yssk22/hpapp/go/foundation/slice"
)

// SettingsCommand provides the followng commands
//
//    settings list - list all settings
//    settings get [key] - get the current value of settings
//    settings set [key] [value] - set the value of settings
//
func SettingsCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "settings",
		Short: "settings utiliy",
	}
	cmd.AddCommand(
		// list
		&cobra.Command{
			Use:   "list",
			Short: "list all settings",
			RunE: func(cmd *cobra.Command, args []string) error {
				ctx := cmd.Context()
				w := cli.NewTableWriter([]string{"Key", "Type", "Package", "Var", "Current Value"})
				defs, err := CaptureSettings("github.com/yssk22/hpapp/go/...")
				if err != nil {
					return err
				}
				keys, _ := slice.Map(defs, func(i int, v *ItemInfo) (string, error) {
					return v.KeyName, nil
				})
				store := ctx.Value(ctxKvsKey).(kvs.KVS)
				values, err := store.GetMulti(ctx, keys...)
				if err != nil {
					return err
				}
				for i, d := range defs {
					v := values[i]
					if v == nil {
						w.WriteRow([]string{
							d.KeyName,
							d.TypeName,
							d.PackageName,
							d.VarName,
							"(not set)",
						})
					} else {
						w.WriteRow([]string{
							d.KeyName,
							d.TypeName,
							d.PackageName,
							d.VarName,
							string(v),
						})
					}
				}
				w.Flush()
				return nil
			},
		},
		// get
		&cobra.Command{
			Use:   "get",
			Short: "get the value of settings",
			Args:  cobra.ExactArgs(1),
			RunE: func(cmd *cobra.Command, args []string) error {
				ctx := cmd.Context()
				key := args[0]
				store := ctx.Value(ctxKvsKey).(kvs.KVS)
				value, err := kvs.Get(ctx, key, store)
				// Get opration
				if err != nil && err != kvs.ErrKeyNotFound {
					return err
				}
				if err == kvs.ErrKeyNotFound {
					fmt.Println("not set")
					return nil
				}
				fmt.Printf("current value: %s\n", string(value))
				return nil
			},
		},
		// set
		&cobra.Command{
			Use:   "set",
			Short: "set the value of settings",
			Args:  cobra.ExactArgs(2),
			RunE: func(cmd *cobra.Command, args []string) error {
				ctx := cmd.Context()
				key := args[0]
				store := ctx.Value(ctxKvsKey).(kvs.KVS)
				value, err := kvs.Get(ctx, key, store)
				if err == nil {
					if !cli.Confirm(fmt.Sprintf("Are you sure to update (current value: %s)?", value)) {
						return fmt.Errorf("canceled")
					}
				}
				if err := kvs.Set(ctx, key, []byte(args[1]), store); err != nil {
					return err
				}
				fmt.Println("updated.")
				return nil
			},
		},
	)
	return cmd
}
