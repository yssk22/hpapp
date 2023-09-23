package elineupmall

import (
	"context"
	"encoding/json"
	"fmt"
	"path/filepath"
	"testing"
	"time"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/foundation/timeutil"
	"hpapp.yssk22.dev/go/service/bootstrap/test"
	"hpapp.yssk22.dev/go/service/ent"
	"hpapp.yssk22.dev/go/service/ent/hpartist"
	"hpapp.yssk22.dev/go/service/ent/hpelineupmallitem"
	"hpapp.yssk22.dev/go/service/ent/hpmember"
	"hpapp.yssk22.dev/go/service/entutil"
	"hpapp.yssk22.dev/go/service/helloproject/blob"
	"hpapp.yssk22.dev/go/service/helloproject/member"
	"hpapp.yssk22.dev/go/service/schema/enums"
	"hpapp.yssk22.dev/go/service/schema/jsonfields"
	"hpapp.yssk22.dev/go/system/http/s2s"
)

func TestElineupmall(t *testing.T) {
	// Note that elineupmall item pages could be expired when the item sale date is over.
	// So if you remove snapshot data, you may need to update the test code accordingly.
	s := NewService(
		blob.NewCrawler(),
		member.NewSimpleTextMatchingTagger(),
		DefaultSalesPeriodExtractor,
		DefaultCategoryResolver,
	).(*elineupmallService)
	test.New(
		"CrawlArtistPage",
		test.WithHPMaster(),
		test.WithFixedTimestamp(),
	).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		task := s.CrawlArtistPageTask()
		a.Nil(task.Request(ctx, &CrawlArtistPageArgs{
			Index:            0,
			ListItemsPerPage: 1,
			MaxItemsPerList:  1,
		}, nil))
		calls := s2s.GetMockCalls(ctx)
		a.Equals(1, len(calls))
		a.Equals(task.Path(), calls[0].Key)
		a.Equals(`{"index":0,"list_items_per_page":1,"max_items_per_list":1}`, string(calls[0].Payload))
		// let's have an actual call
		a.Nil(s.crawlArtistPageFunc(ctx, CrawlArtistPageArgs{
			Index:            0,
			ListItemsPerPage: 5, // get 5 items
			MaxItemsPerList:  5, // and crawl 5 items
		}))
		itemPageTask := s.CrawlItemPagesTask()
		calls = s2s.GetMockCalls(ctx)
		a.Equals(3, len(calls))
		a.Equals(itemPageTask.Path(), calls[1].Key)
		a.Equals(task.Path(), calls[2].Key)
		a.Equals(`{"index":1,"list_items_per_page":5,"max_items_per_list":5}`, string(calls[2].Payload))

		// verify item page requests
		var args1 CrawlItemPagesArgs
		a.Nil(json.Unmarshal(calls[1].Payload, &args1))
		a.Snapshot("CrawlArtistPage.CrawlItemPagesArgs.first", args1)
		a.Equals(5, len(args1.Urls))

		// if some of the items are already in ent, they may not be requested to crawl.
		// create dummy ents to test this case:
		//   - args1.Urls[0] and [1] is already in ent while other [2,3,4] are not.
		//   - MaxItemsPerCrawl=4
		entutil.NewClient(ctx).HPElineupMallItem.Create().SetPermalink(args1.Urls[0]).SetCrawledAt(time.Date(2022, 10, 18, 0, 0, 0, 0, timeutil.JST)).
			SetName("args1[0]").SetDescription("d").SetSupplier("s").SetPrice(100).SetIsLimitedToFc(false).SetIsOutOfStock(false).SetImages([]jsonfields.Media{}).SaveX(ctx)
		entutil.NewClient(ctx).HPElineupMallItem.Create().SetPermalink(args1.Urls[1]).SetCrawledAt(time.Date(2022, 10, 30, 0, 0, 0, 0, timeutil.JST)).
			SetName("args1[1]").SetDescription("d").SetSupplier("s").SetPrice(100).SetIsLimitedToFc(false).SetIsOutOfStock(false).SetImages([]jsonfields.Media{}).SaveX(ctx)

		// the expected result:
		//   - item[2,3,4] should be requested to crawl in order.
		//   - item[0] should be picked up to crawl from the exsiting ent.
		a.Nil(s.crawlArtistPageFunc(ctx, CrawlArtistPageArgs{
			Index:            0,
			ListItemsPerPage: 5, // get 5 items
			MaxItemsPerList:  4, // and crawl 4 items out of 5.
		}))
		calls = s2s.GetMockCalls(ctx)
		a.Equals(5, len(calls))
		a.Equals(itemPageTask.Path(), calls[3].Key)
		a.Equals(task.Path(), calls[4].Key)
		a.Equals(`{"index":1,"list_items_per_page":5,"max_items_per_list":4}`, string(calls[4].Payload))

		// verify item page requests
		var args2 CrawlItemPagesArgs
		a.Nil(json.Unmarshal(calls[3].Payload, &args2))
		a.Snapshot("CrawlArtistPage.CrawlItemPagesArgs.second", args2)
		a.Equals(4, len(args2.Urls))
		a.Equals(args1.Urls[2], args2.Urls[0])
		a.Equals(args1.Urls[3], args2.Urls[1])
		a.Equals(args1.Urls[4], args2.Urls[2])
		a.Equals(args1.Urls[0], args2.Urls[3])

		// then test the last page.
		// elineupmall has 5000+ items in their directory (as of 2022), so (Index=4, PerPage=1000) would be the last page.
		a.Nil(s.crawlArtistPageFunc(ctx, CrawlArtistPageArgs{
			Index:            4,
			ListItemsPerPage: 1000,
			MaxItemsPerList:  50,
		}))
		calls = s2s.GetMockCalls(ctx)
		// there should be only itemPageTask call since it's the last page.
		a.Equals(6, len(calls))
		a.Equals(itemPageTask.Path(), calls[5].Key)
	})

	t.Run("CrawoItemPages", func(t *testing.T) {
		test.New(
			"SalesPeriod",
			test.WithHPMaster(),
			test.WithFixedTimestamp(),
		).Run(t, func(ctx context.Context, t *testing.T) {
			t.Run("Both From and To", func(t *testing.T) {
				a := assert.NewTestAssert(t)
				var links = []string{
					// 		【期間限定受注】
					"https://www.elineupmall.com/c182/c2341/juicejuice-10th-anniversary-concert-tour-10th-juice-5-4a5-u8dglhyq/",
					// 		通信販売受付期間
					"https://www.elineupmall.com/c182/c2341/juicejuice-10th-anniversary-concert-tour-10th-juice-2l2b-b406mtdi/",
					// 		【xxxx受注期間】2021年10月16日(土)14:00～2021年11月1日(月)23:59
					"https://www.elineupmall.com/c671/singlev-angerme-takeuchi-bd-senko/",
					// 		［WebStore販売期間］2021年10月24日（日）18：00～2021年10月30日（土）23：59
					"https://www.elineupmall.com/c671/c181/c197/c199/23-shop-2023-plaid2l-20512-0731-oxvzk21m/",
				}
				for _, permalink := range links {
					a.Nil(s.crawlItemPagesFunc(ctx, CrawlItemPagesArgs{
						Urls: []string{permalink},
					}))
					item := entutil.NewClient(ctx).HPElineupMallItem.Query().Where(hpelineupmallitem.PermalinkEQ(permalink)).
						WithTaggedArtists(func(q *ent.HPArtistQuery) {
							q.Order(ent.Asc(hpartist.FieldID))
						}).
						WithTaggedMembers(func(q *ent.HPMemberQuery) {
							q.Order(ent.Asc(hpmember.FieldID))
						}).OnlyX(ctx)
					a.NotNil(item.OrderStartAt, item.Permalink)
					a.NotNil(item.OrderEndAt, item.Permalink)
					a.Snapshot(fmt.Sprintf("CrawlItemPages.SalesPeriod.%s", filepath.Base(permalink)), item)
				}
			})
			t.Run("Only To", func(t *testing.T) {
				a := assert.NewTestAssert(t)
				var links = []string{
					// 受付締切日
					"https://www.elineupmall.com/c720/c722/c2377/ocha-norma-fc2023-ocha-norma6-22-i5092gq4/",
				}
				for _, permalink := range links {
					a.Nil(s.crawlItemPagesFunc(ctx, CrawlItemPagesArgs{
						Urls: []string{permalink},
					}))
					item := entutil.NewClient(ctx).HPElineupMallItem.Query().Where(hpelineupmallitem.PermalinkEQ(permalink)).
						WithTaggedArtists(func(q *ent.HPArtistQuery) {
							q.Order(ent.Asc(hpartist.FieldID))
						}).
						WithTaggedMembers(func(q *ent.HPMemberQuery) {
							q.Order(ent.Asc(hpmember.FieldID))
						}).OnlyX(ctx)
					a.Nil(item.OrderStartAt)
					a.NotNil(item.OrderEndAt)
					a.Snapshot(fmt.Sprintf("CrawlItemPages.SalesPeriod.%s", filepath.Base(permalink)), item)
				}
			})
		})

		test.New(
			"Category",
			test.WithHPMaster(),
			test.WithFixedTimestamp(),
		).Run(t, func(ctx context.Context, t *testing.T) {
			a := assert.NewTestAssert(t)
			var links = []struct {
				link     string
				category enums.HPElineupMallItemCategory
			}{
				{
					link:     "https://www.elineupmall.com/c182/c2342/23-25th-anniversary-concert-tour-glad-quarter-century-5-14a5-8q9pvrum/",
					category: enums.HPElineupMallItemCategoryPhotoDaily,
				},
				{
					link:     "https://www.elineupmall.com/c182/c2366/ocha-norma-concert-tour-2023-spring-a52-7bhj8fri/",
					category: enums.HPElineupMallItemCategoryPhotoA5,
				},
				{
					link:     "https://www.elineupmall.com/c720/c722/c2374/23-a4-x2bcar7q/",
					category: enums.HPElineupMallItemCategoryPhotoA4,
				},
				{
					link:     "https://www.elineupmall.com/c671/c181/c197/c199/23-wxe76c8p/",
					category: enums.HPElineupMallItemCategoryPhotoAlbum,
				},
				{
					link:     "https://www.elineupmall.com/c671/c181/c197/c201/juicejuice-1l-40421-0626-bi1na48g/",
					category: enums.HPElineupMallItemCategoryPhotoAlbumOther,
				},
				{
					link:     "https://www.elineupmall.com/c671/c181/c197/c199/22-ke1yxsfi/",
					category: enums.HPElineupMallItemCategoryPhotoBook,
				},
				{
					link:     "https://www.elineupmall.com/c671/c181/c197/c199/23-2022-autumn3l-20310-0529-si7lbdxj/",
					category: enums.HPElineupMallItemCategoryPhotoBookOther,
				},
				{
					// DVD マガジン case
					link:     "https://www.elineupmall.com/c182/c2341/juicejuice-10th-anniversary-concert-tour-10th-juice-juicejuice-dvd-vol.39-vlrdfo6c/",
					category: enums.HPElineupMallItemCategoryDVDMagazine,
				},
				{
					// DVD Magazine case
					link:     "https://www.elineupmall.com/c182/c2342/23-25th-anniversary-concert-tour-glad-quarter-century-morning-musume23-dvd-magazine-vol.143-x85p4jih/",
					category: enums.HPElineupMallItemCategoryDVDMagazine,
				},
				{
					link:     "https://www.elineupmall.com/c182/c2342/e-lineupmall23-25th-anniversary-concert-tour-glad-quarter-century-dvdl6-oq2d9xnw/",
					category: enums.HPElineupMallItemCategoryDVDMagazineOther,
				},
				{
					link:     "https://www.elineupmall.com/c671/dvd-hpkensyusei-happyokai202103/",
					category: enums.HPElineupMallItemCategoryDVD,
				},
				{
					link:     "https://www.elineupmall.com/c182/c2343/beyooooonds-concert-tourneo-beyo-beyooooonds-dqp35n9a/",
					category: enums.HPElineupMallItemCategoryPenlight,
				},
				{
					link:     "https://www.elineupmall.com/c182/c2366/ocha-norma-concert-tour-2023-spring-24-s6rpdoym/",
					category: enums.HPElineupMallItemCategoryColllectionPinnapPoster,
				},
				{
					link:     "https://www.elineupmall.com/c182/c2341/juicejuice-10th-anniversary-concert-tour-10th-juice-part220-twk63vmi/",
					category: enums.HPElineupMallItemCategoryColllectionPhoto,
				},
				{
					link:     "https://www.elineupmall.com/c182/c2366/ocha-norma-concert-tour-2023-spring-10-62j1ti7c/",
					category: enums.HPElineupMallItemCategoryColllectionOther,
				},
				{
					link:     "https://www.elineupmall.com/c182/c2212/juicejuice-concert-tour-nouvelle-vague-t-gx5ve1cd/",
					category: enums.HPElineupMallItemCategoryTShirt,
				},
				{
					link:     "https://www.elineupmall.com/c182/c2341/juicejuice-10th-anniversary-concert-tour-10th-juice-7rmiolzv/",
					category: enums.HPElineupMallItemCategoryMufflerTowel,
				},
				{
					link:     "https://www.elineupmall.com/c182/c2264/22-25th-anniversary-concert-tour-singin-to-the-beat-6vfyujxz/",
					category: enums.HPElineupMallItemCategoryMicrofiberTowel,
				},
				{
					link:     "https://www.elineupmall.com/c671/c181/c197/c201/juicejuice-plaid0428-0514-4h5gfa9p/",
					category: enums.HPElineupMallItemCategoryFSK,
				},
				{
					link:     "https://www.elineupmall.com/c182/c2341/juicejuice-10th-anniversary-concert-tour-10th-juice-2l2b-b406mtdi/",
					category: enums.HPElineupMallItemCategoryPhoto2L,
				},
				{
					link:     "https://www.elineupmall.com/c671/c181/c197/c201/juicejuice-a42lplaid-tckreuwo/",
					category: enums.HPElineupMallItemCategoryClearFile,
				},
			}
			for _, obj := range links {
				permalink := obj.link
				want := obj.category
				a.Nil(s.crawlItemPagesFunc(ctx, CrawlItemPagesArgs{
					Urls: []string{permalink},
				}))
				item := entutil.NewClient(ctx).HPElineupMallItem.Query().Where(hpelineupmallitem.PermalinkEQ(permalink)).
					WithTaggedArtists(func(q *ent.HPArtistQuery) {
						q.Order(ent.Asc(hpartist.FieldID))
					}).
					WithTaggedMembers(func(q *ent.HPMemberQuery) {
						q.Order(ent.Asc(hpmember.FieldID))
					}).
					OnlyX(ctx)
				name := filepath.Base(permalink)
				a.Equals(want, item.Category, permalink)
				a.Snapshot(fmt.Sprintf("CrawlItemPages..Category.%s", name), item)
			}
		})

		test.New(
			"Upsert",
			test.WithHPMaster(),
			test.WithFixedTimestamp(),
		).Run(t, func(ctx context.Context, t *testing.T) {
			a := assert.NewTestAssert(t)
			permalink1 := "https://www.elineupmall.com/c671/c181/c197/c201/juicejuice-shop-2023-plaid2l-20512-0731-xeq9h2yj/"
			permalink2 := "https://www.elineupmall.com/c671/c181/c197/c201/juicejuice-shop-2023-plaid2l-20512-0731-xeq9h2yj/"
			a.Nil(s.crawlItemPagesFunc(ctx, CrawlItemPagesArgs{
				Urls: []string{permalink1},
			}))
			a.Nil(s.crawlItemPagesFunc(ctx, CrawlItemPagesArgs{
				Urls: []string{permalink1, permalink2},
			}))
		})

	})
}
