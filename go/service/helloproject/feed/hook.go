package feed

import (
	"context"
	"fmt"
	"time"

	"hpapp.yssk22.dev/go/service/ent"
	"hpapp.yssk22.dev/go/service/ent/hpfeeditem"
	"hpapp.yssk22.dev/go/service/entutil"
	"hpapp.yssk22.dev/go/service/schema/enums"
	"hpapp.yssk22.dev/go/service/schema/jsonfields"
)

type Feedable[T any] interface {
	GenItem(ctx context.Context, v T) (*Item, error)
}

type Item struct {
	SourceID      int
	AssetType     enums.HPAssetType
	Title         string
	PostAt        time.Time
	Path          string
	SourceUrl     string
	ImageUrl      *string
	Media         []jsonfields.Media
	OwnerArtist   *ent.HPArtist
	OwnerMember   *ent.HPMember
	TaggedArtists []*ent.HPArtist
	TaggedMembers []*ent.HPMember
}

func AddFeedSyncHook[T any](f Feedable[T]) {
	entutil.AddPostMutationHook(func(ctx context.Context, v T) error {
		client := entutil.NewClient(ctx)
		item, err := f.GenItem(ctx, v)
		if err != nil {
			return err
		}
		if item == nil {
			return nil
		}
		if item.PostAt.IsZero() {
			return fmt.Errorf("non zero value is requried for PostAt")
		}
		entitem, err := client.HPFeedItem.Query().Where(hpfeeditem.SourceIDEQ(item.SourceID)).First(ctx)
		if err = ent.MaskNotFound(err); err != nil {
			return fmt.Errorf("failed to check existing feed item: %w", err)
		}
		if entitem != nil {
			update := entitem.Update().
				ClearTaggedArtists().
				ClearTaggedMembers().
				SetTitle(item.Title).
				SetMedia(item.Media).
				SetNillableImageURL(item.ImageUrl)
			if len(item.TaggedArtists) > 0 {
				update.ClearTaggedArtists().AddTaggedArtists(item.TaggedArtists...)
			}
			if len(item.TaggedMembers) > 0 {
				update.ClearTaggedMembers().AddTaggedMembers(item.TaggedMembers...)
			}
			if item.OwnerArtist != nil {
				update.SetOwnerArtist(item.OwnerArtist).SetOwnerArtistID(item.OwnerArtist.ID)
			}
			if item.OwnerMember != nil {
				update.SetOwnerMember(item.OwnerMember).SetOwnerArtistID(*item.OwnerMember.ArtistID)
			}
			return update.Exec(ctx)
		}
		create := client.HPFeedItem.Create().
			SetSourceID(item.SourceID).
			SetTitle(item.Title).
			SetAssetType(item.AssetType).
			SetPostAt(item.PostAt).
			SetMedia(item.Media).
			SetSourceURL(item.SourceUrl).
			SetNillableImageURL(item.ImageUrl)
		if len(item.TaggedArtists) > 0 {
			create.AddTaggedArtists(item.TaggedArtists...)
		}
		if len(item.TaggedMembers) > 0 {
			create.AddTaggedMembers(item.TaggedMembers...)
		}
		if item.OwnerArtist != nil {
			create.SetOwnerArtist(item.OwnerArtist).SetOwnerArtistID(item.OwnerArtist.ID)
		}
		if item.OwnerMember != nil {
			create.SetOwnerMember(item.OwnerMember).SetOwnerArtistID(*item.OwnerMember.ArtistID)
		}
		return create.Exec(ctx)
	})
}
