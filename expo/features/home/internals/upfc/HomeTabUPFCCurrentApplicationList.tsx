import { CardSkelton } from '@hpapp/features/common/card';
import { UPFCErrorBox } from '@hpapp/features/upfc';
import { UPFCEventApplicationTickets } from '@hpapp/features/upfc/scraper';
import { useMemo } from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';

import UPFCApplicationCard from './HomeTabUPFCApplicationCard';
import { useHomeTabContext } from '../HomeTabProvider';

function keyExtractor(event: UPFCEventApplicationTickets) {
  return `${event.site}-${event.name}`; // just in case if two sites have the same name of event
}

function renderItem(event: ListRenderItemInfo<UPFCEventApplicationTickets>) {
  return <UPFCApplicationCard event={event.item} />;
}

export default function HomeTabUPFCCurrentApplicationList() {
  const { upfc } = useHomeTabContext();
  const applications = useMemo(() => {
    if (upfc.error) {
      return null;
    }
    if (upfc.data === null) {
      return null;
    }
    return upfc.data.applications.filter((event) => event.tickets.length > 0);
  }, [upfc]);

  if (upfc.error) {
    return <UPFCErrorBox error={upfc.error} />;
  }
  if (applications === null) {
    return (
      <View testID="HomeTabUPFCCurrentApplicationList.Skelton">
        <CardSkelton />
        <CardSkelton />
        <CardSkelton />
        <CardSkelton />
        <CardSkelton />
      </View>
    );
  }
  return (
    <FlatList
      testID="HomeTabUPFCCurrentApplicationList.Flatlist"
      data={applications}
      initialNumToRender={10}
      maxToRenderPerBatch={1}
      updateCellsBatchingPeriod={0}
      removeClippedSubviews
      windowSize={11}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
    />
  );
}
