package feed

import (
	"context"
	"testing"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/service/auth/appuser"
	"hpapp.yssk22.dev/go/service/bootstrap/test"
	"hpapp.yssk22.dev/go/service/entutil"
	"hpapp.yssk22.dev/go/service/schema/enums"
	"hpapp.yssk22.dev/go/service/schema/jsonfields"
	"hpapp.yssk22.dev/go/system/clock"
)

func TestFeed(t *testing.T) {
	test.New("Mutation",
		test.WithHPMaster(),
		test.WithUser(),
	).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		entclient := entutil.NewClient(ctx)
		feed := entclient.HPFeedItem.Create().
			SetSourceID(0).
			SetSourceURL("https://ameblo.jp/something").
			SetAssetType(enums.HPAssetTypeAmeblo).
			SetTitle("Test").
			SetPostAt(clock.Now(ctx)).
			SetMedia([]jsonfields.Media{}).
			SaveX(ctx)
		viewHistory := assert.X(UpsertViewHistory(ctx, HPViewHistoryUpsertParams{
			FeedID: feed.ID,
			UserID: appuser.CurrentEntUserID(ctx),
		}))
		record := entclient.HPViewHistory.Query().FirstX(appuser.WithAdmin(ctx))
		a.Equals(1, entclient.HPViewHistory.Query().CountX(appuser.WithAdmin(ctx)))
		a.Equals(viewHistory.ID, record.ID)
		a.Equals(feed.ID, viewHistory.QueryFeed().FirstIDX(ctx))
		a.Equals(appuser.CurrentEntUserID(ctx), record.OwnerUserID)
		a.Equals(false, viewHistory.IsFavorite)

		// upsert shouldn't create a new record, but can update IsFavorite field
		viewHistory2 := assert.X(UpsertViewHistory(ctx, HPViewHistoryUpsertParams{
			FeedID:     feed.ID,
			UserID:     appuser.CurrentEntUserID(ctx),
			IsFavorite: true,
		}))
		record = entclient.HPViewHistory.Query().FirstX(appuser.WithAdmin(ctx))
		a.Equals(1, entclient.HPViewHistory.Query().CountX(appuser.WithAdmin(ctx)))
		a.Equals(viewHistory2.ID, record.ID)
		a.Equals(appuser.CurrentEntUserID(ctx), record.OwnerUserID)
		a.Equals(true, viewHistory2.IsFavorite)

		t.Run("Policy", func(t *testing.T) {
			t.Run("even admins cannot mutate the view history record", func(t *testing.T) {
				a := assert.NewTestAssert(t)
				_, err := UpsertViewHistory(appuser.WithAdmin(ctx), HPViewHistoryUpsertParams{
					FeedID:     feed.ID,
					UserID:     appuser.CurrentEntUserID(ctx),
					IsFavorite: true,
				})
				a.Equals(appuser.ErrNotAuthorized, err)
			})

			t.Run("users cannot see the view history of others", func(t *testing.T) {
				a := assert.NewTestAssert(t)
				otherUser := test.MakeTestUser(ctx)
				a.Equals(0, entclient.HPViewHistory.Query().CountX(appuser.WithUser(ctx, otherUser)))
			})
		})
	})
}
