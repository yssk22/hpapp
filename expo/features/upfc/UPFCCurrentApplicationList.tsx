import CardSkelton from '@hpapp/features/common/components/card/CardSkelton';
import UPFCApplicationCard from '@hpapp/features/upfc/UPFCApplicationCard';
import { useUPFC } from '@hpapp/features/upfc/context';
import { EventApplicationTickets } from '@hpapp/features/upfc/scraper';
import { FlatList, ListRenderItemInfo } from 'react-native';

function keyExtractor(event: EventApplicationTickets) {
  return event.name;
}

function renderItem(event: ListRenderItemInfo<EventApplicationTickets>) {
  if (event.item.tickets.length === 0) {
    return null;
  }
  return <UPFCApplicationCard event={event.item} />;
}

export default function UPFCCurentApplicationList() {
  const upfc = useUPFC();
  if (upfc.data === null) {
    return (
      <>
        <CardSkelton />
        <CardSkelton />
        <CardSkelton />
        <CardSkelton />
        <CardSkelton />
      </>
    );
  }
  return (
    <FlatList
      data={upfc.data}
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
