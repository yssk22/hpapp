import { useThemeColor } from '@hpapp/features/app/theme';
import { useHelloProject, useMe } from '@hpapp/features/app/user';
import { ArtistCard, useFollowings } from '@hpapp/features/artist';
import { Text } from '@hpapp/features/common';
import { IconSize, Spacing } from '@hpapp/features/common/constants';
import { t } from '@hpapp/system/i18n';
import { Icon } from '@rneui/base';
import { StyleSheet, View } from 'react-native';

export default function OnboardingStepFollowMembers() {
  const [color] = useThemeColor('secondary');
  const hp = useHelloProject();
  const me = useMe();
  const artists = hp.useArtists(false);
  const [updateFollow] = useFollowings();
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
          <ArtistCard
            artist={a}
            key={a.key}
            memberIconShowFollow
            onMemberIconPress={async (member) => {
              const followType = me.useFollowType(member.id);
              switch (followType) {
                case 'follow':
                  await updateFollow(member.id, 'unfollow');
                  return;
                case 'follow_with_notification':
                  await updateFollow(member.id, 'follow');
                  return;
                case 'unfollow':
                  await updateFollow(member.id, 'follow_with_notification');
                  return;
              }
              await updateFollow(member.id, 'follow');
            }}
          />
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
