import { useAppConfig, useUPFCConfig } from '@hpapp/features/app/settings';
import { CardSkelton } from '@hpapp/features/common/card';
import { UPFCErrorBox, useUPFCEventApplications } from '@hpapp/features/upfc';
import { UPFCEventApplicationTickets } from '@hpapp/features/upfc/scraper';
import { useMemo } from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';

import UPFCApplicationCard from './HomeTabUPFCApplicationCard';

function keyExtractor(event: UPFCEventApplicationTickets) {
  return event.name;
}

function renderItem(event: ListRenderItemInfo<UPFCEventApplicationTickets>) {
  if (event.item.tickets.length === 0) {
    return null;
  }
  return <UPFCApplicationCard event={event.item} />;
}

export default function HomeTabUPFCCurrentApplicationList() {
  const appConfig = useAppConfig();
  const upfcConfig = useUPFCConfig();
  const params = useMemo(() => {
    return {
      username: upfcConfig?.username ?? '',
      password: upfcConfig?.password ?? '',
      useDemo: appConfig.useUPFCDemoScraper
    };
  }, [upfcConfig?.username, upfcConfig?.password, appConfig.useUPFCDemoScraper]);

  const result = useUPFCEventApplications(params);
  if (result.error) {
    return <UPFCErrorBox error={result.error} />;
  }
  if (result.data === null) {
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
      data={result.data}
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
