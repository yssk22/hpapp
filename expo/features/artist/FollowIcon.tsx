import { HPMember, useHelloProject, useMe } from '@hpapp/features/root/internals/protected/context';
import { HPFollowType } from '@hpapp/features/root/internals/protected/context/me';
import { ColorScheme, useColor } from '@hpapp/features/settings/context/theme';
import { Icon } from '@rneui/themed';

function getIconName(type: HPFollowType) {
  switch (type) {
    case 'follow':
      return 'account-check';
    case 'follow_with_notification':
      return 'bell-check';
    default:
      return null;
  }
}

export default function FollowIcon({
  colorScheme = 'primary',
  member,
  size
}: {
  member: HPMember | string;
  colorScheme?: ColorScheme;
  size?: number;
}) {
  const hp = useHelloProject();
  const me = useMe();
  const m = hp.useMember(member);
  const followType = me.useFollowType(m!.id);
  const iconName = getIconName(followType);
  const [color] = useColor(colorScheme);
  if (iconName === null) {
    return null;
  }

  return <Icon type="material-community" name={iconName} size={size} color={color} />;
}
