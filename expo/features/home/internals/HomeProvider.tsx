import { useHelloProject } from '@hpapp/features/app/user';
import { ElineupMallProvider, useElineupMall } from '@hpapp/features/elineupmall';
import { createFeedContext } from '@hpapp/features/feed';
import { setBadgeCountAsync } from 'expo-notifications';
import { useEffect, useMemo } from 'react';

import HomeUPFCProvider, { useHomeUPFC } from './HomeUPFCProvider';

const [HomeFeedProvider, useHomeFeed] = createFeedContext();

export default function HomeProvider({ children }: { children: React.ReactElement }) {
  const followings = useHelloProject()!
    .useFollowingMembers(true)
    .map((m) => m.id);
  return (
    <HomeFeedProvider assetTypes={['ameblo', 'instagram', 'tiktok', 'twitter']} memberIDs={followings}>
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
    let total = 0;
    let shouldUpdate = false;
    if (feed.badgeCount) {
      shouldUpdate = true;
      total += feed.badgeCount;
    }
    if (upfc.data?.badgeCount) {
      shouldUpdate = true;
      total += upfc.data.badgeCount;
    }
    if (shouldUpdate) {
      setBadgeCountAsync(total);
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
