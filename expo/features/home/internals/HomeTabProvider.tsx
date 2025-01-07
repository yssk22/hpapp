import { useHelloProject } from '@hpapp/features/app/user';
import { ElineupMallProvider, useElineupMall } from '@hpapp/features/elineupmall';
import { createFeedContext } from '@hpapp/features/feed';
import { useMemo } from 'react';

import HomeTabUPFCProvider, { useHomeTabUPFC } from './HomeTabUPFCProvider';

const [HomeTabFeedProvider, useHomeTabFeed] = createFeedContext();

export default function HomeTabProvider({ children }: { children: React.ReactElement }) {
  const followings = useHelloProject()!
    .useFollowingMembers(true)
    .map((m) => m.id);
  return (
    <HomeTabFeedProvider assetTypes={['ameblo', 'instagram', 'tiktok', 'twitter']} memberIDs={followings}>
      <HomeTabUPFCProvider>
        <ElineupMallProvider>{children}</ElineupMallProvider>
      </HomeTabUPFCProvider>
    </HomeTabFeedProvider>
  );
}

export function useHomeTabContext() {
  const feed = useHomeTabFeed();
  const upfc = useHomeTabUPFC();
  const elineupMall = useElineupMall();
  return useMemo(() => {
    return {
      feed,
      upfc,
      elineupMall
    };
  }, [feed, upfc, elineupMall]);
}
