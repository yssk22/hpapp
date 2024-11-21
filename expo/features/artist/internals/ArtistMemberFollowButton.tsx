import { useThemeColor } from '@hpapp/features/app/theme';
import { HPMember } from '@hpapp/features/app/user';
import { Spacing } from '@hpapp/features/common/constants';
import { t } from '@hpapp/system/i18n';
import { Button, Icon } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';

import useUpsertFollow from './useUpsertFollow';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.Small,
    paddingRight: Spacing.Small
  },
  followButtonContainer: {
    flexGrow: 1
  },
  notifyButtonContainer: {
    marginLeft: Spacing.Large
  },
  notifyButton: {}
});

export type ArtistMemberFollowButtonProps = {
  member: HPMember;
};

export default function ArtistMemberFollowButton({ member }: ArtistMemberFollowButtonProps) {
  const [color, contrast] = useThemeColor('primary');
  const [updateFollow, isUpdating] = useUpsertFollow();
  const followType = member.myFollowStatus?.type ?? 'unfollow';
  const variant = followType === 'unfollow' ? 'outline' : undefined;
  const followActionType = followType === 'unfollow' ? 'follow' : 'unfollow';
  const bellName = followType === 'follow_with_notification' ? 'bell-check' : 'bell-outline';
  return (
    <View style={styles.container}>
      <Button
        containerStyle={styles.followButtonContainer}
        type={variant}
        loading={isUpdating}
        onPress={() => {
          updateFollow(member.id, followActionType);
        }}
      >
        {followType === 'unfollow' ? t('addFollowing') : t('isFollowing')}
      </Button>
      <Button
        containerStyle={styles.notifyButtonContainer}
        buttonStyle={[styles.notifyButton, { backgroundColor: contrast }]}
        onPress={() => {
          if (followType === 'unfollow') {
            return;
          }
          updateFollow(member.id, followType === 'follow_with_notification' ? 'follow' : 'follow_with_notification');
        }}
      >
        <Icon name={bellName} type="material-community" color={color} />
      </Button>
    </View>
  );
}
