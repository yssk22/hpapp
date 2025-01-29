import { useThemeColor } from '@hpapp/features/app/theme';
import { HPArtist, HPMember } from '@hpapp/features/app/user';
import { ArtistIcon, ArtistMemberIcon, ArtistMemberIconSize } from '@hpapp/features/artist';
import { Text } from '@hpapp/features/common';
import { Spacing } from '@hpapp/features/common/constants';
import { StyleSheet, View } from 'react-native';

import ElineupMallSettingsFollowingCategoryButton from './ElineupMallSettingsFollowingCategoryButton';

export type ElineupMallSettingsFollowingListItemProps = {
  obj: HPArtist | HPMember;
};
export default function ElineupMallSettingsFollowingListItem({ obj }: ElineupMallSettingsFollowingListItemProps) {
  const [headerColor, headerColorContrast] = useThemeColor('secondary');
  return (
    <>
      <View style={[styles.header, { backgroundColor: headerColor }]}>
        {obj.type === 'artist' && <ArtistIcon artistId={obj.id} size={ArtistMemberIconSize.Small} />}
        {obj.type === 'member' && <ArtistMemberIcon memberId={obj.id} size={ArtistMemberIconSize.Small} />}
        <Text style={[styles.headerText, { color: headerColorContrast }]}>{obj.name}</Text>
      </View>
      <View style={styles.buttons}>
        <ElineupMallSettingsFollowingCategoryButton
          obj={obj}
          category="fsk"
          value={obj.myFollowStatus?.elineupmallFsk}
        />
        <ElineupMallSettingsFollowingCategoryButton
          obj={obj}
          category="keyring_other"
          value={obj.myFollowStatus?.elineupmallKeyringOther}
        />
        <ElineupMallSettingsFollowingCategoryButton
          obj={obj}
          category="t_shirt"
          value={obj.myFollowStatus?.elineupmallTshirt}
        />
        <ElineupMallSettingsFollowingCategoryButton
          obj={obj}
          category="penlight"
          value={obj.myFollowStatus?.elineupmallPenlight}
        />
        <ElineupMallSettingsFollowingCategoryButton
          obj={obj}
          category="blueray"
          value={obj.myFollowStatus?.elineupmallBlueray}
        />
        <ElineupMallSettingsFollowingCategoryButton
          obj={obj}
          category="dvd"
          value={obj.myFollowStatus?.elineupmallDvd}
        />
        <ElineupMallSettingsFollowingCategoryButton
          obj={obj}
          category="dvd_magazine"
          value={obj.myFollowStatus?.elineupmallDvdMagazine}
        />
        <ElineupMallSettingsFollowingCategoryButton
          obj={obj}
          category="dvd_magazine_other"
          value={obj.myFollowStatus?.elineupmallDvdMagazineOther}
        />
        <ElineupMallSettingsFollowingCategoryButton
          obj={obj}
          category="clear_file"
          value={obj.myFollowStatus?.elineupmallClearFile}
        />
        <ElineupMallSettingsFollowingCategoryButton
          obj={obj}
          category="colllection_pinnap_poster"
          value={obj.myFollowStatus?.elineupmallCollectionPinnapPoster}
        />
        <ElineupMallSettingsFollowingCategoryButton
          obj={obj}
          category="colllection_photo"
          value={obj.myFollowStatus?.elineupmallCollectionPhoto}
        />
        <ElineupMallSettingsFollowingCategoryButton
          obj={obj}
          category="colllection_other"
          value={obj.myFollowStatus?.elineupmallCollectionOther}
        />
        <ElineupMallSettingsFollowingCategoryButton
          obj={obj}
          category="microfiber_towel"
          value={obj.myFollowStatus?.elineupmallMicrofiberTowel}
        />
        <ElineupMallSettingsFollowingCategoryButton
          obj={obj}
          category="muffler_towel"
          value={obj.myFollowStatus?.elineupmallMufflerTowel}
        />
        <ElineupMallSettingsFollowingCategoryButton
          obj={obj}
          category="photo_daily"
          value={obj.myFollowStatus?.elineupmallPhotoDaily}
        />
        <ElineupMallSettingsFollowingCategoryButton
          obj={obj}
          category="photo2_l"
          value={obj.myFollowStatus?.elineupmallPhoto2l}
        />
        <ElineupMallSettingsFollowingCategoryButton
          obj={obj}
          category="photo_a4"
          value={obj.myFollowStatus?.elineupmallPhotoA4}
        />
        <ElineupMallSettingsFollowingCategoryButton
          obj={obj}
          category="photo_a5"
          value={obj.myFollowStatus?.elineupmallPhotoA5}
        />
        <ElineupMallSettingsFollowingCategoryButton
          obj={obj}
          category="photo_album"
          value={obj.myFollowStatus?.elineupmallPhotoAlbum}
        />
        <ElineupMallSettingsFollowingCategoryButton
          obj={obj}
          category="photo_album_other"
          value={obj.myFollowStatus?.elineupmallPhotoAlbumOther}
        />
        <ElineupMallSettingsFollowingCategoryButton
          obj={obj}
          category="photo_book"
          value={obj.myFollowStatus?.elineupmallPhotoBook}
        />
        <ElineupMallSettingsFollowingCategoryButton
          obj={obj}
          category="photo_book_other"
          value={obj.myFollowStatus?.elineupmallPhotoBookOther}
        />
        <ElineupMallSettingsFollowingCategoryButton
          obj={obj}
          category="other"
          value={obj.myFollowStatus?.elineupmallOther}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Spacing.XSmall,
    paddingBottom: Spacing.XSmall,
    paddingLeft: Spacing.Small,
    paddingRight: Spacing.Small,
    marginBottom: Spacing.Small,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerText: {
    marginLeft: Spacing.Small,
    fontWeight: 'bold'
  },
  buttons: {
    marginLeft: Spacing.Small,
    marginRight: Spacing.Small,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start'
  }
});
