package member

import (
	"context"
	"fmt"
	"testing"
	"time"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/foundation/timeutil"
	"hpapp.yssk22.dev/go/service/bootstrap/test"
	"hpapp.yssk22.dev/go/service/ent"
	"hpapp.yssk22.dev/go/service/ent/hpartist"
	"hpapp.yssk22.dev/go/service/ent/hpasset"
	"hpapp.yssk22.dev/go/service/ent/hpmember"
	"hpapp.yssk22.dev/go/service/entutil"
	"hpapp.yssk22.dev/go/system/settings"
)

func TestCrawlArtists(t *testing.T) {
	test.New(
		"crawl",
		test.WithContextTime(time.Date(2023, time.October, 30, 0, 0, 0, 0, timeutil.JST)),
		test.WithNow(time.Date(2023, time.October, 30, 0, 0, 10, 0, timeutil.JST)),
	).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		err := CrawlArtists(ctx, nil)
		a.Nil(err)
		entclient := entutil.NewClient(ctx)
		artists := entclient.HPArtist.Query().WithMembers(func(q *ent.HPMemberQuery) {
			q.Order(ent.Asc(
				hpmember.FieldJoinAt, hpmember.FieldDateOfBirth,
			)).WithAssets(
				func(q *ent.HPAssetQuery) {
					q.Order(ent.Asc(hpasset.FieldAssetType, hpasset.FieldKey))
				},
			)
		}).WithAssets(
			func(q *ent.HPAssetQuery) {
				q.Order(ent.Asc(hpasset.FieldAssetType, hpasset.FieldKey))
			},
		).AllX(ctx)
		a.Snapshot("artists", artists, assert.SnapshotExclude("id"))

		// P0 POMO #936 - multiple crawling shouldn't create duplicated assets.
		totalAssets := entclient.HPAsset.Query().CountX(ctx)
		a.Equals(74, totalAssets)
		err = CrawlArtists(ctx, nil)
		a.Nil(err)
		totalAssets = entclient.HPAsset.Query().CountX(ctx)
		a.Equals(74, totalAssets)
	})

	test.New(
		"auto-detect-graduations",
		test.WithHPMaster(),
		test.WithContextTime(time.Date(2023, time.October, 30, 0, 0, 0, 0, timeutil.JST)),
		test.WithNow(time.Date(2023, time.October, 30, 0, 0, 10, 0, timeutil.JST)),
	).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		entclient := entutil.NewClient(ctx)
		// In the HPMaster, some kobushi members are recorded manually without crawling and
		// we don't want to handle them in this test to make a test simple.
		memberFilter := func(m *ent.HPMemberQuery) {
			m.Where(hpmember.CrawledAtNotNil())
		}
		kobushi := entclient.HPArtist.Query().Where(hpartist.KeyEQ("kobushifactory")).WithMembers(memberFilter).FirstX(ctx)
		for _, member := range kobushi.Edges.Members {
			member.Update().ClearGraduateAt().SetErrorCount(0).SetLastErrorMessage("").SaveX(ctx)
		}
		// crawl N times while Kobushi memebrs are not marked as graduated
		threshold := settings.GetX(ctx, NumNotFoundToGraduate)
		a.Equals(5, threshold) // default
		for c := 0; c < threshold; c++ {
			a.Nil(CrawlArtistProfile(ctx, kobushi))
			kobushi = entclient.HPArtist.Query().Where(hpartist.KeyEQ("kobushifactory")).WithMembers(memberFilter).FirstX(ctx)
			for _, member := range kobushi.Edges.Members {
				a.Nil(member.GraduateAt)
			}
		}
		// this crawl should mark Kobushi memebrs as graduated
		a.Nil(CrawlArtistProfile(ctx, kobushi))
		kobushi = entclient.HPArtist.Query().Where(hpartist.KeyEQ("kobushifactory")).WithMembers(memberFilter).FirstX(ctx)
		for _, member := range kobushi.Edges.Members {
			a.NotNil(member.GraduateAt, fmt.Sprintf("%s is not graudated", member.Key))
		}
	})
}
