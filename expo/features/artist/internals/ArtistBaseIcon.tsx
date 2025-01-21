import { useThemeColor } from '@hpapp/features/app/theme';
import { HPFollowType } from '@hpapp/features/app/user';
import { ExternalImage } from '@hpapp/features/common';
import { IconSize } from '@hpapp/features/common/constants';
import { Icon } from '@rneui/themed';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export type ArtistBaseIconProps = {
  folllowType?: HPFollowType;
  thumbnailUrl: string;
  size?: number;
  circle?: boolean;
  showFollowIcon?: boolean;
  onPress?: () => void;
};

export default function ArtistBaseIcon({
  thumbnailUrl,
  folllowType,
  size = 32,
  circle = false,
  showFollowIcon = false,
  onPress
}: ArtistBaseIconProps) {
  const [color, contrast] = useThemeColor('secondary');
  const iconName = getFollowIconName(folllowType);
  const circleProps = circle ? { borderRadius: size * 2 } : {};
  if (onPress === undefined) {
    return (
      <View
        testID="ArtistBaseIcon.NoOnPress"
        style={{
          width: size,
          height: size
        }}
      >
        <ExternalImage
          uri={thumbnailUrl}
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
      testID="ArtistBaseIcon.OnPress"
      style={{
        width: size,
        height: size
      }}
      onPress={onPress}
    >
      <ExternalImage
        uri={thumbnailUrl}
        style={{ width: size, height: size }}
        width={size}
        height={size}
        cachePolicy="memory-disk"
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

function getFollowIconName(type: HPFollowType | undefined) {
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
    right: 0,
    top: 0,
    alignItems: 'flex-end'
  }
});
