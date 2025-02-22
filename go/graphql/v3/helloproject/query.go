package helloproject

import (
	"context"
	"strconv"
	"time"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/slice"
	"github.com/yssk22/hpapp/go/graphql/common"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/hpartist"
	"github.com/yssk22/hpapp/go/service/ent/hpelineupmallitem"
	"github.com/yssk22/hpapp/go/service/ent/hpfeeditem"
	"github.com/yssk22/hpapp/go/service/ent/hpmember"
	"github.com/yssk22/hpapp/go/service/ent/predicate"
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
	ArtistIDs         []string
	AssetTypes        []enums.HPAssetType
	UseMemberTaggings *bool
	MinPostAt         *time.Time
}

func (h *HelloProjectQuery) Feed(ctx context.Context, params HPFeedQueryParams, after *ent.Cursor, first *int, before *ent.Cursor, last *int) (*ent.HPFeedItemConnection, error) {
	client := entutil.NewClient(ctx)
	first = common.First(first, 20)
	q := client.HPFeedItem.Query()
	memberIds := assert.X(slice.MapStringToInt(params.MemberIDs))
	artistIds := assert.X(slice.MapStringToInt(params.ArtistIDs))
	if params.UseMemberTaggings != nil && *params.UseMemberTaggings {
		// TODO: #28 Revisit Tagged Feed Feature
		// The following query doesn't genereate an optimisitic SQL so we adds post_at filter to narrow down the scope of row scan.
		q.Where(hpfeeditem.HasTaggedMembersWith(hpmember.IDIn(memberIds...)))
	} else {
		q.Where(
			hpfeeditem.Or(
				hpfeeditem.OwnerMemberIDIn(memberIds...),
				hpfeeditem.OwnerArtistIDIn(artistIds...),
			),
		)
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
	ArtistIDs        []string
	MemberIDs        []string
	Categories       []enums.HPElineupMallItemCategory
	MemberCategories []HPElineumpMallItemsParamsMemberCategories
	ArtistCategories []HPElineumpMallItemsParamsArtistCategories
}

type HPElineumpMallItemsParamsArtistCategories struct {
	ArtistID   string
	Categories []enums.HPElineupMallItemCategory
}
type HPElineumpMallItemsParamsMemberCategories struct {
	MemberID   string
	Categories []enums.HPElineupMallItemCategory
}

func (h *HelloProjectQuery) ElineupMallItems(ctx context.Context, params HPElineumpMallItemsParams, after *ent.Cursor, first *int, before *ent.Cursor, last *int) (*ent.HPElineupMallItemConnection, error) {
	client := entutil.NewClient(ctx)
	now := clock.Now(ctx)
	first = common.First(first, 20)
	conditions := []predicate.HPElineupMallItem{}
	memberIds := assert.X(slice.MapStringToInt(params.MemberIDs))
	artistIds := assert.X(slice.MapStringToInt(params.ArtistIDs))
	for _, id := range memberIds {
		conditions = append(conditions,
			hpelineupmallitem.And(
				hpelineupmallitem.HasTaggedMembersWith(hpmember.ID(id)),
			),
		)
	}
	for _, id := range artistIds {
		conditions = append(conditions,
			hpelineupmallitem.And(
				hpelineupmallitem.HasTaggedArtistsWith(hpartist.ID(id)),
			),
		)
	}
	for _, mc := range params.MemberCategories {
		memberId := assert.X(strconv.Atoi(mc.MemberID))
		conditions = append(conditions,
			hpelineupmallitem.And(
				hpelineupmallitem.HasTaggedMembersWith(hpmember.ID(memberId)),
				hpelineupmallitem.CategoryIn(mc.Categories...),
			),
		)
	}
	for _, ac := range params.ArtistCategories {
		artistId := assert.X(strconv.Atoi(ac.ArtistID))
		conditions = append(conditions,
			hpelineupmallitem.And(
				hpelineupmallitem.HasTaggedArtistsWith(hpartist.ID(artistId)),
				hpelineupmallitem.CategoryIn(ac.Categories...),
			),
		)
	}
	q := client.HPElineupMallItem.Query().Where(
		hpelineupmallitem.Or(conditions...),
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
