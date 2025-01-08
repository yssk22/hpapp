import { useThemeColor } from '@hpapp/features/app/theme';
import { Loading } from '@hpapp/features/common';
import { SectionListRenderer, SectionList, SectionListLoading } from '@hpapp/features/common/sectionlist';
import { FeedListItemLoadMore } from '@hpapp/features/feed';
import { useUPFCWebView } from '@hpapp/features/upfc';
import { t } from '@hpapp/system/i18n';
import { useMemo } from 'react';

import HomeTabHomeFeedItemListSection from './HomeTabHomeFeedItemListSection';
import HomeTabHomeUPFCNextEventsSection from './HomeTabHomeUPFCNextEventsSection';
import HomeTabHomeUPFCPendingPaymentsSection from './HomeTabHomeUPFCPendingPaymentsSection';
import { useHomeContext } from '../HomeProvider';

export default function HomeTabHome() {
  const openUPFCWebView = useUPFCWebView();
  const [primary] = useThemeColor('primary');
  const { feed, upfc } = useHomeContext();
  const sections: SectionListRenderer<unknown>[] = useMemo(() => {
    const list: SectionListRenderer<unknown>[] = [];
    if (upfc.data !== null) {
      list.push(
        new HomeTabHomeUPFCPendingPaymentsSection({
          primaryColor: primary,
          data: upfc.data.applications,
          onPressListItem: (event) => {
            openUPFCWebView({
              site: event.site,
              urlParams: 'Contents=MYPAGE02'
            });
          }
        })
      );
      list.push(new HomeTabHomeUPFCNextEventsSection(primary, upfc.data.applications));
    } else if (upfc.isLoading) {
      // initial loading
      list.push(
        new SectionListLoading({
          headerText: t('Fan Club'),
          body: <Loading testID="HomeTabHomeSectionList.UPFC.Loading" />
        })
      );
    }
    if (feed.data !== null) {
      list.push(new HomeTabHomeFeedItemListSection(feed.data));
    } else if (feed.isLoading) {
      // initial loading
      list.push(
        new SectionListLoading({
          headerText: t('Latest Posts'),
          body: <Loading testID="HomeTabHomeSectionList.Feed.Loading" />
        })
      );
    }
    return list;
  }, [feed, upfc]);
  return (
    <SectionList
      testID="HomeTabHomeSectionList.SectionList"
      sections={sections}
      isLoading={feed.isLoading || upfc.isLoading}
      reload={() => {
        feed.reload();
        upfc.reload();
      }}
      onEndReachedThreshold={0.01}
      onEndReached={() => {
        feed.loadNext();
      }}
      ListFooterComponent={feed.hasNext ? <FeedListItemLoadMore /> : null}
    />
  );
}
