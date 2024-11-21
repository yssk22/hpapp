import { useHelloProject } from '@hpapp/features/app/user';
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
      <HomeTabUPFCProvider>{children}</HomeTabUPFCProvider>
    </HomeTabFeedProvider>
  );
}

export function useHomeTabContext() {
  const feed = useHomeTabFeed();
  const upfc = useHomeTabUPFC();
  return useMemo(() => {
    return {
      feed,
      upfc
    };
  }, [feed, upfc]);
}
