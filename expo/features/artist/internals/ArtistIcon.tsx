import { HPFollowType, useArtist } from '@hpapp/features/app/user';

import ArtistBaseIcon from './ArtistBaseIcon';

export enum ArtistIconSize {
  // eslint-disable-next-line no-unused-vars
  Small = 32,
  // eslint-disable-next-line no-unused-vars
  Medium = 64,
  // eslint-disable-next-line no-unused-vars
  Large = 96
}

export type ArtistMemberIconProps = {
  artistId: string;
  size?: ArtistIconSize | number;
  circle?: boolean;
  followType?: HPFollowType;
  showFollowIcon?: boolean;
  onPress?: () => void;
};

export default function ArtistMemberIcon({
  artistId,
  size = ArtistIconSize.Medium,
  circle = false,
  showFollowIcon = false,
  followType,
  onPress
}: ArtistMemberIconProps) {
  const a = useArtist(artistId);
  return (
    <ArtistBaseIcon
      thumbnailUrl={a!.thumbnailURL}
      size={size}
      circle={circle}
      followType={followType}
      showFollowIcon={showFollowIcon}
      onPress={onPress}
    />
  );
}
