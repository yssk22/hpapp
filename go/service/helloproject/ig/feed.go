package ig

import (
	"context"
	"fmt"
	"strings"

	"github.com/yssk22/hpapp/go/foundation/object"
	"github.com/yssk22/hpapp/go/foundation/stringutil"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/helloproject/feed"
	"github.com/yssk22/hpapp/go/service/schema/enums"
	"github.com/yssk22/hpapp/go/system/slog"
)

type igPostFeedable struct{}

func (f *igPostFeedable) GenItem(ctx context.Context, v *ent.HPIgPost) (*feed.Item, error) {
	item := feed.Item{
		SourceID:  v.ID,
		AssetType: enums.HPAssetTypeInstagram,
		Title:     stringutil.UTF8Slice(strings.ReplaceAll(v.Description, "\n", " "), 100),
		PostAt:    v.PostAt,
		Path:      fmt.Sprintf("/p/%s/", v.Shortcode),
		SourceUrl: fmt.Sprintf("https://instagram.com/p/%s/", v.Shortcode),
		Media:     v.Media,
	}
	if len(item.Media) == 0 {
		slog.Warning(ctx, "no media is available, skipping feed sync",
			slog.Name("service.helloproject.ig.feed"),
			slog.Attribute("post_id", v.ID),
		)
		return nil, nil
	}
	m := item.Media[0]
	switch m.Type {
	case enums.HPBlobTypeImage:
		item.ImageUrl = object.Nullable(m.Url)
	case enums.HPBlobTypeVideo:
		if m.ThumbnailUrl != "" {
			item.ImageUrl = object.Nullable(m.ThumbnailUrl)
		}
	}
	if v.Edges.OwnerArtist != nil {
		item.OwnerArtist = v.Edges.OwnerArtist
	} else {
		item.OwnerArtist, _ = v.QueryOwnerArtist().First(ctx)
	}
	if v.Edges.OwnerMember != nil {
		item.OwnerMember = v.Edges.OwnerMember
	} else {
		item.OwnerMember, _ = v.QueryOwnerMember().First(ctx)
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
	feed.AddFeedSyncHook[*ent.HPIgPost](&igPostFeedable{})
}
