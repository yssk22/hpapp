import { useThemeColor } from '@hpapp/features/app/theme';
import { HPArtist, HPMember, useArtistList } from '@hpapp/features/app/user';
import { ArtistCard, useUpsertFollow } from '@hpapp/features/artist';
import { Text } from '@hpapp/features/common';
import { IconSize, Spacing } from '@hpapp/features/common/constants';
import { t } from '@hpapp/system/i18n';
import { Icon } from '@rneui/base';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

export default function OnboardingStepFollowMembers() {
  const [color] = useThemeColor('secondary');
  const artists = useArtistList(false);
  const [upsertFollow] = useUpsertFollow();
  const onPress = useCallback(
    async (obj: HPArtist | HPMember) => {
      switch (obj.myFollowStatus?.type) {
        case 'follow':
          await upsertFollow({
            obj,
            followType: 'unfollow'
          });
          return;
        case 'follow_with_notification':
          await upsertFollow({
            obj,
            followType: 'follow'
          });
          return;
        default:
          await upsertFollow({
            obj,
            followType: 'follow_with_notification'
          });
      }
    },
    [upsertFollow]
  );
  return (
    <>
      <View style={styles.iconDescription}>
        <Icon
          style={styles.iconDescriptionIcon}
          name="account-check"
          type="material-community"
          size={IconSize.Medium}
          color={color}
        />
        <Text style={styles.iconDescriptionText}>{t('Following')}</Text>
        <Icon
          style={styles.iconDescriptionIcon}
          name="bell-check"
          type="material-community"
          size={IconSize.Medium}
          color={color}
        />
        <Text style={styles.iconDescriptionText}>{t('Following (notification)')}</Text>
      </View>
      {artists.map((a) => {
        return (
          <ArtistCard artist={a} key={a.key} iconShowFollow onArtistIconPress={onPress} onMemberIconPress={onPress} />
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  iconDescription: {
    marginLeft: Spacing.Small,
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconDescriptionIcon: {
    marginLeft: Spacing.XSmall
  },
  iconDescriptionText: {
    marginLeft: Spacing.XXSmall,
    marginRight: Spacing.XSmall
  }
});
