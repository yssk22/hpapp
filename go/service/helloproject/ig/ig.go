package ig

import (
	"bytes"
	"context"
	"fmt"

	"github.com/spf13/cobra"
	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/slice"
	"github.com/yssk22/hpapp/go/service/auth"
	"github.com/yssk22/hpapp/go/service/bootstrap/config"
	"github.com/yssk22/hpapp/go/service/bootstrap/http/middleware"
	"github.com/yssk22/hpapp/go/service/bootstrap/http/task"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/hpasset"
	"github.com/yssk22/hpapp/go/service/ent/hpigpost"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/helloproject/blob"
	"github.com/yssk22/hpapp/go/service/helloproject/member"
	"github.com/yssk22/hpapp/go/service/schema/enums"
	"github.com/yssk22/hpapp/go/service/schema/jsonfields"
	"github.com/yssk22/hpapp/go/system/clock"
	"github.com/yssk22/hpapp/go/system/slog"
)

type igService struct {
	blobCrawler    blob.Crawler
	tagger         member.Tagger
	latestTarget   CrawlerTarget
	backfillTarget CrawlerTarget
}

type ServiceOption func(*igService)

func WithLatestTarget(target CrawlerTarget) ServiceOption {
	return func(s *igService) {
		s.latestTarget = target
	}
}

func WithBackfillTarget(target CrawlerTarget) ServiceOption {
	return func(s *igService) {
		s.backfillTarget = target
	}
}

func NewService(
	blobCrawler blob.Crawler,
	tagger member.Tagger,
	options ...ServiceOption,
) config.Service {
	s := &igService{
		blobCrawler: blobCrawler,
		tagger:      tagger,
	}
	for _, opt := range options {
		opt(s)
	}
	return s
}

func (*igService) Middleware() []middleware.HttpMiddleware {
	return nil
}

func (ig *igService) Tasks() []task.Task {
	return []task.Task{
		task.NewTask("/helloproject/ig/crawl-latest", task.NoParameter(), ig.CrawlLatestTask, auth.AllowAdmins[any]()),
		task.NewTask("/helloproject/ig/crawl-backfill", task.NoParameter(), ig.CrawlBackfillTask, auth.AllowAdmins[any]()),
	}
}

func (*igService) Command() *cobra.Command {
	return nil
}

func (ig *igService) CrawlLatestTask(ctx context.Context, _ any) error {
	if ig.latestTarget == nil {
		return fmt.Errorf("no latest target defined")
	}
	_, err := ig.CrawlMultiple(ctx, ig.latestTarget)
	return err
}

func (ig *igService) CrawlBackfillTask(ctx context.Context, _ any) error {
	if ig.backfillTarget == nil {
		return fmt.Errorf("no backfill target defined")
	}
	_, err := ig.CrawlMultiple(ctx, ig.backfillTarget)
	return err
}

func (ig *igService) CrawlMultiple(ctx context.Context, t CrawlerTarget) ([]*ent.HPIgPost, error) {
	args, err := t.GetCrawlArgs(ctx)
	if err != nil {
		return nil, err
	}
	return slice.MapPtr(args, func(i int, v *jsonfields.HPIgCrawlArgs) (*ent.HPIgPost, error) {
		return ig.CrawlOne(ctx, v)
	})
}

func (ig *igService) CrawlOne(ctx context.Context, args *jsonfields.HPIgCrawlArgs) (*ent.HPIgPost, error) {
	return slog.Track(ctx, "service.helloproject.ig.CrawlOne", func(loga slog.Attributes) (*ent.HPIgPost, error) {
		loga["args"] = args
		entpost, err := entutil.NewClient(ctx).HPIgPost.Query().WithBlobs().WithAsset().Where(hpigpost.ShortcodeEQ(args.Shortcode)).First(ctx)
		if err = ent.MaskNotFound(err); err != nil {
			return nil, err
		}
		if entpost != nil {
			ok, err := ValidatePost(ctx, args, entpost)
			loga.Set("ig_post_id", entpost.ID)
			if ok {
				loga.Set("crawl", false)
				// only stats update
				return upsertPostStatsOnly(ctx, args, entpost)
			}
			loga.Set("crawl_reason", err.Error())
		} else {
			loga.Set("crawl_reason", "new post")
		}
		// entpost is nil or not valid
		asset, err := getAssetByOwnername(ctx, args.OwnerUsername)
		if err != nil {
			return nil, err
		}
		loga.Set("asset_id", asset.ID)
		blobs := ig.crawlBlob(ctx, args, asset)
		loga.Set("blobs", assert.X(slice.Map(blobs, func(i int, v *ent.HPBlob) (interface{}, error) {
			return map[string]interface{}{
				"blob_id":        v.ID,
				"status":         v.Status,
				"status_message": v.StatusMessage,
			}, nil
		})))
		loga.Set("has_all_blobs", len(blobs) == getExpectedBlobCount(ctx, args))
		return ig.upsertHPIgPost(ctx, asset, args, blobs, entpost)
	})
}

func (ig *igService) crawlBlob(ctx context.Context, args *jsonfields.HPIgCrawlArgs, asset *ent.HPAsset) []*ent.HPBlob {
	var list []*ent.HPBlob
	for i, m := range args.ChildPosts {
		blob := ig.crawlBlobInternal(ctx, asset, args.Shortcode, i, m)
		if blob != nil {
			list = append(list, blob)
		}
	}
	if len(args.ChildPosts) == 0 {
		blob := ig.crawlBlobInternal(ctx, asset, args.Shortcode, 0, jsonfields.HPIgCrawlArgsChildPost{
			DisplayURL:     args.DisplayURL,
			VideoURL:       args.VideoURL,
			LikesCount:     args.LikesCount,
			VideoViewCount: args.VideoViewCount,
		})
		if blob != nil {
			list = append(list, blob)
		}
	}
	return list
}

func (ig *igService) crawlBlobInternal(ctx context.Context, asset *ent.HPAsset, shortcode string, i int, m jsonfields.HPIgCrawlArgsChildPost) *ent.HPBlob {
	sourceUrl := fmt.Sprintf("https://www.instagram.com/p/%s/", shortcode)
	// note that Instagram started to use .webp format for imagse but we store them as .jpg extension for now without any encoding conversion.
	// most of browsers and image viewers including iOS/Android default photo apps can handle .webp format image even the extension is .jpg.
	imageStoragePath := blob.GetStoragePathFromUrl(ctx, fmt.Sprintf("https://www.instagram.com/p/%s/%d/image.jpg", shortcode, i))
	videoStoragePath := blob.GetStoragePathFromUrl(ctx, fmt.Sprintf("https://www.instagram.com/p/%s/%d/video.mp4", shortcode, i))
	options := []blob.CrawlOption{
		blob.SourceHTMLURL(sourceUrl),
		blob.OwnerArtistID(asset.Edges.Artist.ID),
	}
	// if assert has only one member, set it as owner
	if len(asset.Edges.Members) == 1 {
		options = append(options, blob.OwnerMemberID(asset.Edges.Members[0].ID))
	}
	// we call ig.blobCrawler.Crawl but we don't handle the error as the upserted blob record contains the error messages
	// The altimate focus on this method is to upsert a blob record with the error message so that we can retry the crawl later.
	if m.VideoURL == "" {
		// image
		blob, _ := ig.blobCrawler.Crawl(
			ctx, enums.HPBlobTypeImage, enums.HPBlobSubTypeJpeg,
			m.DisplayURL,
			append(
				options,
				blob.StoragePath(imageStoragePath),
			)...,
		)
		return blob
	} else {
		// video
		blob, _ := ig.blobCrawler.Crawl(
			ctx, enums.HPBlobTypeVideo, enums.HPBlobSubTypeMp4,
			m.VideoURL,
			append(
				options,
				blob.StoragePath(videoStoragePath),
				blob.ThumbnailSourceImageURL(m.DisplayURL),
				blob.ThumbnailStoragePath(imageStoragePath),
			)...,
		)
		return blob
	}
}
func ValidatePost(ctx context.Context, args *jsonfields.HPIgCrawlArgs, post *ent.HPIgPost) (bool, error) {
	if post.RecrawlRequired {
		return false, fmt.Errorf("recrawl required")
	}
	return validateBlobs(ctx, args, post.Edges.Blobs)
}

func validateBlobs(ctx context.Context, args *jsonfields.HPIgCrawlArgs, blobs []*ent.HPBlob) (bool, error) {
	if getExpectedBlobCount(ctx, args) != len(blobs) {
		return false, fmt.Errorf("some HPBlob are missing")
	}
	for _, entblob := range blobs {
		if entblob.Status != enums.HPBlobStatusReadyToHost {
			return false, fmt.Errorf("%d is not ready to host: %s", entblob.ID, entblob.StatusMessage)
		}
	}
	return true, nil
}

func getExpectedBlobCount(ctx context.Context, args *jsonfields.HPIgCrawlArgs) int {
	mediaCount := len(args.ChildPosts)
	if mediaCount == 0 {
		return 1
	}
	return mediaCount
}

func upsertPostStatsOnly(ctx context.Context, args *jsonfields.HPIgCrawlArgs, entpost *ent.HPIgPost) (*ent.HPIgPost, error) {
	return entpost.Update().
		SetLikes(args.LikesCount).
		SetComments(args.CommentsCount).
		SetErrorCount(0).
		ClearLastErrorMessage().
		Save(ctx)
}

func (ig *igService) upsertHPIgPost(ctx context.Context, entAsset *ent.HPAsset, args *jsonfields.HPIgCrawlArgs, blobs []*ent.HPBlob, entpost *ent.HPIgPost) (*ent.HPIgPost, error) {
	now := clock.ContextTime(ctx)
	entClient := entutil.NewClient(ctx)
	jsonMedia := blob.GetJsonMediaList(ctx, blobs, blob.JsonMediaUseStorage(true), blob.JsonMediaSkipIfNotReady(true))
	valid, validationError := validateBlobs(ctx, args, blobs)
	recrawlRequired := !valid
	taggedMembers := ig.tagger.GetTaggedMembers(ctx, bytes.NewBufferString(args.Caption))
	if taggedMembers == nil {
		taggedMembers = []*ent.HPMember{}
	}
	// asset owner member should be also tagged.
	if len(entAsset.Edges.Members) == 1 {
		taggedMembers = append([]*ent.HPMember{entAsset.Edges.Members[0]}, taggedMembers...)
	}

	if entpost == nil {
		var err error
		create := entClient.HPIgPost.Create().
			SetShortcode(args.Shortcode).
			SetDescription(args.Caption).
			SetPostAt(args.Timestamp).
			SetLikes(args.LikesCount).
			SetComments(args.CommentsCount).
			SetMedia(jsonMedia).
			SetCrawledAt(now).
			SetRecrawlRequired(recrawlRequired).
			AddBlobs(blobs...).
			AddTaggedMembers(taggedMembers...)
		if recrawlRequired {
			create = create.SetLastErrorMessage(validationError.Error())
		}
		create = create.SetAsset(entAsset).SetOwnerArtist(entAsset.Edges.Artist).AddTaggedArtists([]*ent.HPArtist{entAsset.Edges.Artist}...)
		if len(entAsset.Edges.Members) == 1 {
			create = create.SetOwnerMember(entAsset.Edges.Members[0])
		}
		// this could cause ConstraintError since another batch may create a post with the same shortcode.
		// We don't use SQL upsert function but use "create or update" via ent as ent hook doesn't work well with upsert.
		entpost, err = create.Save(ctx)
		if err != nil && !ent.IsConstraintError(err) {
			return nil, err
		}
		if err == nil {
			return entpost, nil
		}
		entpost, err = entClient.HPIgPost.Query().Where(hpigpost.ShortcodeEQ(args.Shortcode)).First(ctx)
		if err != nil {
			return nil, fmt.Errorf("upsert failed: hp_ig_posts: %v", err)
		}
	}
	update := entpost.Update().
		SetShortcode(args.Shortcode).
		SetDescription(args.Caption).
		SetPostAt(args.Timestamp).
		SetLikes(args.LikesCount).
		SetComments(args.CommentsCount).
		SetMedia(jsonMedia).
		SetCrawledAt(now).
		SetRecrawlRequired(recrawlRequired).
		ClearBlobs().
		AddBlobs(blobs...).
		ClearTaggedMembers().
		AddTaggedMembers(taggedMembers...)
	if !recrawlRequired {
		update = update.SetErrorCount(0).
			ClearLastErrorMessage().
			SetRecrawlArgs(nil)
	} else {
		update = update.
			SetErrorCount(entpost.ErrorCount + 1).
			SetLastErrorMessage(validationError.Error())
		if entpost.ErrorCount < 5 {
			update = update.SetRecrawlArgs(args)
		} else {
			update = update.SetRecrawlArgs(nil)
		}
	}
	update = update.SetAsset(entAsset).SetOwnerArtist(entAsset.Edges.Artist).ClearTaggedArtists().AddTaggedArtists([]*ent.HPArtist{entAsset.Edges.Artist}...)
	if len(entAsset.Edges.Members) > 0 {
		update = update.SetOwnerMember(entAsset.Edges.Members[0])
	}
	return update.Save(ctx)
}

func getAssetByOwnername(ctx context.Context, ownerName string) (*ent.HPAsset, error) {
	entclient := entutil.NewClient(ctx)
	return entclient.HPAsset.Query().WithArtist(func(q *ent.HPArtistQuery) {
		q.WithMembers()
	}).WithMembers().Where(
		hpasset.AssetTypeEQ(enums.HPAssetTypeInstagram),
		hpasset.Key(ownerName),
	).First(ctx)
}
