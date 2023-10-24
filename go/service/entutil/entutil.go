package entutil

import (
	"context"
	"fmt"

	"entgo.io/ent/dialect/sql"
	"github.com/spf13/cobra"
	"github.com/yssk22/hpapp/go/service/bootstrap/config"
	"github.com/yssk22/hpapp/go/service/bootstrap/http/middleware"
	"github.com/yssk22/hpapp/go/service/bootstrap/http/task"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/system/database"
	"github.com/yssk22/hpapp/go/system/slog"
	// _ "github.com/yssk22/hpapp/go/service/ent/runtime"
)

func NewClient(ctx context.Context) *ent.Client {
	db := database.FromContext(ctx)
	c := ent.NewClient(ent.Driver(sql.OpenDB(db.Name, db.DB)))
	for _, h := range runtimeHooks {
		c.Use(h)
	}
	// return c.Debug() // use Debug() to show executed SQLs.
	return c
}

func RunTx[T any](ctx context.Context, f func(tx *ent.Tx) (T, error)) (v T, err error) {
	var tx *ent.Tx
	// TODO: isolation level configuration (default is ReadCommitted )
	tx, err = NewClient(ctx).Tx(ctx)
	if err != nil {
		return
	}
	defer func() {
		var txErr error
		if x := recover(); x != nil {
			txErr = tx.Rollback()
		} else if err != nil {
			txErr = tx.Rollback()
		} else {
			txErr = tx.Commit()
		}
		if txErr != nil {
			slog.Critical(ctx,
				fmt.Sprintf("failed to commit or rollback the transaction: %v", txErr),
				slog.Name("service.entutil.transaction"),
			)
		}
	}()
	v, err = f(tx)
	return v, err
}

func RunTxOne(ctx context.Context, f func(tx *ent.Tx) error) error {
	_, err := RunTx(ctx, func(tx *ent.Tx) (any, error) {
		err := f(tx)
		return nil, err
	})
	return err
}

type entService struct{}

func NewService() config.Service {
	return &entService{}
}

func (s *entService) Middleware() []middleware.HttpMiddleware {
	return nil
}

func (s *entService) Tasks() []task.Task {
	return nil
}

func (s *entService) Command() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "ent",
		Short: "Ent utilities",
	}
	cmd.AddCommand(cmdExport)
	cmd.AddCommand(cmdImport)
	cmd.AddCommand(cmdProductionize)
	return cmd
}
