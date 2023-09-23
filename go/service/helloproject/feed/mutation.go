package feed

import (
	"context"

	"hpapp.yssk22.dev/go/service/ent"
	"hpapp.yssk22.dev/go/service/ent/hpviewhistory"
	"hpapp.yssk22.dev/go/service/entutil"
	"hpapp.yssk22.dev/go/service/errors"
)

type HPViewHistoryUpsertParams struct {
	FeedID     int
	UserID     int
	IsFavorite bool
}

func UpsertViewHistory(ctx context.Context, params HPViewHistoryUpsertParams) (*ent.HPViewHistory, error) {
	client := entutil.NewClient(ctx)
	feed, err := client.HPFeedItem.Get(ctx, params.FeedID)
	if err != nil {
		return nil, err
	}
	upsert := client.HPViewHistory.Create().
		SetOwnerUserID(params.UserID).
		SetFeedID(params.FeedID).
		SetIsFavorite(params.IsFavorite).
		SetContentID(feed.SourceID).
		SetContentPostAt(feed.PostAt).
		SetAssetType(feed.AssetType).
		OnConflictColumns(hpviewhistory.FieldOwnerUserID, hpviewhistory.FieldContentID).
		SetIsFavorite(params.IsFavorite)
	id, err := upsert.ID(ctx)
	if err != nil {
		return nil, errors.Wrap(ctx, err)
	}
	history, err := client.HPViewHistory.Get(ctx, id)
	return history, errors.Wrap(ctx, err)
}
