package helloproject

import (
	"context"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/foundation/slice"
	"hpapp.yssk22.dev/go/graphql/common"
	"hpapp.yssk22.dev/go/service/ent"
	"hpapp.yssk22.dev/go/service/ent/hpfeeditem"
	"hpapp.yssk22.dev/go/service/ent/hpmember"
	"hpapp.yssk22.dev/go/service/entutil"
	"hpapp.yssk22.dev/go/service/schema/enums"
)

type HelloProjectQuery struct{}

func (h *HelloProjectQuery) Artists(ctx context.Context, after *ent.Cursor, first *int, before *ent.Cursor, last *int) ([]*ent.HPArtist, error) {
	client := entutil.NewClient(ctx)
	return client.HPArtist.Query().All(ctx)
}

type HPFeedQueryParams struct {
	MemberIDs         []string
	AssetTypes        []enums.HPAssetType
	UseMemberTaggings *bool
}

func (h *HelloProjectQuery) Feed(ctx context.Context, params HPFeedQueryParams, after *ent.Cursor, first *int, before *ent.Cursor, last *int) (*ent.HPFeedItemConnection, error) {
	client := entutil.NewClient(ctx)
	first = common.First(first, 20)
	q := client.HPFeedItem.Query()
	memberIds := assert.X(slice.MapStringToInt(params.MemberIDs))
	if params.UseMemberTaggings != nil && *params.UseMemberTaggings {
		q.Where(hpfeeditem.HasTaggedMembersWith(hpmember.IDIn(memberIds...)))
	} else {
		q.Where(hpfeeditem.HasOwnerMemberWith(hpmember.IDIn(memberIds...)))
	}
	q.Where(hpfeeditem.AssetTypeIn(params.AssetTypes...))
	q.Order(ent.Desc(hpfeeditem.FieldPostAt))
	return q.Paginate(ctx, after, first, before, last)
}
