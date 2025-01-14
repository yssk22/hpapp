package user

import (
	"context"

	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/hpfollow"
	"github.com/yssk22/hpapp/go/service/ent/user"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/errors"
	"github.com/yssk22/hpapp/go/service/schema/enums"
)

// GetFollowings returns HPFollow which the user follows
func GetFollowings(ctx context.Context, userId int) ([]*ent.HPFollow, error) {
	entclient := entutil.NewClient(ctx)
	// TODO: cache
	follows, err := entclient.HPFollow.Query().WithMember().Where(hpfollow.HasUserWith(user.IDEQ(userId))).All(ctx)
	return follows, errors.Wrap(ctx, err)
}

type HPFollowUpsertParams struct {
	ArtistId                *int
	MemberId                *int
	FollowType              enums.HPFollowType
	ElineupMallFollowParams []HPFollowElineupMallParams
}

type HPFollowElineupMallParams struct {
	Category   enums.HPElineupMallItemCategory
	FollowType enums.HPFollowType
}

// UpsertFollow upserts the follow record for the given userid. This function can be used to update the follow type.
func UpsertFollow(ctx context.Context, userId int, params HPFollowUpsertParams) (*ent.HPFollow, error) {
	entclient := entutil.NewClient(ctx)
	create := entclient.HPFollow.Create().
		SetUserID(userId).
		SetType(params.FollowType)
	if params.ArtistId != nil {
		create = create.SetArtistID(*params.ArtistId)
	} else if params.MemberId != nil {
		create = create.SetMemberID(*params.MemberId)
	} else {
		return nil, errors.New("either ArtistId or MemberId must be set")
	}
	for _, e := range params.ElineupMallFollowParams {
		switch e.Category {
		case enums.HPElineupMallItemCategoryBlueray:
			create = create.SetElineupmallBlueray(e.FollowType)
		case enums.HPElineupMallItemCategoryClearFile:
			create = create.SetElineupmallClearFile(e.FollowType)
		case enums.HPElineupMallItemCategoryColllectionOther:
			create = create.SetElineupmallCollectionOther(e.FollowType)
		case enums.HPElineupMallItemCategoryColllectionPhoto:
			create = create.SetElineupmallCollectionPhoto(e.FollowType)
		case enums.HPElineupMallItemCategoryColllectionPinnapPoster:
			create = create.SetElineupmallCollectionPinnapPoster(e.FollowType)
		case enums.HPElineupMallItemCategoryDVD:
			create = create.SetElineupmallDvd(e.FollowType)
		case enums.HPElineupMallItemCategoryDVDMagazine:
			create = create.SetElineupmallDvdMagazine(e.FollowType)
		case enums.HPElineupMallItemCategoryDVDMagazineOther:
			create = create.SetElineupmallDvdMagazineOther(e.FollowType)
		case enums.HPElineupMallItemCategoryFSK:
			create = create.SetElineupmallFsk(e.FollowType)
		case enums.HPElineupMallItemCategoryKeyringOther:
			create = create.SetElineupmallKeyringOther(e.FollowType)
		case enums.HPElineupMallItemCategoryMicrofiberTowel:
			create = create.SetElineupmallMicrofiberTowel(e.FollowType)
		case enums.HPElineupMallItemCategoryMufflerTowel:
			create = create.SetElineupmallMufflerTowel(e.FollowType)
		case enums.HPElineupMallItemCategoryOther:
			create = create.SetElineupmallOther(e.FollowType)
		case enums.HPElineupMallItemCategoryPenlight:
			create = create.SetElineupmallPenlight(e.FollowType)
		case enums.HPElineupMallItemCategoryPhoto2L:
			create = create.SetElineupmallPhoto2l(e.FollowType)
		case enums.HPElineupMallItemCategoryPhotoA4:
			create = create.SetElineupmallPhotoA4(e.FollowType)
		case enums.HPElineupMallItemCategoryPhotoA5:
			create = create.SetElineupmallPhotoA5(e.FollowType)
		case enums.HPElineupMallItemCategoryPhotoAlbum:
			create = create.SetElineupmallPhotoAlbum(e.FollowType)
		case enums.HPElineupMallItemCategoryPhotoAlbumOther:
			create = create.SetElineupmallPhotoAlbumOther(e.FollowType)
		case enums.HPElineupMallItemCategoryPhotoBook:
			create = create.SetElineupmallPhotoBook(e.FollowType)
		case enums.HPElineupMallItemCategoryPhotoBookOther:
			create = create.SetElineupmallPhotoBookOther(e.FollowType)
		case enums.HPElineupMallItemCategoryPhotoDaily:
			create = create.SetElineupmallPhotoDaily(e.FollowType)
		case enums.HPElineupMallItemCategoryPhotoOther:
			create = create.SetElineupmallPhotoOther(e.FollowType)
		case enums.HPElineupMallItemCategoryTShirt:
			create = create.SetElineupmallTshirt(e.FollowType)
		}
	}
	var update *ent.HPFollowUpsertOne
	if params.ArtistId != nil {
		update = create.OnConflictColumns(hpfollow.UserColumn, hpfollow.ArtistColumn)
	} else {
		update = create.OnConflictColumns(hpfollow.UserColumn, hpfollow.MemberColumn)
	}
	update = update.SetType(params.FollowType)
	for _, e := range params.ElineupMallFollowParams {
		switch e.Category {
		case enums.HPElineupMallItemCategoryBlueray:
			update = update.SetElineupmallBlueray(e.FollowType)
		case enums.HPElineupMallItemCategoryClearFile:
			update = update.SetElineupmallClearFile(e.FollowType)
		case enums.HPElineupMallItemCategoryColllectionOther:
			update = update.SetElineupmallCollectionOther(e.FollowType)
		case enums.HPElineupMallItemCategoryColllectionPhoto:
			update = update.SetElineupmallCollectionPhoto(e.FollowType)
		case enums.HPElineupMallItemCategoryColllectionPinnapPoster:
			update = update.SetElineupmallCollectionPinnapPoster(e.FollowType)
		case enums.HPElineupMallItemCategoryDVD:
			update = update.SetElineupmallDvd(e.FollowType)
		case enums.HPElineupMallItemCategoryDVDMagazine:
			update = update.SetElineupmallDvdMagazine(e.FollowType)
		case enums.HPElineupMallItemCategoryDVDMagazineOther:
			update = update.SetElineupmallDvdMagazineOther(e.FollowType)
		case enums.HPElineupMallItemCategoryFSK:
			update = update.SetElineupmallFsk(e.FollowType)
		case enums.HPElineupMallItemCategoryKeyringOther:
			update = update.SetElineupmallKeyringOther(e.FollowType)
		case enums.HPElineupMallItemCategoryMicrofiberTowel:
			update = update.SetElineupmallMicrofiberTowel(e.FollowType)
		case enums.HPElineupMallItemCategoryMufflerTowel:
			update = update.SetElineupmallMufflerTowel(e.FollowType)
		case enums.HPElineupMallItemCategoryOther:
			update = update.SetElineupmallOther(e.FollowType)
		case enums.HPElineupMallItemCategoryPenlight:
			update = update.SetElineupmallPenlight(e.FollowType)
		case enums.HPElineupMallItemCategoryPhoto2L:
			update = update.SetElineupmallPhoto2l(e.FollowType)
		case enums.HPElineupMallItemCategoryPhotoA4:
			update = update.SetElineupmallPhotoA4(e.FollowType)
		case enums.HPElineupMallItemCategoryPhotoA5:
			update = update.SetElineupmallPhotoA5(e.FollowType)
		case enums.HPElineupMallItemCategoryPhotoAlbum:
			update = update.SetElineupmallPhotoAlbum(e.FollowType)
		case enums.HPElineupMallItemCategoryPhotoAlbumOther:
			update = update.SetElineupmallPhotoAlbumOther(e.FollowType)
		case enums.HPElineupMallItemCategoryPhotoBook:
			update = update.SetElineupmallPhotoBook(e.FollowType)
		case enums.HPElineupMallItemCategoryPhotoBookOther:
			update = update.SetElineupmallPhotoBookOther(e.FollowType)
		case enums.HPElineupMallItemCategoryPhotoDaily:
			update = update.SetElineupmallPhotoDaily(e.FollowType)
		case enums.HPElineupMallItemCategoryPhotoOther:
			update = update.SetElineupmallPhotoOther(e.FollowType)
		case enums.HPElineupMallItemCategoryTShirt:
			update = update.SetElineupmallTshirt(e.FollowType)
		}
	}
	followId, err := update.ID(ctx)
	if err != nil {
		return nil, errors.Wrap(ctx, err)
	}
	follow, err := entclient.HPFollow.Get(ctx, followId)
	return follow, errors.Wrap(ctx, err)
}
