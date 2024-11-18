package helloproject

import (
	"context"
	"time"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/slice"
	"github.com/yssk22/hpapp/go/graphql/common"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/hpelineupmallitem"
	"github.com/yssk22/hpapp/go/service/ent/hpfeeditem"
	"github.com/yssk22/hpapp/go/service/ent/hpmember"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/schema/enums"
	"github.com/yssk22/hpapp/go/system/clock"
)

type HelloProjectQuery struct{}

func (h *HelloProjectQuery) IsNode() {}

func (h *HelloProjectQuery) ID() string {
	return "helloproject"
}

func (h *HelloProjectQuery) Artists(ctx context.Context, after *ent.Cursor, first *int, before *ent.Cursor, last *int) ([]*ent.HPArtist, error) {
	client := entutil.NewClient(ctx)
	return client.HPArtist.Query().All(ctx)
}

type HPFeedQueryParams struct {
	MemberIDs         []string
	AssetTypes        []enums.HPAssetType
	UseMemberTaggings *bool
	MinPostAt         *time.Time
}

func (h *HelloProjectQuery) Feed(ctx context.Context, params HPFeedQueryParams, after *ent.Cursor, first *int, before *ent.Cursor, last *int) (*ent.HPFeedItemConnection, error) {
	client := entutil.NewClient(ctx)
	first = common.First(first, 20)
	q := client.HPFeedItem.Query()
	memberIds := assert.X(slice.MapStringToInt(params.MemberIDs))
	if params.UseMemberTaggings != nil && *params.UseMemberTaggings {
		// TODO: #28 Revisit Tagged Feed Feature
		// The following query doesn't genereate an optimisitic SQL so we adds post_at filter to narrow down the scope of row scan.
		q.Where(hpfeeditem.HasTaggedMembersWith(hpmember.IDIn(memberIds...)))
	} else {
		q.Where(hpfeeditem.OwnerMemberIDIn(memberIds...))
	}
	q.Where(hpfeeditem.AssetTypeIn(params.AssetTypes...))
	if params.MinPostAt != nil {
		// TODO: #28 Revisit Tagged Feed Feature
		// If a client sends a MinPostAt parameter, the query can narrow down the number of rows to scan so that it can return the result faster.
		q.Where(hpfeeditem.PostAtGTE(*params.MinPostAt))
	}
	return q.Paginate(ctx, after, first, before, last, ent.WithHPFeedItemOrder(&ent.HPFeedItemOrder{
		Direction: "DESC",
		Field:     ent.HPFeedItemOrderFieldPostAt,
	}))
}

type HPElineumpMallItemsParams struct {
	MemberIDs  []string
	Categories []enums.HPElineupMallItemCategory
}

func (h *HelloProjectQuery) ElineupMallItems(ctx context.Context, params HPElineumpMallItemsParams, after *ent.Cursor, first *int, before *ent.Cursor, last *int) (*ent.HPElineupMallItemConnection, error) {
	client := entutil.NewClient(ctx)
	now := clock.Now(ctx)
	first = common.First(first, 20)
	memberIds := assert.X(slice.MapStringToInt(params.MemberIDs))
	q := client.HPElineupMallItem.Query().Where(
		hpelineupmallitem.HasTaggedMembersWith(hpmember.IDIn(memberIds...)),
		hpelineupmallitem.OrderEndAtGTE(now),
	)
	if len(params.Categories) > 0 {
		q.Where(hpelineupmallitem.CategoryIn(params.Categories...))
	}
	return q.Paginate(ctx, after, first, before, last, ent.WithHPElineupMallItemOrder(&ent.HPElineupMallItemOrder{
		Direction: "ASC",
		Field:     ent.HPElineupMallItemOrderFieldOrderEndAt,
	}))
}
