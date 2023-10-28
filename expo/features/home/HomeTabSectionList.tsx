import HomeFeedSection from '@hpapp/features/feed/HomeFeedSection';
import useFeed from '@hpapp/features/feed/useFeed';
import { HomeTabSection } from '@hpapp/features/home/types';
import { useMe } from '@hpapp/features/root/protected/context';
import { useColor } from '@hpapp/features/settings/context/theme';
import useLocalUserConfig from '@hpapp/features/settings/context/useLocalUserConfig';
import { useUPFC } from '@hpapp/features/upfc/context';
import NextEventsSection from '@hpapp/features/upfc/home/NextEventsSection';
import PendingPaymentsSection from '@hpapp/features/upfc/home/PendingPaymentsSection';
import { useMemo } from 'react';
import { SectionList } from 'react-native';

export default function HomeTabSectionList() {
  const [color] = useColor('primary');
  const [config] = useLocalUserConfig();
  const followings = useMe()
    .followings.filter((f) => f.type !== 'unfollow')
    .map((f) => f.memberId);
  const numFetch = followings.length > 10 ? followings.length + 10 : 15;
  const upfc = useUPFC();
  const feed = useFeed({
    numFetch,
    assetTypes: ['ameblo', 'instagram', 'tiktok', 'twitter'],
    memberIds: followings,
    useMemberTaggings: config?.feedUseMemberTaggings ?? false
  });
  const sections: HomeTabSection<unknown>[] = useMemo(() => {
    return [
      new PendingPaymentsSection(color, upfc.data ?? []),
      new NextEventsSection(color, upfc.data ?? []),
      new HomeFeedSection((feed.data.feed?.edges ?? []).filter((edge) => edge?.node != null).map((edge) => edge!.node!))
    ];
  }, [upfc.data, feed]);
  return (
    <SectionList
      sections={sections}
      keyExtractor={(item, index) => `hometabsectionlist-${index}`}
      renderSectionHeader={({ section }) => {
        return section.renderSectionHeader();
      }}
      renderItem={(o) => {
        return o.section.renderListItem(o);
      }}
    />
  );
}
