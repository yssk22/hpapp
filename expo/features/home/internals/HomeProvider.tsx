import { useFollowingMemberList } from '@hpapp/features/app/user';
import { ElineupMallProvider, useElineupMall } from '@hpapp/features/elineupmall';
import { createFeedContext } from '@hpapp/features/feed';
import { setBadgeCountAsync } from 'expo-notifications';
import { useEffect, useMemo } from 'react';

import HomeUPFCProvider, { useHomeUPFC } from './HomeUPFCProvider';

const [HomeFeedProvider, useHomeFeed] = createFeedContext();

export default function HomeProvider({ children }: { children: React.ReactElement }) {
  const followings = useFollowingMemberList(true);
  const memberIDs = useMemo(() => {
    return followings.map((f) => f.id);
  }, [followings]);
  return (
    <HomeFeedProvider assetTypes={['ameblo', 'instagram', 'tiktok', 'twitter']} memberIDs={memberIDs}>
      <HomeUPFCProvider>
        <ElineupMallProvider>{children}</ElineupMallProvider>
      </HomeUPFCProvider>
    </HomeFeedProvider>
  );
}

export function useHomeContext() {
  const feed = useHomeFeed();
  const upfc = useHomeUPFC();
  const elineupMall = useElineupMall();
  useEffect(() => {
    if (feed.badgeCount !== undefined || upfc.data?.badgeCount !== undefined) {
      setBadgeCountAsync((feed.badgeCount ?? 0) + (upfc?.data?.badgeCount ?? 0));
    }
  }, [feed.badgeCount, upfc.data?.badgeCount]);
  return useMemo(() => {
    return {
      feed,
      upfc,
      elineupMall
    };
  }, [feed, upfc, elineupMall]);
}
