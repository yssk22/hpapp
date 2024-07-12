import { HPMember, useHelloProject } from '@hpapp/features/app/user';
import { ExternalImage } from '@hpapp/features/common';
import { View } from 'react-native';

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
  showFollowIcon = false,
  onPress = () => {}
}: {
  member: HPMember | string;
  size?: ArtistMemberIconSize;
  showFollowIcon?: boolean;
  onPress?: () => void;
}) {
  const hp = useHelloProject();
  const m = hp.useMember(member);
  return (
    <View
      testID="ArtistMemberIcon"
      style={{
        width: size,
        height: size
      }}
    >
      <ExternalImage uri={m!.thumbnailURL} style={{ width: size, height: size }} width={size} height={size} />
    </View>
  );
}
