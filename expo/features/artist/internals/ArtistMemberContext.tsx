import { HPMember } from '@hpapp/features/app/user';
import { createFeedContext, HPAssetType } from '@hpapp/features/feed';

const [ArtistMemberFeedProvider, useArtistMemberFeed] = createFeedContext();

export type ArtistMemberContextProviderProps = {
  member: HPMember;
  feedAssetType: HPAssetType;
  children: React.ReactElement;
};

export default function ArtistMemberContextProvider({
  member,
  feedAssetType,
  children
}: ArtistMemberContextProviderProps) {
  return (
    <ArtistMemberFeedProvider assetTypes={[feedAssetType]} memberIDs={[member.id]}>
      {children}
    </ArtistMemberFeedProvider>
  );
}

export { useArtistMemberFeed };
