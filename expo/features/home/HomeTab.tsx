import { HomeTabFeedProvider } from '@hpapp/features/home/HomeTabFeed';
import HomeTabSectionList from '@hpapp/features/home/HomeTabSectionList';
import { useMe } from '@hpapp/features/root/protected/context';
import useLocalUserConfig from '@hpapp/features/settings/context/useLocalUserConfig';

export default function HomeTab() {
  const [config] = useLocalUserConfig();
  const followings = useMe()
    .followings.filter((f) => f.type !== 'unfollow')
    .map((f) => f.memberId);
  return (
    <HomeTabFeedProvider
      assetTypes={['ameblo', 'instagram', 'tiktok', 'twitter']}
      memberIDs={followings}
      useMemberTaggings={config?.feedUseMemberTaggings}
    >
      <HomeTabSectionList />
    </HomeTabFeedProvider>
  );
}
