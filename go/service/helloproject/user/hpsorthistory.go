package user

import (
	"context"

	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/errors"
	"github.com/yssk22/hpapp/go/service/schema/jsonfields"
)

type HPSortHistoryCreateParams struct {
	Records []jsonfields.HPSortResultRecord
}

func CreateSortHistory(ctx context.Context, userId int, params HPSortHistoryCreateParams) (*ent.HPSortHistory, error) {
	entclient := entutil.NewClient(ctx)
	history, err := entclient.HPSortHistory.Create().SetOwnerID(userId).SetSortResult(jsonfields.HPSortResult{
		Records: params.Records,
	}).Save(ctx)
	return history, errors.Wrap(ctx, err)
}
