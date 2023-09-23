package ameblo

import (
	"context"
	"fmt"

	"hpapp.yssk22.dev/go/foundation/object"
	"hpapp.yssk22.dev/go/service/ent"
	"hpapp.yssk22.dev/go/service/helloproject/feed"
	"hpapp.yssk22.dev/go/service/schema/enums"
)

type amebloPostFeedable struct{}

func (f *amebloPostFeedable) GenItem(ctx context.Context, v *ent.HPAmebloPost) (*feed.Item, error) {
	item := feed.Item{
		SourceID:  v.ID,
		AssetType: enums.HPAssetTypeAmeblo,
		Title:     v.Title,
		PostAt:    v.PostAt,
		Path:      v.Path,
		SourceUrl: fmt.Sprintf("https://ameblo.jp%s", v.Path),
		Media:     v.Images,
	}
	if len(item.Media) > 0 {
		item.ImageUrl = object.Nullable(item.Media[0].Url)
	}
	if v.Edges.OwnerMember != nil {
		item.OwnerMember = v.Edges.OwnerMember
	} else {
		item.OwnerMember, _ = v.QueryOwnerMember().First(ctx)
	}
	if v.Edges.OwnerArtist != nil {
		item.OwnerArtist = v.Edges.OwnerArtist
	} else {
		item.OwnerArtist, _ = v.QueryOwnerArtist().First(ctx)
	}
	if v.Edges.TaggedMembers != nil {
		item.TaggedMembers = v.Edges.TaggedMembers
	} else {
		item.TaggedMembers, _ = v.QueryTaggedMembers().All(ctx)
	}
	if v.Edges.TaggedArtists != nil {
		item.TaggedArtists = v.Edges.TaggedArtists
	} else {
		item.TaggedArtists, _ = v.QueryTaggedArtists().All(ctx)
	}
	return &item, nil
}

func init() {
	feed.AddFeedSyncHook[*ent.HPAmebloPost](&amebloPostFeedable{})
}
