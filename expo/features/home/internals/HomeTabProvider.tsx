import { useHelloProject } from '@hpapp/features/app/user';
import { createFeedContext } from '@hpapp/features/feed';
import { useMemo } from 'react';

import HomeTabElineupMallProvider, { useHomeTabElineupMall } from './HomeTabElineupMallProvider';
import HomeTabUPFCProvider, { useHomeTabUPFC } from './HomeTabUPFCProvider';

const [HomeTabFeedProvider, useHomeTabFeed] = createFeedContext();

export default function HomeTabProvider({ children }: { children: React.ReactElement }) {
  const followings = useHelloProject()!
    .useFollowingMembers(true)
    .map((m) => m.id);
  return (
    <HomeTabFeedProvider assetTypes={['ameblo', 'instagram', 'tiktok', 'twitter']} memberIDs={followings}>
      <HomeTabUPFCProvider>
        <HomeTabElineupMallProvider>{children}</HomeTabElineupMallProvider>
      </HomeTabUPFCProvider>
    </HomeTabFeedProvider>
  );
}

export function useHomeTabContext() {
  const feed = useHomeTabFeed();
  const upfc = useHomeTabUPFC();
  const elineupMall = useHomeTabElineupMall;
  return useMemo(() => {
    return {
      feed,
      upfc,
      elineupMall
    };
  }, [feed, upfc, elineupMall]);
}
