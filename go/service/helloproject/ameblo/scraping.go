package ameblo

import (
	"context"
	"encoding/json"
	"fmt"
	"net/url"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/robertkrimen/otto"
	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/foundation/object"
	"hpapp.yssk22.dev/go/foundation/slice"
	"hpapp.yssk22.dev/go/foundation/stringutil"
	"hpapp.yssk22.dev/go/service/ent"
	"hpapp.yssk22.dev/go/service/schema/jsonfields"
	"hpapp.yssk22.dev/go/service/scraping"
)

type postInitData struct {
	EntryState struct {
		EntryMap     map[string]postEntryData `json:"entryMap"`
		EntryMetaMap map[string]struct {
			Paging struct {
				Prev int64 `json:"prev"`
				Next int64 `json:"next"`
			} `json:"paging"`
		} `json:"entryMetaMap"`
	} `json:"entryState"`
	BloggerState struct {
		BlogMap map[string]blogData `json:"blogMap"`
	} `json:"bloggerState"`
}

type postEntryData struct {
	EntryID              int64     `json:"entry_id"`
	BlogID               int64     `json:"blog_id"`
	ThemeID              int64     `json:"theme_id"`
	ThemeName            string    `json:"theme_name"`
	UserID               int64     `json:"user_id"`
	EntryTitle           string    `json:"entry_title"`
	EntryText            string    `json:"entry_text"`
	EntryCreatedDateTime time.Time `json:"entry_created_datetime"`

	AmebaID  string
	NextPath *string
	PrevPath *string

	Description string

	BlogData  blogData
	ImageUrls []string
	Likes     *int
	Comments  *int
	Reblogs   *int
}

type blogData struct {
	BlogID   int64  `json:"blog_id"`
	BlogName string `json:"blog_name"`
}

func (p *postEntryData) getMedia() []jsonfields.Media {
	matched := amebloUserImageRegExp.FindAllString(p.EntryText, -1)
	return assert.X(slice.Map(matched, func(i int, url string) (jsonfields.Media, error) {
		return jsonfields.Media{
			Url: strings.Trim(url, "\""),
		}, nil
	}))
}

func (p *postEntryData) ToEnt() *ent.HPAmebloPost {
	newPost := &ent.HPAmebloPost{
		Likes:    new(int),
		Comments: new(int),
		Reblogs:  new(int),
	}
	newPost.Path = fmt.Sprintf("/%s/entry-%d.html", p.AmebaID, p.EntryID)
	newPost.Title = p.EntryTitle
	if p.Description != "" {
		newPost.Description = p.Description
	} else {
		newPost.Description = p.EntryText
	}
	newPost.PostAt = p.EntryCreatedDateTime
	newPost.Theme = &p.ThemeName
	newPost.NextPath = p.NextPath
	newPost.PrevPath = p.PrevPath
	newPost.Images = p.getMedia()
	return newPost
}

var amebloEntryIDUrlRegExp = regexp.MustCompile(`\/([^/]+)\/entry-(\d+)\.html`)
var amebloInitDataRegExp = regexp.MustCompile(`(?s)window\.INIT_DATA\s*=\s*({.*});\s*window\.RESOURCE_BASE_URL`)
var amebloUserImageRegExp = regexp.MustCompile(`"https:\/\/stat.ameba.jp\/user_images\/[^"]+\.jpg"`)

var amebloPostScraper = scraping.HTML(func(ctx context.Context, doc *goquery.Document, head *scraping.HTMLHead) (*postEntryData, error) {
	path := urlToPath(head.Canonical)
	matched := amebloEntryIDUrlRegExp.FindStringSubmatch(path)
	if len(matched) != 3 {
		return nil, fmt.Errorf("invaild url format: %s", path)
	}
	amebaID := matched[1]
	entryID := matched[2]
	var initDataRaw string
	var initData postInitData
	var entryData postEntryData
	doc.Find("script").Each(func(_ int, s *goquery.Selection) {
		script := s.Text()
		matched := amebloInitDataRegExp.FindStringSubmatch(script)
		if len(matched) == 2 {
			initDataRaw = matched[1]
		}
	})
	if initDataRaw == "" {
		return nil, fmt.Errorf("no INIT_DATA found")
	}

	initDataJSON, err := evalInitData(initDataRaw)
	if err != nil {
		return nil, fmt.Errorf("failed to evaluate initData - %s: %v", string(initDataRaw), err)
	}
	if err = json.Unmarshal([]byte(initDataJSON), &initData); err != nil {
		return nil, fmt.Errorf("failed to evaluate initData - %s: %v", string(initDataRaw), err)
	}
	entryData, ok := initData.EntryState.EntryMap[entryID]
	if !ok {
		return nil, fmt.Errorf("EntryID %s is not found in entry map - %s: %v", entryID, string(initDataRaw), err)
	}
	metaData, ok := initData.EntryState.EntryMetaMap[entryID]
	if !ok {
		return nil, fmt.Errorf("EntryID %s is not found in entry meta map - %s: %v", entryID, string(initDataRaw), err)
	}
	if metaData.Paging.Next != 0 {
		entryData.NextPath = object.Nullable(fmt.Sprintf("/%s/entry-%d.html", amebaID, metaData.Paging.Next))
	}
	if metaData.Paging.Prev != 0 {
		entryData.PrevPath = object.Nullable(fmt.Sprintf("/%s/entry-%d.html", amebaID, metaData.Paging.Prev))
	}
	entryData.AmebaID = amebaID
	entryData.Description = stringutil.Or(head.Meta.Get("twitter:description"), head.Meta.Get("og:description"))

	entryData.BlogData, ok = initData.BloggerState.BlogMap[fmt.Sprintf("%d", entryData.BlogID)]
	if !ok {
		return nil, fmt.Errorf("BlogData %d is not found in blog map - %s: %v", entryData.BlogID, string(initDataRaw), err)
	}

	matched = amebloUserImageRegExp.FindAllString(entryData.EntryText, -1)
	entryData.ImageUrls = assert.X(slice.Map(matched, func(i int, url string) (string, error) {
		return strings.Trim(url, "\""), nil
	}))
	return &entryData, err
})

type amebloPostStats struct {
	Data map[string]struct {
		Comments int `json:"commentCnt"`
		Likes    int `json:"iineCnt"`
		Reblogs  int `json:"reblogCnt"`
	} `json:"data"`
}

var amebloPostStatsScraper = scraping.JSON[amebloPostStats]()

func urlToPath(s string) string {
	parsed, err := url.Parse(s)
	if err != nil {
		return ""
	}
	return parsed.Path
}

var (
	vm     = otto.New()
	vmLock = &sync.Mutex{}
)

func evalInitData(initData string) (string, error) {
	vmLock.Lock()
	defer vmLock.Unlock()
	value, err := vm.Run(fmt.Sprintf("JSON.stringify(%s)", initData))
	if err != nil {
		return "", err
	}
	return value.String(), nil
}
