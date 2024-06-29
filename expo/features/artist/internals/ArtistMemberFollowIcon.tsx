import { useThemeColor } from '@hpapp/features/app/theme';
import { HPFollowType, HPMember, useHelloProject, useMe } from '@hpapp/features/app/user';
import { ThemeColorScheme } from '@hpapp/system/theme';
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

export default function ArtistMemberFollowIcon({
  colorScheme = 'primary',
  member,
  size
}: {
  member: HPMember | string;
  colorScheme?: ThemeColorScheme;
  size?: number;
}) {
  const hp = useHelloProject();
  const me = useMe();
  const m = hp.useMember(member);
  const followType = me.useFollowType(m!.id);
  const iconName = getIconName(followType);
  const [color] = useThemeColor(colorScheme);
  if (iconName === null) {
    return null;
  }

  return <Icon testID="ArtistMemberFollowIcon" type="material-community" name={iconName} size={size} color={color} />;
}
