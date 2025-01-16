import { useThemeColor } from '@hpapp/features/app/theme';
import { HPMember } from '@hpapp/features/app/user';
import { ArtistMemberIcon, ArtistMemberIconSize } from '@hpapp/features/artist';
import { Text } from '@hpapp/features/common';
import { Spacing } from '@hpapp/features/common/constants';
import { StyleSheet, View } from 'react-native';

import ElineupMallSettingsFollowingMemberCategoryButton from './ElineupMallSettingsFollowingMemberCategoryButton';

export type ElineupMallSettingsFollowingMemberProps = {
  member: HPMember;
};
export default function ElineupMallSettingsFollowingMember({ member }: ElineupMallSettingsFollowingMemberProps) {
  const [headerColor, headerColorContrast] = useThemeColor('secondary');
  return (
    <>
      <View style={[styles.memberHeader, { backgroundColor: headerColor }]}>
        <ArtistMemberIcon memberId={member.id} size={ArtistMemberIconSize.Small} />
        <Text style={[styles.memberHeaderText, { color: headerColorContrast }]}>{member.name}</Text>
      </View>
      <View style={styles.buttons}>
        <ElineupMallSettingsFollowingMemberCategoryButton
          member={member}
          category="fsk"
          value={member.myFollowStatus?.elineupmallFsk}
        />
        <ElineupMallSettingsFollowingMemberCategoryButton
          member={member}
          category="keyring_other"
          value={member.myFollowStatus?.elineupmallKeyringOther}
        />
        <ElineupMallSettingsFollowingMemberCategoryButton
          member={member}
          category="t_shirt"
          value={member.myFollowStatus?.elineupmallTshirt}
        />
        <ElineupMallSettingsFollowingMemberCategoryButton
          member={member}
          category="penlight"
          value={member.myFollowStatus?.elineupmallPenlight}
        />
        <ElineupMallSettingsFollowingMemberCategoryButton
          member={member}
          category="blueray"
          value={member.myFollowStatus?.elineupmallBlueray}
        />
        <ElineupMallSettingsFollowingMemberCategoryButton
          member={member}
          category="dvd"
          value={member.myFollowStatus?.elineupmallDvd}
        />
        <ElineupMallSettingsFollowingMemberCategoryButton
          member={member}
          category="dvd_magazine"
          value={member.myFollowStatus?.elineupmallDvdMagazine}
        />
        <ElineupMallSettingsFollowingMemberCategoryButton
          member={member}
          category="dvd_magazine_other"
          value={member.myFollowStatus?.elineupmallDvdMagazineOther}
        />
        <ElineupMallSettingsFollowingMemberCategoryButton
          member={member}
          category="clear_file"
          value={member.myFollowStatus?.elineupmallClearFile}
        />
        <ElineupMallSettingsFollowingMemberCategoryButton
          member={member}
          category="colllection_pinnap_poster"
          value={member.myFollowStatus?.elineupmallCollectionPinnapPoster}
        />
        <ElineupMallSettingsFollowingMemberCategoryButton
          member={member}
          category="colllection_photo"
          value={member.myFollowStatus?.elineupmallCollectionPhoto}
        />
        <ElineupMallSettingsFollowingMemberCategoryButton
          member={member}
          category="colllection_other"
          value={member.myFollowStatus?.elineupmallCollectionOther}
        />
        <ElineupMallSettingsFollowingMemberCategoryButton
          member={member}
          category="microfiber_towel"
          value={member.myFollowStatus?.elineupmallMicrofiberTowel}
        />
        <ElineupMallSettingsFollowingMemberCategoryButton
          member={member}
          category="muffler_towel"
          value={member.myFollowStatus?.elineupmallMufflerTowel}
        />
        <ElineupMallSettingsFollowingMemberCategoryButton
          member={member}
          category="photo_daily"
          value={member.myFollowStatus?.elineupmallPhotoDaily}
        />
        <ElineupMallSettingsFollowingMemberCategoryButton
          member={member}
          category="photo2_l"
          value={member.myFollowStatus?.elineupmallPhoto2l}
        />
        <ElineupMallSettingsFollowingMemberCategoryButton
          member={member}
          category="photo_a4"
          value={member.myFollowStatus?.elineupmallPhotoA4}
        />
        <ElineupMallSettingsFollowingMemberCategoryButton
          member={member}
          category="photo_a5"
          value={member.myFollowStatus?.elineupmallPhotoA5}
        />
        <ElineupMallSettingsFollowingMemberCategoryButton
          member={member}
          category="photo_album"
          value={member.myFollowStatus?.elineupmallPhotoAlbum}
        />
        <ElineupMallSettingsFollowingMemberCategoryButton
          member={member}
          category="photo_album_other"
          value={member.myFollowStatus?.elineupmallPhotoAlbumOther}
        />
        <ElineupMallSettingsFollowingMemberCategoryButton
          member={member}
          category="photo_book"
          value={member.myFollowStatus?.elineupmallPhotoBook}
        />
        <ElineupMallSettingsFollowingMemberCategoryButton
          member={member}
          category="photo_book_other"
          value={member.myFollowStatus?.elineupmallPhotoBookOther}
        />
        <ElineupMallSettingsFollowingMemberCategoryButton
          member={member}
          category="other"
          value={member.myFollowStatus?.elineupmallOther}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  memberHeader: {
    paddingTop: Spacing.XSmall,
    paddingBottom: Spacing.XSmall,
    paddingLeft: Spacing.Small,
    paddingRight: Spacing.Small,
    marginBottom: Spacing.Small,
    flexDirection: 'row',
    alignItems: 'center'
  },
  memberHeaderText: {
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
