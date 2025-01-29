import {
  HPArtist,
  HPFollowType,
  HPMember,
  useFollowingArtistList,
  useFollowingMemberList
} from '@hpapp/features/app/user';
import { Spacing } from '@hpapp/features/common/constants';
import {
  ElineupMallOpenCartButton,
  ElineupMallLimitedTimeItemList,
  ElineupMallItemCategory,
  ElineupMallNoFollowingsBox
} from '@hpapp/features/elineupmall';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeTabGoods() {
  const artists = useFollowingArtistList(true);
  const artistCategories = useMemo(() => {
    return artists
      .map((a) => {
        return {
          artistId: a.id,
          categories: getFollowingCategoryList(a)
        };
      })
      .filter((v) => v.categories.length > 0);
  }, [artists]);
  const members = useFollowingMemberList(true);
  const memberCategories = useMemo(() => {
    return members
      .map((m) => {
        return {
          memberId: m.id,
          categories: getFollowingCategoryList(m)
        };
      })
      .filter((v) => v.categories.length > 0);
  }, [members]);
  if (memberCategories.length === 0 && artistCategories.length === 0) {
    return <ElineupMallNoFollowingsBox />;
  }
  return (
    <>
      <View style={styles.container}>
        <ElineupMallOpenCartButton />
      </View>
      <ElineupMallLimitedTimeItemList
        artistCategories={artistCategories}
        memberCategories={memberCategories}
        artistIds={[]}
        memberIds={[]}
        categories={[]}
      />
    </>
  );
}

function isFollwoingCategory(value: HPFollowType | undefined) {
  return value === 'follow' || value === 'follow_with_notification';
}

function getFollowingCategoryList(obj: HPArtist | HPMember) {
  const categories: ElineupMallItemCategory[] = [];
  if (isFollwoingCategory(obj.myFollowStatus?.elineupmallBlueray)) {
    categories.push('blueray');
  }
  if (isFollwoingCategory(obj.myFollowStatus?.elineupmallClearFile)) {
    categories.push('clear_file');
  }
  if (isFollwoingCategory(obj.myFollowStatus?.elineupmallCollectionOther)) {
    categories.push('colllection_other');
  }
  if (isFollwoingCategory(obj.myFollowStatus?.elineupmallCollectionPhoto)) {
    categories.push('colllection_photo');
  }
  if (isFollwoingCategory(obj.myFollowStatus?.elineupmallCollectionPinnapPoster)) {
    categories.push('colllection_pinnap_poster');
  }
  if (isFollwoingCategory(obj.myFollowStatus?.elineupmallDvd)) {
    categories.push('dvd');
  }
  if (isFollwoingCategory(obj.myFollowStatus?.elineupmallDvdMagazine)) {
    categories.push('dvd_magazine');
  }
  if (isFollwoingCategory(obj.myFollowStatus?.elineupmallDvdMagazineOther)) {
    categories.push('dvd_magazine_other');
  }
  if (isFollwoingCategory(obj.myFollowStatus?.elineupmallFsk)) {
    categories.push('fsk');
  }
  if (isFollwoingCategory(obj.myFollowStatus?.elineupmallKeyringOther)) {
    categories.push('keyring_other');
  }
  if (isFollwoingCategory(obj.myFollowStatus?.elineupmallMicrofiberTowel)) {
    categories.push('microfiber_towel');
  }
  if (isFollwoingCategory(obj.myFollowStatus?.elineupmallMufflerTowel)) {
    categories.push('muffler_towel');
  }
  if (isFollwoingCategory(obj.myFollowStatus?.elineupmallOther)) {
    categories.push('other');
  }
  if (isFollwoingCategory(obj.myFollowStatus?.elineupmallPenlight)) {
    categories.push('penlight');
  }
  if (isFollwoingCategory(obj.myFollowStatus?.elineupmallPhoto2l)) {
    categories.push('photo2_l');
  }
  if (isFollwoingCategory(obj.myFollowStatus?.elineupmallPhotoA4)) {
    categories.push('photo_a4');
  }
  if (isFollwoingCategory(obj.myFollowStatus?.elineupmallPhotoA5)) {
    categories.push('photo_a5');
  }
  if (isFollwoingCategory(obj.myFollowStatus?.elineupmallPhotoAlbum)) {
    categories.push('photo_album');
  }
  if (isFollwoingCategory(obj.myFollowStatus?.elineupmallPhotoAlbumOther)) {
    categories.push('photo_album_other');
  }
  if (isFollwoingCategory(obj.myFollowStatus?.elineupmallPhotoBook)) {
    categories.push('photo_book');
  }
  if (isFollwoingCategory(obj.myFollowStatus?.elineupmallPhotoBookOther)) {
    categories.push('photo_book_other');
  }
  if (isFollwoingCategory(obj.myFollowStatus?.elineupmallPhotoDaily)) {
    categories.push('photo_daily');
  }
  if (isFollwoingCategory(obj.myFollowStatus?.elineupmallPhotoOther)) {
    categories.push('photo_other');
  }
  if (isFollwoingCategory(obj.myFollowStatus?.elineupmallTshirt)) {
    categories.push('t_shirt');
  }
  return categories;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: Spacing.XXSmall,
    justifyContent: 'flex-end'
  }
});
