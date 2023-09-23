package elineupmall

import (
	"context"
	"regexp"
	"strconv"
	"strings"
	"time"

	"hpapp.yssk22.dev/go/foundation/timeutil"
	"hpapp.yssk22.dev/go/service/schema/enums"
)

type SalesPeriod struct {
	From *time.Time
	To   *time.Time
}

type SalesPeriodExtractor interface {
	ExtractSalesPeriod(context.Context, *ItemPage) *SalesPeriod
}

type SalesPeriodExtractorFunc func(context.Context, *ItemPage) *SalesPeriod

func (f SalesPeriodExtractorFunc) ExtractSalesPeriod(ctx context.Context, p *ItemPage) *SalesPeriod {
	return f(ctx, p)
}

var (
	// itemSaleTermRegExp1 covers:
	// 		【期間限定受注】2021年10月24日(日)13:30～2021年11月6日(土)23:59
	// 		通信販売受付期間：2021年10月16日(土)14:00～2022年1月13日(木)23:59
	// 		【第2回受注期間】2021年10月16日(土)14:00～2021年11月1日(月)23:59
	// 		［WebStore販売期間］2021年10月24日（日）18：00～2021年10月30日（土）23：59
	itemSaleTermRegExp1 = regexp.MustCompile(`(\d{4})年(\d{1,2})月(\d{1,2})日\(.+\)\d{1,2}:\d{1,2}\s*～\s*(\d{4})年(\d{1,2})月(\d{1,2})日\(.+\)\d{1,2}:\d{1,2}`)
	// itemSaleTermRegExp2 covers:
	// 		受付締切日：2021年11月12日（金）23：59
	itemSaleTermRegExp2 = regexp.MustCompile(`受付締切日:(\d{4})年(\d{1,2})月(\d{1,2})日\(.+\)\d{1,2}:\d{1,2}`)
)

// DefaultSalesTermExtractor is the default implementation of SalesTermExtractor using regexp.
// This supports the following formats:
//   a) explicit date range
// 		【期間限定受注】2021年10月24日(日)13:30～2021年11月6日(土)23:59
// 		通信販売受付期間：2021年10月16日(土)14:00～2022年1月13日(木)23:59
// 		【第2回受注期間】2021年10月16日(土)14:00～2021年11月1日(月)23:59
// 		［WebStore販売期間］2021年10月24日（日）18：00～2021年10月30日（土）23：59
//   b) no start date but only end date
// 		受付締切日：2021年11月12日（金）23：59
var DefaultSalesPeriodExtractor = SalesPeriodExtractorFunc(func(ctx context.Context, p *ItemPage) *SalesPeriod {
	found := itemSaleTermRegExp1.FindStringSubmatch(p.Description)
	if len(found) > 0 {
		fyy, _ := strconv.Atoi(found[1])
		fmm, _ := strconv.Atoi(found[2])
		fdd, _ := strconv.Atoi(found[3])
		tyy, _ := strconv.Atoi(found[4])
		tmm, _ := strconv.Atoi(found[5])
		tdd, _ := strconv.Atoi(found[6])
		f := time.Date(fyy, time.Month(fmm), fdd, 0, 0, 0, 0, timeutil.JST)
		t := time.Date(tyy, time.Month(tmm), tdd, 0, 0, 0, 0, timeutil.JST)
		return &SalesPeriod{
			From: &f,
			To:   &t,
		}
	}
	found = itemSaleTermRegExp2.FindStringSubmatch(p.Description)
	if len(found) > 0 {
		tyy, _ := strconv.Atoi(found[1])
		tmm, _ := strconv.Atoi(found[2])
		tdd, _ := strconv.Atoi(found[3])
		e := time.Date(tyy, time.Month(tmm), tdd, 0, 0, 0, 0, timeutil.JST)
		return &SalesPeriod{
			From: nil,
			To:   &e,
		}
	}
	return nil
})

type CategoryResolver interface {
	Resolve(context.Context, *ItemPage) enums.HPElineupMallItemCategory
}

type CategoryResolverFunc func(context.Context, *ItemPage) enums.HPElineupMallItemCategory

func (f CategoryResolverFunc) Resolve(ctx context.Context, p *ItemPage) enums.HPElineupMallItemCategory {
	return f(ctx, p)
}

// DefaltCategoryResolver is the default implementation of CategoryResolver based on keyword matching and price range validations
var DefaultCategoryResolver = CategoryResolverFunc(func(ctx context.Context, p *ItemPage) enums.HPElineupMallItemCategory {
	for _, rule := range categoryRuleList {
		if rule.Match(p) {
			return rule.Category
		}
	}
	return enums.HPElineupMallItemCategoryOther
})

type categoryRule struct {
	Category enums.HPElineupMallItemCategory
	Keywords []string
	MinPrice int
}

func (r *categoryRule) Match(p *ItemPage) bool {
	// all keywords must be contained in the item name
	for _, keyword := range r.Keywords {
		if !strings.Contains(
			strings.ToLower(p.Name),
			strings.ToLower(keyword),
		) {
			return false
		}
	}
	return p.Price > r.MinPrice
}

// rules reviewed at 2023/05/10
var categoryRuleList = []*categoryRule{
	{
		Category: enums.HPElineupMallItemCategoryPhotoDaily,
		Keywords: []string{"日付入り", "写真"},
	},
	{
		Category: enums.HPElineupMallItemCategoryPhotoA5,
		Keywords: []string{"A5ワイドサイズ", "写真"},
	},
	{
		Category: enums.HPElineupMallItemCategoryPhotoA4,
		Keywords: []string{"A4サイズ", "写真"},
	},
	{
		Category: enums.HPElineupMallItemCategoryPhotoAlbum,
		Keywords: []string{"写真集"},
		// as of 2023/05, min price of actual photo album is 1527 JPY, while there is photo album options at 1500 JPY.
		MinPrice: 1501,
	},
	{
		// appendix photos of photo albums can be categorized as "other"
		// and they are cheaper than the main photo album so if the price is lower than 1501 (above),
		// the item is marked as PhotoAlbumOther.
		Category: enums.HPElineupMallItemCategoryPhotoAlbumOther,
		Keywords: []string{"写真集"},
	},
	// "フォトブック" is not much different from "写真集" but it is used for some items (possibly 水着 or not)
	{
		Category: enums.HPElineupMallItemCategoryPhotoBook,
		Keywords: []string{"フォトブック"},
		MinPrice: 1501,
	},
	{
		Category: enums.HPElineupMallItemCategoryPhotoBookOther,
		Keywords: []string{"フォトブック"},
	},
	// Sometimes DVD Magainge is sold as "DVDマガジン" or "DVD Magazine"..
	{
		Category: enums.HPElineupMallItemCategoryDVDMagazine,
		Keywords: []string{"dvd", "magazine"},
		MinPrice: 2500,
	},
	{
		Category: enums.HPElineupMallItemCategoryDVDMagazine,
		Keywords: []string{"dvd", "マガジン"},
		MinPrice: 2500,
	},
	// same as photo albums, the main DVD magaine is more expensive than the appendix of DVD magazine themselves.
	{
		Category: enums.HPElineupMallItemCategoryDVDMagazineOther,
		Keywords: []string{"dvd", "magazine"},
	},
	{
		Category: enums.HPElineupMallItemCategoryDVDMagazineOther,
		Keywords: []string{"dvd", "マガジン"},
	},
	{
		Category: enums.HPElineupMallItemCategoryDVD,
		Keywords: []string{"dvd"},
		MinPrice: 2500,
	},
	{
		Category: enums.HPElineupMallItemCategoryPenlight,
		Keywords: []string{"ペンライト"},
		MinPrice: 2500,
	},
	{
		Category: enums.HPElineupMallItemCategoryColllectionPinnapPoster,
		Keywords: []string{"コレクション", "ピンナップポスター"},
	},
	{
		Category: enums.HPElineupMallItemCategoryColllectionPhoto,
		Keywords: []string{"コレクション", "写真"},
	},
	{
		Category: enums.HPElineupMallItemCategoryColllectionOther,
		Keywords: []string{"コレクション"},
	},
	{
		Category: enums.HPElineupMallItemCategoryFSK,
		Keywords: []string{"キーホルダー", "フィギュアスタンド"},
	},
	{
		Category: enums.HPElineupMallItemCategoryKeyringOther,
		Keywords: []string{"キーホルダー"},
	},
	{
		Category: enums.HPElineupMallItemCategoryMufflerTowel,
		Keywords: []string{"マフラータオル"},
	},
	{
		Category: enums.HPElineupMallItemCategoryMicrofiberTowel,
		Keywords: []string{"マイクロファイバータオル"},
	},
	{
		Category: enums.HPElineupMallItemCategoryTShirt,
		Keywords: []string{"Tシャツ"},
	},
	{
		Category: enums.HPElineupMallItemCategoryClearFile,
		Keywords: []string{"クリアファイル"},
	},
	{
		Category: enums.HPElineupMallItemCategoryPhoto2L,
		Keywords: []string{"2L判", "写真"},
	},
	{
		Category: enums.HPElineupMallItemCategoryPhotoOther,
		Keywords: []string{"写真"},
	},
}
