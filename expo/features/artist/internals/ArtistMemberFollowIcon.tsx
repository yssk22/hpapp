import { useThemeColor } from '@hpapp/features/app/theme';
import { HPFollowType, useMember } from '@hpapp/features/app/user';
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
  memberId,
  size
}: {
  memberId: string;
  colorScheme?: ThemeColorScheme;
  size?: number;
}) {
  const m = useMember(memberId);
  const followType = m!.myFollowStatus?.type ?? 'unfollow';
  const iconName = getIconName(followType);
  const [color] = useThemeColor(colorScheme);
  if (iconName === null) {
    return null;
  }

  return <Icon testID="ArtistMemberFollowIcon" type="material-community" name={iconName} size={size} color={color} />;
}
