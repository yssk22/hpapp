package blob

import (
	"context"
	"testing"
	"time"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/foundation/timeutil"
	"hpapp.yssk22.dev/go/service/bootstrap/test"
	"hpapp.yssk22.dev/go/service/ent/hpmember"
	"hpapp.yssk22.dev/go/service/entutil"
	"hpapp.yssk22.dev/go/service/schema/enums"
	"hpapp.yssk22.dev/go/system/storage"
)

func TestMediaCrawler(t *testing.T) {
	var timestamp = time.Date(2020, 10, 30, 0, 0, 0, 0, timeutil.JST)

	test.New(
		"image",
		test.WithHPMaster(),
		test.WithContextTime(timestamp),
		test.WithNow(timestamp),
	).Run(t, func(ctx context.Context, tt *testing.T) {
		a := assert.NewTestAssert(t)
		crawler := NewCrawler()
		entClient := entutil.NewClient(ctx)
		risa := entClient.HPMember.Query().WithArtist().Where(hpmember.KeyEQ("risa_irie")).FirstX(ctx)
		image, err := crawler.Crawl(ctx,
			enums.HPBlobTypeImage,
			enums.HPBlobSubTypeJpeg,
			"https://stat.ameba.jp/user_images/20220915/21/juicejuice-official/e1/3f/j/o1080144015175167070.jpg",
			SourceHTMLURL("https://ameblo.jp/juicejuice-official/entry-12764506169.html"),
			OwnerArtistID(risa.Edges.Artist.ID),
			OwnerMemberID(risa.ID),
		)
		a.Nil(err)
		a.Snapshot("image", image)
		a.Equals(risa.ID, image.OwnerMemberID)
		a.Equals(risa.Edges.Artist.ID, image.OwnerArtistID)
		a.Equals(enums.HPBlobStatusReadyToHost, image.Status)
		a.Equals("hpblob.hpapp.yssk22.dev/stat.ameba.jp/user_images/20220915/21/juicejuice-official/e1/3f/j/o1080144015175167070.jpg", image.StoragePath)
		a.OK(storage.FromContext(ctx).Exists(ctx, image.StoragePath))

		// recrawl to update the owner and artist edges
		reina := entClient.HPMember.Query().WithArtist().Where(hpmember.KeyEQ("reina_yokoyama")).FirstX(ctx)
		image, err = crawler.Crawl(ctx,
			enums.HPBlobTypeImage,
			enums.HPBlobSubTypeJpeg,
			"https://stat.ameba.jp/user_images/20220915/21/juicejuice-official/e1/3f/j/o1080144015175167070.jpg",
			SourceHTMLURL("https://ameblo.jp/juicejuice-official/entry-12764506169.html"),
			OwnerArtistID(reina.Edges.Artist.ID),
			OwnerMemberID(reina.ID),
		)
		a.Nil(err)
		a.Equals(reina.ID, image.OwnerMemberID)
		a.Equals(reina.Edges.Artist.ID, image.OwnerArtistID)
		a.Equals(enums.HPBlobStatusReadyToHost, image.Status)
	})

	test.New("video",
		test.WithHPMaster(),
		test.WithContextTime(timestamp),
		test.WithNow(timestamp),
	).Run(t, func(ctx context.Context, t *testing.T) {
		// assuming the video download from Instagram.
		// The blob source URL is ephemeral and can be expired so we use StoragePath with shortcode for them to be identical on the storage.
		igVideoUrl := "https://scontent-pmo1-1.cdninstagram.com/v/t50.2886-16/266728965_311864847475681_8517634747858073846_n.mp4?efg=eyJ2ZW5jb2RlX3RhZyI6InZ0c192b2RfdXJsZ2VuLjcyMC5jbGlwcy5iYXNlbGluZSIsInFlX2dyb3VwcyI6IltcImlnX3dlYl9kZWxpdmVyeV92dHNfb3RmXCJdIn0&_nc_ht=scontent-pmo1-1.cdninstagram.com&_nc_cat=101&_nc_ohc=hUYdnhhG3sgAX9QkVX3&edm=AABBvjUBAAAA&vs=647744176590012_4114347912&_nc_vs=HBksFQAYJEdBWDI1US1obzNPeG94c0JBUGE0bXNDc3R6UjJicV9FQUFBRhUAAsgBABUAGCRHSWlKMGc4MXJ6YUgwU2tDQUJReWVtY0tOX1o1YnFfRUFBQUYVAgLIAQAoABgAGwAVAAAmiquV6r75zUAVAigCQzMsF0Az5mZmZmZmGBJkYXNoX2Jhc2VsaW5lXzFfdjERAHX%2BBwA%3D&_nc_rid=97acd427dc&ccb=7-5&oh=00_AfCqPqfw67QEjFmGl7OI-EWai4PLZMObIX80mMQe0yYL5A&oe=64625902&_nc_sid=83d603"
		igVideoThumbnailUrl := "https://scontent-pmo1-1.cdninstagram.com/v/t51.2885-15/266933155_265022012201456_999151665801200894_n.jpg?stp=dst-jpg_e35&_nc_ht=scontent-pmo1-1.cdninstagram.com&_nc_cat=108&_nc_ohc=-2Ierrxls64AX87UYQt&edm=AABBvjUBAAAA&ccb=7-5&oh=00_AfBN8Ydm0lHWuvJbzNtzRU9frESOK2hhtWL-R5f8LK_s0g&oe=6462E161&_nc_sid=83d603"
		storagePath := GetStoragePathFromUrl(ctx, "https://www.instagram.com/p/CXdvgAuhK2G/video.mp4")
		thumbnailStoragePath := GetStoragePathFromUrl(ctx, "https://www.instagram.com/p/CXdvgAuhK2G/image.jpg")
		a := assert.NewTestAssert(t)
		crawler := NewCrawler()
		entClient := entutil.NewClient(ctx)
		risa := entClient.HPMember.Query().WithArtist().Where(hpmember.KeyEQ("risa_irie")).FirstX(ctx)
		video, err := crawler.Crawl(ctx,
			enums.HPBlobTypeVideo,
			enums.HPBlobSubTypeMp4,
			igVideoUrl,
			SourceHTMLURL("https://www.instagram.com/p/CXdvgAuhK2G/"),
			StoragePath(storagePath),
			OwnerArtistID(risa.Edges.Artist.ID),
			OwnerMemberID(risa.ID),
			ThumbnailSourceImageURL(igVideoThumbnailUrl),
			ThumbnailStoragePath(thumbnailStoragePath),
		)
		a.Nil(err)
		a.Snapshot("video", video)
		a.Equals(risa.ID, video.OwnerMemberID)
		a.Equals(risa.Edges.Artist.ID, video.OwnerArtistID)
		a.Equals(enums.HPBlobStatusReadyToHost, video.Status)
		a.Equals("hpblob.hpapp.yssk22.dev/www.instagram.com/p/CXdvgAuhK2G/video.mp4", video.StoragePath)
		a.OK(storage.FromContext(ctx).Exists(ctx, video.StoragePath))

		// recrawl
		reina := entClient.HPMember.Query().WithArtist().Where(hpmember.KeyEQ("reina_yokoyama")).FirstX(ctx)
		video, err = crawler.Crawl(ctx,
			enums.HPBlobTypeVideo,
			enums.HPBlobSubTypeMp4,
			igVideoUrl,
			SourceHTMLURL("https://www.instagram.com/p/CXdvgAuhK2G/"),
			StoragePath(storagePath),
			OwnerArtistID(reina.Edges.Artist.ID),
			OwnerMemberID(reina.ID),
			ThumbnailSourceImageURL(igVideoThumbnailUrl),
			ThumbnailStoragePath(thumbnailStoragePath),
		)

		a.Nil(err)
		a.Equals(reina.ID, video.OwnerMemberID)
		a.Equals(reina.Edges.Artist.ID, video.OwnerArtistID)
		a.Equals(enums.HPBlobStatusReadyToHost, video.Status)
	})

	test.New(
		"html",
		test.WithHPMaster(),
		test.WithContextTime(timestamp),
		test.WithNow(timestamp),
	).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		crawler := NewCrawler()
		entClient := entutil.NewClient(ctx)
		mizuki := entClient.HPMember.Query().WithArtist().Where(hpmember.KeyEQ("mizuki_fukumura")).FirstX(ctx)
		html, err := crawler.Crawl(ctx,
			enums.HPBlobTypeText,
			enums.HPBlobSubTypeHtml,
			"https://ameblo.jp/morningmusume-9ki/entry-12793611077.html",
			OwnerArtistID(mizuki.Edges.Artist.ID),
			OwnerMemberID(mizuki.ID),
		)
		a.Nil(err)
		a.Snapshot("html", html)
		a.Equals(mizuki.ID, html.OwnerMemberID)
		a.Equals(mizuki.Edges.Artist.ID, html.OwnerArtistID)
		a.Equals(enums.HPBlobStatusReadyToHost, html.Status)
		a.Equals("hpblob.hpapp.yssk22.dev/ameblo.jp/morningmusume-9ki/entry-12793611077.html", html.StoragePath)
		a.OK(storage.FromContext(ctx).Exists(ctx, html.StoragePath))

		// recrawl
		reina := entClient.HPMember.Query().WithArtist().Where(hpmember.KeyEQ("reina_yokoyama")).FirstX(ctx)
		html, err = crawler.Crawl(ctx,
			enums.HPBlobTypeVideo,
			enums.HPBlobSubTypeMp4,
			"https://ameblo.jp/morningmusume-9ki/entry-12793611077.html",
			OwnerArtistID(reina.Edges.Artist.ID),
			OwnerMemberID(reina.ID),
		)

		a.Nil(err)
		a.Equals(reina.ID, html.OwnerMemberID)
		a.Equals(reina.Edges.Artist.ID, html.OwnerArtistID)
		a.Equals(enums.HPBlobStatusReadyToHost, html.Status)
	})
}
