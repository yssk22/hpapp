import { createFeedContext, HPAssetType } from '@hpapp/features/feed';
import { useMemo } from 'react';

const [FeedProvider, useFeed] = createFeedContext();

export type ArtistContextProviderProps = {
  artistId?: string;
  memberId?: string;
  feedAssetType: HPAssetType;
  children: React.ReactElement;
};

export default function ArtistContextProvider({
  artistId,
  memberId,
  feedAssetType,
  children
}: ArtistContextProviderProps) {
  const params = useMemo(() => {
    return {
      artistIDs: artistId ? [artistId] : undefined,
      memberIDs: memberId ? [memberId] : undefined,
      assetTypes: [feedAssetType]
    };
  }, [memberId, artistId, feedAssetType]);
  return <FeedProvider {...params}>{children}</FeedProvider>;
}

export { useFeed };
