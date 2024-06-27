import useAppConfig from '@hpapp/features/appconfig/useAppConfig';
import CardSkelton from '@hpapp/features/common/components/card/CardSkelton';
import useUPFCEventApplications from '@hpapp/features/upfc/hooks/useUPFCEventApplications';
import UPFCApplicationCard from '@hpapp/features/upfc/internals/UPFCApplicationCard';
import UPFCErrorBox from '@hpapp/features/upfc/internals/UPFCErrorBox';
import { UPFCEventApplicationTickets } from '@hpapp/features/upfc/internals/scraper/types';
import useUPFCSettings from '@hpapp/features/upfc/internals/settings/useUPFCSettings';
import { useMemo } from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';

function keyExtractor(event: UPFCEventApplicationTickets) {
  return event.name;
}

function renderItem(event: ListRenderItemInfo<UPFCEventApplicationTickets>) {
  if (event.item.tickets.length === 0) {
    return null;
  }
  return <UPFCApplicationCard event={event.item} />;
}

export default function UPFCCurentApplicationList() {
  const appConfig = useAppConfig();
  const [settings] = useUPFCSettings();
  const params = useMemo(() => {
    return {
      username: settings?.username ?? '',
      password: settings?.password ?? '',
      useDemo: appConfig.useUPFCDemoScraper
    };
  }, [settings?.username, settings?.password, appConfig.useUPFCDemoScraper]);

  const result = useUPFCEventApplications(params);
  if (result.error) {
    return <UPFCErrorBox error={result.error} />;
  }
  if (result.data === null) {
    return (
      <View testID="UPFCCurentApplicationList.Skelton">
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
      testID="UPFCCurentApplicationList_FlatList"
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
