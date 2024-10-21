import { useThemeColor } from '@hpapp/features/app/theme';
import { Loading } from '@hpapp/features/common';
import { SectionListRenderer, SectionList } from '@hpapp/features/common/sectionlist';
import { useMemo } from 'react';

import HomeTabHomeFeedItemListSection from './HomeTabHomeFeedItemListSection';
import HomeTabHomeUPFCNextEventsSection from './HomeTabHomeUPFCNextEventsSection';
import HomeTabHomeUPFCPendingPaymentsSection from './HomeTabHomeUPFCPendingPaymentsSection';
import { useHomeTabContext } from '../HomeTabProvider';

export default function HomeTabHome() {
  const [primary] = useThemeColor('primary');
  const { feed, upfc } = useHomeTabContext();
  const sections: SectionListRenderer<unknown>[] = useMemo(() => {
    const list: SectionListRenderer<unknown>[] = [];
    if (upfc.data) {
      list.push(new HomeTabHomeUPFCPendingPaymentsSection(primary, upfc.data));
      list.push(new HomeTabHomeUPFCNextEventsSection(primary, upfc.data));
    }
    if (feed.data !== null) {
      list.push(new HomeTabHomeFeedItemListSection(feed.data));
    }
    return list;
  }, [feed, upfc]);
  if (sections.length === 0 && feed.isLoading) {
    return <Loading testID="HomeTabHomeSectionList.Loading" />;
  }
  return (
    <SectionList
      testID="HomeTabHomeSectionList.SectionList"
      sections={sections}
      isLoading={feed.isLoading}
      reload={feed.reload}
    />
  );
}
