import { HPMember, useHelloProject } from '@hpapp/features/app/user';
import { ExternalImage } from '@hpapp/features/common';
import { useNavigation } from '@hpapp/features/common/stack';
import { TouchableOpacity, View } from 'react-native';

export enum ArtistMemberIconSize {
  // eslint-disable-next-line no-unused-vars
  Small = 32,
  // eslint-disable-next-line no-unused-vars
  Medium = 64,
  // eslint-disable-next-line no-unused-vars
  Large = 96
}

export default function ArtistMemberIcon({
  member,
  size = ArtistMemberIconSize.Medium,
  circle = false,
  showFollowIcon = false,
  disableTouch = false
}: {
  member: HPMember | string;
  size?: ArtistMemberIconSize | number;
  circle?: boolean;
  showFollowIcon?: boolean;
  disableTouch?: boolean;
}) {
  const navigation = useNavigation();
  const hp = useHelloProject();
  const m = hp.useMember(member);
  const circleProps = circle ? { borderRadius: size * 2 } : {};
  if (disableTouch) {
    return (
      <View
        testID="ArtistMemberIcon.DisableTouch"
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
          {...circleProps}
        />
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
      onPress={() => {
        // TODO: Use the dummy screen object is to avoid circular dependency. We should refactor this.
        navigation.push(
          {
            name: 'dummy',
            path: '/arttist/member/',
            component: () => null
          },
          { memberId: m!.id }
        );
      }}
    >
      <ExternalImage
        uri={m!.thumbnailURL}
        style={{ width: size, height: size }}
        width={size}
        height={size}
        {...circleProps}
      />
    </TouchableOpacity>
  );
}
