import { useMember } from '@hpapp/features/app/user';

import ArtistBaseIcon from './ArtistBaseIcon';

export enum ArtistMemberIconSize {
  // eslint-disable-next-line no-unused-vars
  Small = 32,
  // eslint-disable-next-line no-unused-vars
  Medium = 64,
  // eslint-disable-next-line no-unused-vars
  Large = 96
}

export type ArtistMemberIconProps = {
  memberId: string;
  size?: ArtistMemberIconSize | number;
  circle?: boolean;
  showFollowIcon?: boolean;
  onPress?: () => void;
};

export default function ArtistMemberIcon({
  memberId,
  size = ArtistMemberIconSize.Medium,
  circle = false,
  showFollowIcon = false,
  onPress
}: ArtistMemberIconProps) {
  const m = useMember(memberId);
  return (
    <ArtistBaseIcon
      thumbnailUrl={m!.thumbnailURL}
      size={size}
      circle={circle}
      followType={m!.myFollowStatus?.type}
      showFollowIcon={showFollowIcon}
      onPress={onPress}
    />
  );
}
