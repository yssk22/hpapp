package ameblo

import (
	"context"
	"testing"
	"time"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/object"
	"github.com/yssk22/hpapp/go/foundation/timeutil"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/bootstrap/test"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/hpameblopost"
	"github.com/yssk22/hpapp/go/service/ent/hpartist"
	"github.com/yssk22/hpapp/go/service/ent/hpblob"
	"github.com/yssk22/hpapp/go/service/ent/hpfeeditem"
	"github.com/yssk22/hpapp/go/service/ent/hpmember"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/helloproject/blob"
	"github.com/yssk22/hpapp/go/service/helloproject/member"
	"github.com/yssk22/hpapp/go/service/helloproject/user"
	"github.com/yssk22/hpapp/go/service/push"
	"github.com/yssk22/hpapp/go/service/schema/enums"
	"github.com/yssk22/hpapp/go/system/http/external"
	spush "github.com/yssk22/hpapp/go/system/push"
	"github.com/yssk22/hpapp/go/system/storage"
)

func TestAmeblo(t *testing.T) {
	var s = NewService(blob.NewCrawler(), member.NewSimpleTextMatchingTagger()).(*amebloService)

	t.Run("Crawler", func(t *testing.T) {
		test.New("Baseline", test.WithHPMaster(), test.WithFixedTimestamp()).Run(t, func(ctx context.Context, tt *testing.T) {
			a := assert.NewTestAssert(t)
			post, err := s.crawl(ctx, "https://ameblo.jp/morningmusume-9ki/entry-12599278025.html", true)
			a.Nil(err)
			post = entutil.NewClient(ctx).HPAmebloPost.Query().
				WithBlobs(func(q *ent.HPBlobQuery) {
					q.WithOwnerArtist().WithOwnerMember().Order(ent.Asc(hpblob.FieldID))
				}).
				WithAsset().
				WithOwnerMember().WithTaggedMembers(func(q *ent.HPMemberQuery) { q.Order(ent.Asc(hpmember.FieldID)) }).
				WithOwnerArtist().WithTaggedArtists(func(q *ent.HPArtistQuery) { q.Order(ent.Asc(hpartist.FieldID)) }).
				Where(hpameblopost.IDEQ(post.ID)).
				FirstX(ctx)

			a.Snapshot("baseline.post", post)
			feedItem := entutil.NewClient(ctx).HPFeedItem.Query().
				WithOwnerArtist().WithOwnerMember().
				Where(hpfeeditem.SourceIDEQ(post.ID), hpfeeditem.AssetTypeEQ(enums.HPAssetTypeAmeblo)).FirstX(ctx)
			a.Snapshot("baseline.feed", feedItem)
		})

		test.New("AmebloIsInMaintenance",
			test.WithHPMaster(),
			test.WithFixedTimestamp(),
		).Run(t, func(ctx context.Context, t *testing.T) {
			t.Run("NewContent", func(t *testing.T) {
				a := assert.NewTestAssert(t)
				// we put the dummy response file on testdata/httpsnapshot/ameblo.jp/entry-dummy-503.html, which we got while Ameblo was in maintenance.
				url := "https://ameblo.jp/morningmusume-9ki/entry-dummy-503.html"
				post, err := s.crawl(ctx, url, true)
				a.NotNil(err)
				a.Equals(ErrAmebaIsInMaitenance, err)
				a.Nil(post)
				entblob := assert.X(blob.Get(ctx, url))
				a.Equals(enums.HPBlobStatusError, entblob.Status)
			})
			t.Run("ExistingContent", func(t *testing.T) {
				a := assert.NewTestAssert(t)
				entclient := entutil.NewClient(ctx)
				blobstorage := storage.FromContext(ctx)
				a.Nil(blobstorage.Delete(ctx, "hpblob.hpapp.yssk22.dev/ameblo.jp/morningmusume-9ki/entry-12599495429.html"))

				// create a stub content to emulate 200 case.
				external.CreateHttpSnapshot("testdata/httpsnapshot/ameblo.jp/morningmusume-9ki/entry-12599495429.html",
					external.HttpStatusCode(200),
					external.HttpStatus("ok"),
					external.ContentFromFile("testdata/posts/entry-12599495429.html"),
				)

				post, err := s.crawl(ctx, "https://ameblo.jp/morningmusume-9ki/entry-12599495429.html", true)
				a.Nil(err)
				a.NotNil(post)
				content := assert.X(storage.ReadAll(ctx, "hpblob.hpapp.yssk22.dev/ameblo.jp/morningmusume-9ki/entry-12599495429.html"))
				a.OK(len(content) > 0)

				// then it eventually returns 503 error
				// overwrite the snapshot contents with 0 byte 503 resposne.
				external.CreateHttpSnapshot("testdata/httpsnapshot/ameblo.jp/morningmusume-9ki/entry-12599495429.html",
					external.HttpStatusCode(503),
					external.HttpStatus("503 Service Unavailable"),
				)
				_, err = s.crawl(ctx, "https://ameblo.jp/morningmusume-9ki/entry-12599495429.html", true)
				a.NotNil(err)
				post = entclient.HPAmebloPost.GetX(ctx, post.ID)
				a.Equals(0, post.ErrorCount)
				a.Nil(post.LastErrorMessage)
				cachedContent := assert.X(storage.ReadAll(ctx, "hpblob.hpapp.yssk22.dev/ameblo.jp/morningmusume-9ki/entry-12599495429.html"))
				a.Equals(len(content), len(cachedContent))

				// it returns back
				external.CreateHttpSnapshot("testdata/httpsnapshot/ameblo.jp/morningmusume-9ki/entry-12599495429.html",
					external.HttpStatusCode(200),
					external.HttpStatus("ok"),
					external.ContentFromFile("testdata/posts/entry-12599495429.html"),
				)

				post, err = s.crawl(ctx, "https://ameblo.jp/morningmusume-9ki/entry-12599495429.html", true)
				a.Nil(err)
				a.NotNil(post)
				content = assert.X(storage.ReadAll(ctx, "hpblob.hpapp.yssk22.dev/ameblo.jp/morningmusume-9ki/entry-12599495429.html"))
				a.OK(len(content) > 0)
				a.Snapshot("maintenance-existing-content.post", post)
			})
		})
		test.New("ContentIsRemoved",
			test.WithHPMaster(),
			test.WithFixedTimestamp(),
		).Run(t, func(ctx context.Context, t *testing.T) {
			// some members (e.g. Riai-chan) remove their posts casually so we need to define the behavior.
			// we the keep post ent and blob ent it with ErrorMessage
			a := assert.NewTestAssert(t)

			external.CreateHttpSnapshot("testdata/httpsnapshot/ameblo.jp/juicejuice-official/entry-12802115195.html",
				external.HttpStatusCode(200),
				external.HttpStatus("OK"),
				external.ContentFromFile("testdata/posts/entry-12802115195.html"),
			)

			post, err := s.crawl(ctx, "https://ameblo.jp/juicejuice-official/entry-12802115195.html", true)
			a.Nil(err)
			a.NotNil(post)
			content := assert.X(storage.ReadAll(ctx, "hpblob.hpapp.yssk22.dev/ameblo.jp/juicejuice-official/entry-12802115195.html"))
			a.OK(len(content) > 0)

			external.CreateHttpSnapshot("testdata/httpsnapshot/ameblo.jp/juicejuice-official/entry-12802115195.html",
				external.HttpStatusCode(404),
				external.HttpStatus("404 Not Found"),
			)

			_, err = s.crawl(ctx, "https://ameblo.jp/juicejuice-official/entry-12802115195.html", true)
			a.NotNil(err)
			post, err = GetPostByUrl(ctx, "https://ameblo.jp/juicejuice-official/entry-12802115195.html")
			a.Nil(err)
			a.Equals(1, post.ErrorCount)
			a.Equals("requested URL returns unsuccessful http status code: 404", *post.LastErrorMessage)
			cachedContent := assert.X(storage.ReadAll(ctx, "hpblob.hpapp.yssk22.dev/ameblo.jp/juicejuice-official/entry-12802115195.html"))
			a.Equals(content, cachedContent)

			external.CreateHttpSnapshot("testdata/httpsnapshot/ameblo.jp/juicejuice-official/entry-12802115195.html",
				external.HttpStatusCode(200),
				external.HttpStatus("OK"),
				external.ContentFromFile("testdata/posts/entry-12802115195.html"),
			)

			post, err = s.crawl(ctx, "https://ameblo.jp/juicejuice-official/entry-12802115195.html", true)
			a.Nil(err)
			a.NotNil(post)
			a.Equals(0, post.ErrorCount)
			a.Nil(post.LastErrorMessage)
		})

		test.New("OG",
			test.WithHPMaster(),
			test.WithFixedTimestamp(),
		).Run(t, func(ctx context.Context, t *testing.T) {
			a := assert.NewTestAssert(t)
			member := entutil.NewClient(ctx).HPMember.Query().Where(hpmember.KeyEQ("riho_sayashi")).FirstX(ctx)
			post, err := s.crawl(ctx, "https://ameblo.jp/morningmusume-9ki/entry-12039339130.html", true)
			a.Nil(err)
			a.Equals(post.QueryOwnerMember().FirstIDX(ctx), member.ID)
			a.Snapshot("og.post", post)
		})

		t.Run("OwnershipResolution", func(t *testing.T) {
			test.New("No owner name in Theme", test.WithHPMaster(), test.WithFixedTimestamp()).Run(t, func(ctx context.Context, tt *testing.T) {
				a := assert.NewTestAssert(t)
				member := entutil.NewClient(ctx).HPMember.Query().Where(hpmember.KeyEQ("sakura_ishiyama")).FirstX(ctx)
				post, err := s.crawl(ctx, "https://ameblo.jp/juicejuice-official/entry-12797578027.html", true)
				a.Nil(err)
				a.Equals(post.QueryOwnerMember().FirstIDX(ctx), member.ID)
			})

			test.New("No owner name in EntryTitle", test.WithHPMaster(), test.WithFixedTimestamp()).Run(t, func(ctx context.Context, tt *testing.T) {
				a := assert.NewTestAssert(t)
				member := entutil.NewClient(ctx).HPMember.Query().Where(hpmember.KeyEQ("akari_takeuchi")).FirstX(ctx)
				post, err := s.crawl(ctx, "https://ameblo.jp/angerme-amerika/entry-12792338631.html", true)
				a.Nil(err)
				a.Equals(post.QueryOwnerMember().FirstIDX(ctx), member.ID)
			})

			test.New("Multiple names in EntryTitle", test.WithHPMaster(), test.WithFixedTimestamp()).Run(t, func(ctx context.Context, tt *testing.T) {
				a := assert.NewTestAssert(t)
				member := entutil.NewClient(ctx).HPMember.Query().Where(hpmember.KeyEQ("ayumi_ishida")).FirstX(ctx)
				post, err := s.crawl(ctx, "https://ameblo.jp/morningmusume-10ki/entry-12540780771.html", true)
				a.Nil(err)
				a.Equals(post.QueryOwnerMember().FirstIDX(ctx), member.ID)

				// Issue #71
				post, err = s.crawl(ctx, "https://ameblo.jp/mm-12ki/entry-12857225326.html", true)
				a.Nil(err)
				member = post.QueryOwnerMember().OnlyX(ctx)
				a.Equals("野中美希", member.Name)

				post, err = s.crawl(ctx, "https://ameblo.jp/mm-12ki/entry-12856792074.html", true)
				a.Nil(err)
				member = post.QueryOwnerMember().OnlyX(ctx)
				a.Equals("牧野真莉愛", member.Name)

			})

			test.New("Conflict between Theme and EntryTitle", test.WithHPMaster(), test.WithFixedTimestamp()).Run(t, func(ctx context.Context, tt *testing.T) {
				a := assert.NewTestAssert(t)
				member := entutil.NewClient(ctx).HPMember.Query().Where(hpmember.KeyEQ("yuka_miyazaki")).FirstX(ctx)
				post, err := s.crawl(ctx, "https://ameblo.jp/juicejuice-official/entry-11599064407.html", true)
				a.Nil(err)
				a.Equals(post.QueryOwnerMember().FirstIDX(ctx), member.ID)
			})

			test.New("No owner name in Theme and EntryTitle", test.WithHPMaster(), test.WithFixedTimestamp()).Run(t, func(ctx context.Context, tt *testing.T) {
				a := assert.NewTestAssert(t)
				member := entutil.NewClient(ctx).HPMember.Query().Where(hpmember.KeyEQ("kaede_kaga")).FirstX(ctx)
				post, err := s.crawl(ctx, "https://ameblo.jp/morningm-13ki/entry-12340773412.html", true)
				a.Nil(err)
				a.Equals(post.QueryOwnerMember().FirstIDX(ctx), member.ID)
			})

			test.New("By staff", test.WithHPMaster(), test.WithFixedTimestamp()).Run(t, func(ctx context.Context, tt *testing.T) {
				a := assert.NewTestAssert(t)
				artist := entutil.NewClient(ctx).HPArtist.Query().Where(hpartist.KeyEQ("morningmusume")).FirstX(ctx)
				post, err := s.crawl(ctx, "https://ameblo.jp/morningmusume-9ki/entry-11620694542.html", true)
				a.Nil(err)
				a.Equals(0, post.QueryOwnerMember().CountX(ctx))
				a.Equals(post.QueryOwnerArtist().FirstIDX(ctx), artist.ID)

				feedItem := entutil.NewClient(ctx).HPFeedItem.Query().
					WithOwnerArtist().WithOwnerMember().
					Where(hpfeeditem.SourceIDEQ(post.ID), hpfeeditem.AssetTypeEQ(enums.HPAssetTypeAmeblo)).FirstX(ctx)
				a.Equals(feedItem.Edges.OwnerArtist.ID, artist.ID)
				a.Nil(feedItem.Edges.OwnerMember)
			})

			test.New("Multikey member", test.WithHPMaster(), test.WithFixedTimestamp()).Run(t, func(ctx context.Context, tt *testing.T) {
				a := assert.NewTestAssert(t)
				post, err := s.crawl(ctx, "https://ameblo.jp/kobushi-factory/entry-12585884032.html", true)
				a.Nil(err)
				member := post.QueryOwnerMember().OnlyX(ctx)
				a.Equals("井上玲音", member.Name)
				a.Equals("rei_inoue_k", member.Key)

				post, err = s.crawl(ctx, "https://ameblo.jp/juicejuice-official/entry-12586444398.html", true)
				a.Nil(err)
				member = post.QueryOwnerMember().OnlyX(ctx)
				a.Equals("井上玲音", member.Name)
				a.Equals("rei_inoue", member.Key)
			})
		})

		test.New(
			"Notification",
			test.WithHPMaster(),
			test.WithNow(time.Date(2020, 05, 24, 22, 30, 0, 0, timeutil.JST)),
			test.WithContextTime(time.Date(2020, 05, 24, 22, 30, 0, 0, timeutil.JST)),
		).Run(t, func(ctx context.Context, tt *testing.T) {
			a := assert.NewTestAssert(tt)
			entclient := entutil.NewClient(ctx)
			mizuki := entclient.HPMember.Query().Where(hpmember.KeyEQ("mizuki_fukumura")).FirstX(ctx)

			// follower1-3 follows mizuki but only follower1-token should get notificaiton
			follower1 := test.MakeTestUser(ctx)
			follower2 := test.MakeTestUser(ctx)
			follower3 := test.MakeTestUser(ctx)
			assert.X(push.UpsertNotificationSettings(appuser.WithUser(ctx, follower1), appuser.EntID(follower1), "ExponentPushToken[follower1-token]", push.NotificationSettings{EnableNewPosts: object.NullableTrue}))
			assert.X(push.UpsertNotificationSettings(appuser.WithUser(ctx, follower1), appuser.EntID(follower1), "ExponentPushToken[follower1-token2]", push.NotificationSettings{EnableNewPosts: object.NullableFalse}))
			assert.X(push.UpsertNotificationSettings(appuser.WithUser(ctx, follower2), appuser.EntID(follower2), "ExponentPushToken[follower2-token]", push.NotificationSettings{EnableNewPosts: object.NullableFalse}))
			assert.X(push.UpsertNotificationSettings(appuser.WithUser(ctx, follower3), appuser.EntID(follower3), "ExponentPushToken[follower3-token]", push.NotificationSettings{EnableNewPosts: object.NullableTrue}))
			assert.X(user.UpsertFollow(ctx, appuser.EntID(follower1), user.HPFollowUpsertParams{
				MemberId:   mizuki.ID,
				FollowType: enums.HPFollowTypeFollowWithNotification,
			}))
			assert.X(user.UpsertFollow(ctx, appuser.EntID(follower2), user.HPFollowUpsertParams{
				MemberId:   mizuki.ID,
				FollowType: enums.HPFollowTypeFollowWithNotification,
			}))
			assert.X(user.UpsertFollow(ctx, appuser.EntID(follower3), user.HPFollowUpsertParams{
				MemberId:   mizuki.ID,
				FollowType: enums.HPFollowTypeFollow,
			}))

			// PostAt = 2020-05-24 22:27:35 JST
			assert.X(s.crawl(appuser.WithAdmin(ctx), "https://ameblo.jp/morningmusume-9ki/entry-12599278025.html", true))
			messages := spush.GetMockSentMessages(ctx)
			a.Equals(1, len(messages))
			a.Equals(1, len(messages[0].To))

			// recrawl sholdn't send messages
			assert.X(s.crawl(ctx, "https://ameblo.jp/morningmusume-9ki/entry-12599278025.html", true))
			messages = spush.GetMockSentMessages(ctx)
			a.Equals(1, len(messages))

			// if there are no followers, it shouldn't send messages.
			assert.X(s.crawl(ctx, "https://ameblo.jp/morningmusume-9ki/entry-12599261142.html", true))
			messages = spush.GetMockSentMessages(ctx)
			a.Equals(1, len(messages))

			// if the post is out of messaging timestamp threadhold, it shouldn't send messages
			// PostAt = 2020-05-23 22:20:02, 1 day before
			assert.X(s.crawl(ctx, "https://ameblo.jp/morningmusume-9ki/entry-12599048367.html", true))
			messages = spush.GetMockSentMessages(ctx)
			a.Equals(1, len(messages))

			// validate message
			a.Equals("ExponentPushToken[follower1-token]", messages[0].To[0])
			a.Snapshot("notification", messages[0])
		})
	})
}
