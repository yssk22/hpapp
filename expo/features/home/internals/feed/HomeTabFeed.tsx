import { useUserConfig } from '@hpapp/features/app/settings';
import { useMe } from '@hpapp/features/app/user';

import HomeTabFeedProvider from './HomeTabFeedProvider';
import HomeTabFeedSectionList from './HomeTabFeedSectionList';

export default function HomeTabFeed() {
  const config = useUserConfig();
  const followings = useMe()
    .followings.filter((f) => f.type !== 'unfollow')
    .map((f) => f.memberId);
  return (
    <HomeTabFeedProvider
      assetTypes={['ameblo', 'instagram', 'tiktok', 'twitter']}
      memberIDs={followings}
      useMemberTaggings={config?.feedUseMemberTaggings}
    >
      <HomeTabFeedSectionList />
    </HomeTabFeedProvider>
  );
}
