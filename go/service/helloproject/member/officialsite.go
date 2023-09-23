package member

import (
	"context"
	"fmt"
	"net/url"
	"regexp"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/slice"
	"github.com/yssk22/hpapp/go/foundation/timeutil"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/hpartist"
	"github.com/yssk22/hpapp/go/service/ent/hpasset"
	"github.com/yssk22/hpapp/go/service/ent/hpmember"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/errors"
	"github.com/yssk22/hpapp/go/service/schema/enums"
	"github.com/yssk22/hpapp/go/service/scraping"
	"github.com/yssk22/hpapp/go/system/clock"
	"github.com/yssk22/hpapp/go/system/http/external"
	"github.com/yssk22/hpapp/go/system/settings"
	"github.com/yssk22/hpapp/go/system/slog"
)

var (
	// NumNotFoundToGraduate is a threshold to set GraduateAt date. If the scraping doesn't find a member page for N times (= 5 by default),
	// then scraper will set GraduateAt date accordingly.
	NumNotFoundToGraduate = settings.NewInt("service.helloproject.member.num_not_found_to_graduate", 5)
)

func CrawlArtists(ctx context.Context, _ any) error {
	tmp, err := scraping.Scrape(
		ctx,
		scraping.NewHTTPFetcher(ctx, artistListURL),
		artistListScraper,
	)
	if err != nil {
		return err
	}
	if tmp == nil || len(*tmp) == 0 {
		return errors.New("no artists found - may need to update scraper", errors.SlogOptions(slog.Name("helloproject.member.officialsite.crawl_artists")))
	}
	artists, err := slice.Map(*tmp, func(i int, a *ent.HPArtist) (*ent.HPArtist, error) {
		a, err := upsertArtist(ctx, a)
		if err != nil {
			return nil, errors.Wrap(ctx, err, errors.SlogOptions(slog.Name("helloproject.member.officialsite.crawl_artists")))
		}
		return a, nil
	})
	if err != nil {
		return err
	}
	slog.Info(ctx,
		"HPMembers were updated successfully",
		slog.Name("helloproject.member.officialsite.crawl_artist_profile"),
		slog.Attribute("num_members", len(artists)),
	)
	_, err = slice.Map(artists, func(i int, a *ent.HPArtist) (any, error) {
		return nil, CrawlArtistProfile(ctx, a)
	})
	return err
}

func CrawlArtistProfile(ctx context.Context, a *ent.HPArtist) error {
	purl := fmt.Sprintf(artistProfileURL, a.Key)
	tmp, err := scraping.Scrape(
		ctx,
		scraping.NewHTTPFetcher(ctx, purl),
		artistProfileScraper,
	)
	if err != nil {
		return errors.Wrap(ctx, err, errors.SlogOptions(
			slog.Name("helloproject.member.officialsite.crawl_artist_profile"),
			slog.Attribute("artist_key", a.Key),
		))
	}
	members, err := slice.MapPtr(tmp.Members, func(i int, m *ent.HPMember) (*ent.HPMember, error) {
		mprofile, err := crawlMemberProfile(ctx, m)
		if err == nil {
			m.JoinAt = mprofile.JoinAt
		} else {
			slog.Warning(ctx,
				"JoinAt was not refreshed due to member profile scraping error",
				slog.Name("helloproject.member.officialsite.crawl_artist_profile"),
				slog.Attribute("artist_key", a.Key),
				slog.Attribute("error", err.Error()),
			)
		}
		return upsertMember(ctx, m, a)
	})
	if err != nil {
		return errors.Wrap(ctx, err, errors.SlogOptions(slog.Name("helloproject.member.officialsite.crawl_artist_profile")))
	}
	slog.Info(ctx,
		"HPMembers were updated successfully",
		slog.Name("helloproject.member.officialsite.crawl_artist_profile"),
		slog.Attribute("artist_key", a.Key),
		slog.Attribute("num_members", len(members)),
	)
	// TODO: assets are associated with HPArtist but not with HPMember while some of assets (eg. Instagram assets) needs to be associated with HPMember.
	assets, err := slice.Map(tmp.Assets, func(i int, u url.URL) (*ent.HPAsset, error) {
		return upsertAsset(ctx, u, a)
	})
	if err != nil {
		return errors.Wrap(ctx, err, errors.SlogOptions(
			slog.Name("helloproject.member.officialsite.crawl_artist_profile"),
			slog.Attribute("artist_key", a.Key),
		))
	}
	slog.Info(ctx,
		"HPAssets were updated successfully",
		slog.Name("helloproject.member.officialsite.crawl_artist_profile"),
		slog.Attribute("artist_key", a.Key),
		slog.Attribute("num_assets", len(assets)),
	)
	// detect graduation
	graduations, err := markGraduationDate(ctx, a)
	if err != nil {
		return errors.Wrap(ctx, err, errors.SlogOptions(slog.Name("helloproject.member.officialsite.crawl_artist_profile")))
	}
	if len(graduations) > 0 {
		slog.Info(ctx,
			"Some HPMembers were marked as 'graduated'",
			slog.Name("helloproject.member.officialsite.crawl_artist_profile"),
			slog.Attribute("artist_key", a.Key),
			slog.Attribute("graduated_members", assert.X(slice.Map(graduations, func(i int, v *ent.HPMember) (map[string]interface{}, error) {
				return map[string]interface{}{
					"id":            v.ID,
					"key":           v.Key,
					"graduation_at": v.GraduateAt,
				}, nil
			}))),
		)
	}
	return nil
}

// cralwMemberProfile just set "JoinAt" field from the member profile page.
func crawlMemberProfile(ctx context.Context, m *ent.HPMember) (*ent.HPMember, error) {
	url := fmt.Sprintf(memberProfileURL, m.ArtistKey, m.Key)
	return scraping.Scrape(
		ctx,
		scraping.NewHTTPFetcher(ctx, url, scraping.WithHttpClient(external.FromContext(ctx))),
		memberProfileScraper,
	)

}

func markGraduationDate(ctx context.Context, a *ent.HPArtist) ([]*ent.HPMember, error) {
	threshold := settings.GetX(ctx, NumNotFoundToGraduate)
	timestamp := clock.ContextTime(ctx)
	entclient := entutil.NewClient(ctx)
	// We detect only members who were updated by crawler and don't have any graduation date value.
	unupdatedMembers, err := entclient.HPMember.Query().
		Where(
			hpmember.CrawledAtLT(timestamp),
			hpmember.GraduateAtIsNil(),
			hpmember.HasArtistWith(hpartist.IDEQ(a.ID)),
		).
		All(ctx)
	if err != nil {
		return nil, err
	}
	members, err := slice.Map(unupdatedMembers, func(i int, m *ent.HPMember) (*ent.HPMember, error) {
		update := m.Update()
		if m.ErrorCount < threshold {
			update.SetErrorCount(m.ErrorCount + 1)
			update.SetLastErrorMessage("not crawled")
		} else {
			lastCrawledAt := m.CrawledAt
			update.SetErrorCount(0)
			update.SetNillableLastErrorMessage(nil)
			update.SetGraduateAt(time.Date(lastCrawledAt.Year(), lastCrawledAt.Month(), lastCrawledAt.Day(), 23, 59, 59, 0, lastCrawledAt.Location()))
		}
		return update.Save(ctx)
	})
	if members == nil {
		return nil, err
	}
	members, _ = slice.Filter(members, func(i int, m *ent.HPMember) (bool, error) {
		return m.GraduateAt != nil, nil
	})
	return members, err
}

func upsertArtist(ctx context.Context, a *ent.HPArtist) (*ent.HPArtist, error) {
	timestamp := clock.ContextTime(ctx)
	entclient := entutil.NewClient(ctx)
	create := entclient.HPArtist.Create().
		SetKey(a.Key).
		SetThumbnailURL(a.ThumbnailURL).
		SetName(a.Name).
		SetIndex(a.Index).
		SetCrawledAt(timestamp).
		SetErrorCount(0).
		SetLastErrorMessage("")
	update := create.OnConflictColumns(hpartist.FieldKey).
		SetThumbnailURL(a.ThumbnailURL).
		SetName(a.Name).
		SetIndex(a.Index).
		SetCrawledAt(timestamp).
		SetErrorCount(0).
		SetLastErrorMessage("")
	id, err := update.ID(ctx)
	if err != nil {
		return nil, err
	}
	return entclient.HPArtist.Get(ctx, id)
}

func upsertMember(ctx context.Context, m *ent.HPMember, a *ent.HPArtist) (*ent.HPMember, error) {
	timestamp := clock.ContextTime(ctx)
	entclient := entutil.NewClient(ctx)
	create := entclient.HPMember.Create().
		SetKey(m.Key).
		SetArtist(a).
		SetArtistKey(a.Key).
		SetName(m.Name).
		SetNameKana(m.NameKana).
		SetThumbnailURL(m.ThumbnailURL).
		SetDateOfBirth(m.DateOfBirth).
		SetBloodType(m.BloodType).
		SetHometown(m.Hometown).
		SetNillableJoinAt(m.JoinAt).
		SetCrawledAt(timestamp).
		SetErrorCount(0).
		SetLastErrorMessage("")
	upsert := create.OnConflictColumns(hpmember.FieldKey).
		SetThumbnailURL(m.ThumbnailURL).
		SetJoinAt(*m.JoinAt).
		SetCrawledAt(timestamp).
		SetErrorCount(0).
		SetLastErrorMessage("")
	id, err := upsert.ID(ctx)
	if err != nil {
		return nil, err
	}
	return entclient.HPMember.Get(ctx, id)
}

func upsertAsset(ctx context.Context, u url.URL, a *ent.HPArtist) (*ent.HPAsset, error) {
	assetKey, assetType := getMatchedAsset(u)
	if assetKey == "" {
		return nil, nil
	}
	entclient := entutil.NewClient(ctx)
	create := entclient.HPAsset.Create().SetKey(assetKey).SetAssetType(assetType).SetArtist(a)

	// Why not using DoNothing? See https://github.com/ent/ent/issues/1821
	upsert := create.OnConflictColumns(hpasset.FieldKey, hpasset.FieldAssetType).Ignore()
	id, err := upsert.ID(ctx)
	if err != nil {
		return nil, err
	}
	return entclient.HPAsset.Get(ctx, id)
}

const artistListURL = "http://www.helloproject.com/artist/"

var artistListScraper = scraping.HTML(func(ctx context.Context, doc *goquery.Document, _ *scraping.HTMLHead) (*[]*ent.HPArtist, error) {
	var list []*ent.HPArtist
	doc.Find("div.mbox nav.artist_listbox a").Each(func(i int, link *goquery.Selection) {
		var img *goquery.Selection
		var a ent.HPArtist
		if img = link.Find("img"); img == nil {
			return
		}
		if href, ok := link.Attr("href"); ok {
			a.Key = strings.Trim(href, "/")
		}
		if src, ok := img.Attr("src"); ok {
			a.ThumbnailURL = src
		}
		if alt, ok := img.Attr("alt"); ok {
			a.Name = alt
		}
		// exclude 研修生ユニット
		if strings.Contains(a.Name, "研修生") {
			return
		}
		a.Index = i
		list = append(list, &a)
	})
	return &list, nil
})

const artistProfileURL = "http://www.helloproject.com/%s/profile/"

type artistProfile struct {
	Members []ent.HPMember
	Assets  []url.URL
}

var reWhitespace = regexp.MustCompile(`\s+`)
var reProfileLink = regexp.MustCompile(`/([^/]+)/profile/([^/]+)`)

var artistProfileScraper = scraping.HTML(func(ctx context.Context, doc *goquery.Document, _ *scraping.HTMLHead) (*artistProfile, error) {
	var result = &artistProfile{
		Members: []ent.HPMember{},
		Assets:  []url.URL{},
	}

	doc.Find("ul#profile_memberlist li").Each(func(i int, li *goquery.Selection) {
		var nameDiv, profileLink, thumbnailImg *goquery.Selection
		var m ent.HPMember

		if nameDiv = li.Find("div.name"); nameDiv == nil {
			return
		}
		if profileLink = li.Find("div.photo_box a"); profileLink == nil {
			return
		}
		if thumbnailImg = profileLink.Find("img"); thumbnailImg == nil {
			return
		}
		profileLinkMatch := reProfileLink.FindStringSubmatch(profileLink.AttrOr("href", ""))
		m.ArtistKey = profileLinkMatch[1]
		m.Key = profileLinkMatch[2]
		m.ThumbnailURL = thumbnailImg.AttrOr("src", "")
		m.Name = nameDiv.Find("h4").Text()
		m.NameKana = reWhitespace.ReplaceAllString(
			strings.TrimPrefix(nameDiv.Text(), m.Name),
			"",
		)
		var currentDt string
		li.Find("div.item dl").Children().Each(func(j int, dtdd *goquery.Selection) {
			if dtdd.Is("dt") {
				currentDt = strings.TrimSpace(dtdd.Text())
			} else if dtdd.Is("dd") {
				value := dtdd.Text()
				switch currentDt {
				case "生年月日":
					m.DateOfBirth = timeutil.ParseJPDate(value, -1)
				case "血液型":
					m.BloodType = strings.TrimSuffix(value, "型")
				case "出身地":
					m.Hometown = value
				default:
					break
				}
			}
		})
		result.Members = append(result.Members, m)
	})

	doc.Find("div#banner_box ul li a").Each(func(i int, a *goquery.Selection) {
		parsed, err := url.Parse(a.AttrOr("href", ""))
		if err != nil {
			return
		}
		result.Assets = append(result.Assets, *parsed)
	})
	return result, nil
})

const memberProfileURL = "http://www.helloproject.com/%s/profile/%s/"

var memberProfileScraper = scraping.HTML(func(ctx context.Context, doc *goquery.Document, _ *scraping.HTMLHead) (*ent.HPMember, error) {
	var m ent.HPMember
	var currentDt string
	doc.Find("div#artist_text dl").Children().Each(func(j int, dtdd *goquery.Selection) {
		if dtdd.Is("dt") {
			currentDt = strings.TrimSpace(dtdd.Text())
		} else if dtdd.Is("dd") {
			value := dtdd.Text()
			switch currentDt {
			case "ハロー！プロジェクト加入":
				t := timeutil.ParseJPDate(value, -1)
				m.JoinAt = &t
			default:
				break
			}
		}
	})
	return &m, nil
})

type assetTypeResolver struct {
	hostname  string
	keyRegexp *regexp.Regexp
	assetType enums.HPAssetType
}

var supportedAssetTypes = []*assetTypeResolver{
	{
		hostname:  "www.youtube.com",
		assetType: enums.HPAssetTypeYoutube,
		keyRegexp: regexp.MustCompile("/c/([^/]+)"),
	},
	{
		hostname:  "twitter.com",
		assetType: enums.HPAssetTypeTwitter,
		keyRegexp: regexp.MustCompile("/([^/]+)"),
	},
	{
		hostname:  "www.instagram.com",
		assetType: enums.HPAssetTypeInstagram,
		keyRegexp: regexp.MustCompile("/([^/]+)"),
	},
	{
		hostname:  "www.tiktok.com",
		assetType: enums.HPAssetTypeTiktok,
		keyRegexp: regexp.MustCompile("/([^/]+)"),
	},
	{
		hostname:  "ameblo.jp",
		assetType: enums.HPAssetTypeAmeblo,
		keyRegexp: regexp.MustCompile("/([^/]+)"),
	},
}

func getMatchedAsset(u url.URL) (string, enums.HPAssetType) {
	for _, t := range supportedAssetTypes {
		if t.hostname == u.Hostname() {
			found := t.keyRegexp.FindStringSubmatch(u.EscapedPath())
			if len(found) < 1 {
				return "", enums.HPAssetType("unknown")
			}
			return found[1], t.assetType
		}
	}
	return "", enums.HPAssetType("unknown")
}
