import { Loading } from '@hpapp/features/common';
import { SectionListRenderer, SectionList } from '@hpapp/features/common/sectionlist';
import { useMemo } from 'react';

import { useHomeTabFeed } from './HomeTabFeedProvider';
import HomeFeedSection from './HomeTabFeedSection';

export default function HomeTabFeedSectionList() {
  const feed = useHomeTabFeed();
  const sections: SectionListRenderer<unknown>[] = useMemo(() => {
    const list: SectionListRenderer<unknown>[] = [];
    if (feed.data !== null) {
      list.push(new HomeFeedSection(feed.data));
    }
    return list;
  }, []);
  if (sections.length === 0 && feed.isLoading) {
    return <Loading testID="HomeTabFeedSectionList.Loading" />;
  }
  return (
    <SectionList
      testID="HomeTabFeedSectionList.SectionList"
      sections={sections}
      isLoading={feed.isLoading}
      reload={feed.reload}
    />
  );
}
