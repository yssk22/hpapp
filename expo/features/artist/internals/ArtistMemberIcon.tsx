import { useThemeColor } from '@hpapp/features/app/theme';
import { HPFollowType, HPMember, useHelloProject, useMe } from '@hpapp/features/app/user';
import { ExternalImage } from '@hpapp/features/common';
import { IconSize } from '@hpapp/features/common/constants';
import { Icon } from '@rneui/themed';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export enum ArtistMemberIconSize {
  // eslint-disable-next-line no-unused-vars
  Small = 32,
  // eslint-disable-next-line no-unused-vars
  Medium = 64,
  // eslint-disable-next-line no-unused-vars
  Large = 96
}

export type ArtistMemberIconProps = {
  member: HPMember | string;
  size?: ArtistMemberIconSize | number;
  circle?: boolean;
  showFollowIcon?: boolean;
  onPress?: () => void;
};

export default function ArtistMemberIcon({
  member,
  size = ArtistMemberIconSize.Medium,
  circle = false,
  showFollowIcon = false,
  onPress
}: ArtistMemberIconProps) {
  const [color, contrast] = useThemeColor('secondary');
  const hp = useHelloProject();
  const me = useMe();
  const m = hp.useMember(member);
  const followType = me.useFollowType(m!.id);
  const iconName = getFollowIconName(followType);
  const circleProps = circle ? { borderRadius: size * 2 } : {};
  if (onPress === undefined) {
    return (
      <View
        testID="ArtistMemberIcon.NoOnPress"
        style={{
          width: size,
          height: size
        }}
      >
        <ExternalImage
          uri={m!.thumbnailURL}
          style={{ width: size, height: size }}
          width={size}
          height={size}
          cachePolicy="disk"
          {...circleProps}
        />
        {showFollowIcon && iconName && (
          <View style={[{ backgroundColor: contrast }, styles.icon]}>
            <Icon name={iconName} type="material-community" color={color} size={IconSize.Small} />
          </View>
        )}
      </View>
    );
  }
  return (
    <TouchableOpacity
      testID="ArtistMemberIcon"
      style={{
        width: size,
        height: size
      }}
      onPress={onPress}
    >
      <ExternalImage
        uri={m!.thumbnailURL}
        style={{ width: size, height: size }}
        width={size}
        height={size}
        cachePolicy="disk"
        {...circleProps}
      />
      {showFollowIcon && iconName && (
        <View style={[{ backgroundColor: contrast }, styles.icon]}>
          <Icon name={iconName} type="material-community" color={color} size={IconSize.Small} />
        </View>
      )}
    </TouchableOpacity>
  );
}

function getFollowIconName(type: HPFollowType) {
  switch (type) {
    case 'follow':
      return 'account-check';
    case 'follow_with_notification':
      return 'bell-check';
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    right: 0, // IconSize.Small / 2 - 1,
    top: 0, // Spacing.Small,
    alignItems: 'flex-end'
  }
});
