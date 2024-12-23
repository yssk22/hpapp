package user

import (
	"context"
	"testing"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/bootstrap/test"
	"github.com/yssk22/hpapp/go/service/ent/hpmember"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/schema/enums"
)

func TestHPFollow(t *testing.T) {
	test.New(
		"GetFollowings",
		test.WithHPMaster(),
		test.WithUser(),
	).Run(t, func(ctx context.Context, tt *testing.T) {
		a := assert.NewTestAssert(tt)
		myId := appuser.CurrentEntUserID(ctx)
		followings, _ := GetFollowings(ctx, myId)
		a.Equals(0, len(followings))

		entclient := entutil.NewClient(ctx)
		mizuki := entclient.HPMember.Query().Where(hpmember.KeyEQ("mizuki_fukumura")).FirstX(ctx)
		risa := entclient.HPMember.Query().Where(hpmember.KeyEQ("risa_irie")).FirstX(ctx)
		reina := entclient.HPMember.Query().Where(hpmember.KeyEQ("reina_yokoyama")).FirstX(ctx)
		a.NotNil(UpsertFollow(ctx, myId, HPFollowUpsertParams{
			MemberId:   mizuki.ID,
			FollowType: enums.HPFollowTypeFollowWithNotification,
		}))
		a.NotNil(UpsertFollow(ctx, myId, HPFollowUpsertParams{
			MemberId:   risa.ID,
			FollowType: enums.HPFollowTypeFollowWithNotification,
		}))
		a.NotNil(UpsertFollow(ctx, myId, HPFollowUpsertParams{
			MemberId:   reina.ID,
			FollowType: enums.HPFollowTypeFollow,
		}))
		followings, _ = GetFollowings(ctx, myId)
		a.Equals(3, len(followings))
	})

	test.New(
		"UpsertFollow",
		test.WithHPMaster(),
		test.WithUser(),
	).Run(t, func(ctx context.Context, tt *testing.T) {
		a := assert.NewTestAssert(tt)
		entclient := entutil.NewClient(ctx)
		mizuki := entclient.HPMember.Query().Where(hpmember.KeyEQ("mizuki_fukumura")).FirstX(ctx)
		myId := appuser.CurrentEntUserID(ctx)

		// create a follow record
		a.Equals(0, mizuki.QueryFollowedBy().CountX(ctx))
		_, err := UpsertFollow(ctx, myId, HPFollowUpsertParams{
			MemberId:   mizuki.ID,
			FollowType: enums.HPFollowTypeFollowWithNotification,
		})
		a.Nil(err)
		a.Equals(1, mizuki.QueryFollowedBy().CountX(ctx))
		follow := mizuki.QueryFollowedBy().WithUser().FirstX(ctx)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.Type)
		a.Equals(myId, follow.Edges.User.ID)

		// if the same type is passed, nothing updated
		_, err = UpsertFollow(ctx, myId, HPFollowUpsertParams{
			MemberId:   mizuki.ID,
			FollowType: enums.HPFollowTypeFollowWithNotification,
		})
		a.Nil(err)
		a.Nil(err)
		a.Equals(1, mizuki.QueryFollowedBy().CountX(ctx))
		follow = mizuki.QueryFollowedBy().WithUser().FirstX(ctx)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.Type)
		a.Equals(myId, follow.Edges.User.ID)

		// change the type
		_, err = UpsertFollow(ctx, myId, HPFollowUpsertParams{
			MemberId:   mizuki.ID,
			FollowType: enums.HPFollowTypeFollow,
		})
		a.Nil(err)
		a.Equals(1, mizuki.QueryFollowedBy().CountX(ctx))
		follow = mizuki.QueryFollowedBy().WithUser().FirstX(ctx)
		a.Equals(enums.HPFollowTypeFollow, follow.Type)
		a.Equals(myId, follow.Edges.User.ID)

		// elineupall
		a.Equals(enums.HPFollowTypeUnknown, follow.ElineupmallBlueray)
		_, err = UpsertFollow(ctx, myId, HPFollowUpsertParams{
			MemberId:   mizuki.ID,
			FollowType: enums.HPFollowTypeFollow,
			ElineupMallFollowParams: []HPFollowElineupMallParams{
				{Category: enums.HPElineupMallItemCategoryBlueray, FollowType: enums.HPFollowTypeFollowWithNotification},
				{Category: enums.HPElineupMallItemCategoryClearFile, FollowType: enums.HPFollowTypeFollowWithNotification},
				{Category: enums.HPElineupMallItemCategoryColllectionOther, FollowType: enums.HPFollowTypeFollowWithNotification},
				{Category: enums.HPElineupMallItemCategoryColllectionPhoto, FollowType: enums.HPFollowTypeFollowWithNotification},
				{Category: enums.HPElineupMallItemCategoryColllectionPinnapPoster, FollowType: enums.HPFollowTypeFollowWithNotification},
				{Category: enums.HPElineupMallItemCategoryDVD, FollowType: enums.HPFollowTypeFollowWithNotification},
				{Category: enums.HPElineupMallItemCategoryDVDMagazine, FollowType: enums.HPFollowTypeFollowWithNotification},
				{Category: enums.HPElineupMallItemCategoryDVDMagazineOther, FollowType: enums.HPFollowTypeFollowWithNotification},
				{Category: enums.HPElineupMallItemCategoryFSK, FollowType: enums.HPFollowTypeFollowWithNotification},
				{Category: enums.HPElineupMallItemCategoryKeyringOther, FollowType: enums.HPFollowTypeFollowWithNotification},
				{Category: enums.HPElineupMallItemCategoryMicrofiberTowel, FollowType: enums.HPFollowTypeFollowWithNotification},
				{Category: enums.HPElineupMallItemCategoryMufflerTowel, FollowType: enums.HPFollowTypeFollowWithNotification},
				{Category: enums.HPElineupMallItemCategoryOther, FollowType: enums.HPFollowTypeFollowWithNotification},
				{Category: enums.HPElineupMallItemCategoryPenlight, FollowType: enums.HPFollowTypeFollowWithNotification},
				{Category: enums.HPElineupMallItemCategoryPhoto2L, FollowType: enums.HPFollowTypeFollowWithNotification},
				{Category: enums.HPElineupMallItemCategoryPhotoA4, FollowType: enums.HPFollowTypeFollowWithNotification},
				{Category: enums.HPElineupMallItemCategoryPhotoA5, FollowType: enums.HPFollowTypeFollowWithNotification},
				{Category: enums.HPElineupMallItemCategoryPhotoAlbum, FollowType: enums.HPFollowTypeFollowWithNotification},
				{Category: enums.HPElineupMallItemCategoryPhotoAlbumOther, FollowType: enums.HPFollowTypeFollowWithNotification},
				{Category: enums.HPElineupMallItemCategoryPhotoBook, FollowType: enums.HPFollowTypeFollowWithNotification},
				{Category: enums.HPElineupMallItemCategoryPhotoBookOther, FollowType: enums.HPFollowTypeFollowWithNotification},
				{Category: enums.HPElineupMallItemCategoryPhotoDaily, FollowType: enums.HPFollowTypeFollowWithNotification},
				{Category: enums.HPElineupMallItemCategoryPhotoOther, FollowType: enums.HPFollowTypeFollowWithNotification},
				{Category: enums.HPElineupMallItemCategoryTShirt, FollowType: enums.HPFollowTypeFollowWithNotification},
			},
		})
		follow = mizuki.QueryFollowedBy().WithUser().FirstX(ctx)
		a.Equals(enums.HPFollowTypeFollow, follow.Type)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.ElineupmallBlueray)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.ElineupmallClearFile)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.ElineupmallCollectionOther)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.ElineupmallCollectionPhoto)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.ElineupmallCollectionPinnapPoster)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.ElineupmallDvd)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.ElineupmallDvdMagazine)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.ElineupmallDvdMagazineOther)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.ElineupmallFsk)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.ElineupmallKeyringOther)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.ElineupmallMicrofiberTowel)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.ElineupmallMufflerTowel)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.ElineupmallOther)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.ElineupmallPenlight)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.ElineupmallPhoto2l)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.ElineupmallPhotoA4)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.ElineupmallPhotoA5)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.ElineupmallPhotoAlbum)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.ElineupmallPhotoAlbumOther)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.ElineupmallPhotoBook)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.ElineupmallPhotoBookOther)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.ElineupmallPhotoDaily)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.ElineupmallPhotoOther)
		a.Equals(enums.HPFollowTypeFollowWithNotification, follow.ElineupmallTshirt)
		a.Equals(myId, follow.Edges.User.ID)
	})
}
