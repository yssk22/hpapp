import { HPFollowType, useHelloProject } from '@hpapp/features/app/user';
import {
  ElineupMallLimitedTimeItemList,
  ElineupMallItemCategory,
  ElineupMallNoFollowingsBox
} from '@hpapp/features/elineupmall';

export default function HomeTabGoods() {
  const memberCategories = useHelloProject()!
    .useFollowingMembers(true)
    .map((m) => {
      const categories: ElineupMallItemCategory[] = [];
      if (isFollwoingCategory(m.myFollowStatus?.elineupmallBlueray)) {
        categories.push('blueray');
      }
      if (isFollwoingCategory(m.myFollowStatus?.elineupmallClearFile)) {
        categories.push('clear_file');
      }
      if (isFollwoingCategory(m.myFollowStatus?.elineupmallCollectionOther)) {
        categories.push('colllection_other');
      }
      if (isFollwoingCategory(m.myFollowStatus?.elineupmallCollectionPhoto)) {
        categories.push('colllection_photo');
      }
      if (isFollwoingCategory(m.myFollowStatus?.elineupmallCollectionPinnapPoster)) {
        categories.push('colllection_pinnap_poster');
      }
      if (isFollwoingCategory(m.myFollowStatus?.elineupmallDvd)) {
        categories.push('dvd');
      }
      if (isFollwoingCategory(m.myFollowStatus?.elineupmallDvdMagazine)) {
        categories.push('dvd_magazine');
      }
      if (isFollwoingCategory(m.myFollowStatus?.elineupmallDvdMagazineOther)) {
        categories.push('dvd_magazine_other');
      }
      if (isFollwoingCategory(m.myFollowStatus?.elineupmallFsk)) {
        categories.push('fsk');
      }
      if (isFollwoingCategory(m.myFollowStatus?.elineupmallKeyringOther)) {
        categories.push('keyring_other');
      }
      if (isFollwoingCategory(m.myFollowStatus?.elineupmallMicrofiberTowel)) {
        categories.push('microfiber_towel');
      }
      if (isFollwoingCategory(m.myFollowStatus?.elineupmallMufflerTowel)) {
        categories.push('muffler_towel');
      }
      if (isFollwoingCategory(m.myFollowStatus?.elineupmallOther)) {
        categories.push('other');
      }
      if (isFollwoingCategory(m.myFollowStatus?.elineupmallPenlight)) {
        categories.push('penlight');
      }
      if (isFollwoingCategory(m.myFollowStatus?.elineupmallPhoto2l)) {
        categories.push('photo2_l');
      }
      if (isFollwoingCategory(m.myFollowStatus?.elineupmallPhotoA4)) {
        categories.push('photo_a4');
      }
      if (isFollwoingCategory(m.myFollowStatus?.elineupmallPhotoA5)) {
        categories.push('photo_a5');
      }
      if (isFollwoingCategory(m.myFollowStatus?.elineupmallPhotoAlbum)) {
        categories.push('photo_album');
      }
      if (isFollwoingCategory(m.myFollowStatus?.elineupmallPhotoAlbumOther)) {
        categories.push('photo_album_other');
      }
      if (isFollwoingCategory(m.myFollowStatus?.elineupmallPhotoBook)) {
        categories.push('photo_book');
      }
      if (isFollwoingCategory(m.myFollowStatus?.elineupmallPhotoBookOther)) {
        categories.push('photo_book_other');
      }
      if (isFollwoingCategory(m.myFollowStatus?.elineupmallPhotoDaily)) {
        categories.push('photo_daily');
      }
      if (isFollwoingCategory(m.myFollowStatus?.elineupmallPhotoOther)) {
        categories.push('photo_other');
      }
      if (isFollwoingCategory(m.myFollowStatus?.elineupmallTshirt)) {
        categories.push('t_shirt');
      }
      return {
        memberId: m.id,
        categories
      };
    })
    .filter((v) => v.categories.length > 0);
  if (memberCategories.length === 0) {
    return <ElineupMallNoFollowingsBox />;
  }
  return <ElineupMallLimitedTimeItemList memberCategories={memberCategories} memberIds={[]} categories={[]} />;
}

function isFollwoingCategory(value: HPFollowType | undefined) {
  return value === 'follow' || value === 'follow_with_notification';
}
