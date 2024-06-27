import ExternalImage from '@hpapp/features/common/components/image';
import { MemberIconSize } from '@hpapp/features/common/constants';
import { HPMember, useHelloProject } from '@hpapp/features/root/internals/protected/context';
import { View } from 'react-native';

export default function MemberIcon({
  member,
  size = MemberIconSize.Medium,
  showFollowIcon = false,
  onPress = () => {}
}: {
  member: HPMember | string;
  size?: number;
  showFollowIcon?: boolean;
  onPress?: () => void;
}) {
  const hp = useHelloProject();
  const m = hp.useMember(member);
  return (
    <View
      style={{
        width: size,
        height: size
      }}
    >
      <ExternalImage uri={m!.thumbnailURL} style={{ width: size, height: size }} />
    </View>
  );
}
