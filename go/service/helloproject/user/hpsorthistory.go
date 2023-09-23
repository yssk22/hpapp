package user

import (
	"context"

	"hpapp.yssk22.dev/go/service/ent"
	"hpapp.yssk22.dev/go/service/entutil"
	"hpapp.yssk22.dev/go/service/errors"
	"hpapp.yssk22.dev/go/service/schema/jsonfields"
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
