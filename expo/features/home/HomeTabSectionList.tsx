// temoprary remove all to revisit the design.

// import Loading from '@hpapp/features/common/components/Loading';
// import HomeFeedSection from '@hpapp/features/feed/HomeFeedSection';
// import { useHomeTabFeed } from '@hpapp/features/home/HomeTabFeed';
// import { HomeTabSection } from '@hpapp/features/home/types';
// import { useColor } from '@hpapp/features/settings/context/theme';
// import { useUPFC } from '@hpapp/features/upfc/context';
// import NextEventsSection from '@hpapp/features/upfc/components/home/NextEventsSection';
// import PendingPaymentsSection from '@hpapp/features/upfc/components/home/PendingPaymentsSection';
// import { useMemo } from 'react';
// import { RefreshControl, SectionList } from 'react-native';

export default function HomeTabSectionList() {
  return null;
  // const [color] = useColor('primary');
  // const upfc = useUPFC();
  // const feed = useHomeTabFeed();
  // const sections: HomeTabSection<unknown>[] = useMemo(() => {
  //   const list: HomeTabSection<unknown>[] = [];
  //   if (upfc.data !== null) {
  //     list.push(new PendingPaymentsSection(color, upfc.data));
  //     list.push(new NextEventsSection(color, upfc.data));
  //   }
  //   if (feed.data !== null) {
  //     list.push(new HomeFeedSection(feed.data));
  //   }
  //   return list;
  // }, [feed]);
  // const refreshing = feed.isLoading || upfc.isLoading;
  // if (sections.length === 0 && refreshing) {
  //   return <Loading />;
  // }
  // return (
  //   <>
  //     <SectionList
  //       sections={sections}
  //       keyExtractor={(item, index) => `hometabsectionlist-${index}`}
  //       renderSectionHeader={({ section }) => {
  //         return section.renderSectionHeader();
  //       }}
  //       renderItem={(o) => {
  //         return o.section.renderListItem(o);
  //       }}
  //       refreshControl={
  //         <RefreshControl
  //           refreshing={refreshing}
  //           onRefresh={() => {
  //             upfc.reload();
  //             feed.reload();
  //           }}
  //         />
  //       }
  //     />
  //   </>
  // );
}
