import { ListItemLoadMore } from '@hpapp/features/common/list';
import { FeedListItem, HPAssetType, HPFeedItem } from '@hpapp/features/feed';
import React from 'react';
import { FlatList } from 'react-native';

import { useFeed } from './ArtistContext';
import ArtistMemberFlatListButtonGroup from './ArtistMemberFlastListButtonGroup';

export type ArtistMemberFlatListProps = {
  header: React.ReactElement;
  onSelect: (button: HPAssetType) => void;
};

export default function ArtistMemberFlatList({ header, onSelect }: ArtistMemberFlatListProps) {
  const buttons = <ArtistMemberFlatListButtonGroup onPress={onSelect} />;
  const feed = useFeed();
  return (
    <FlatList
      stickyHeaderIndices={[1]}
      keyExtractor={(item, index) => {
        if (index < 2) {
          return index.toString();
        }
        return (item as HPFeedItem).id;
      }}
      data={[header, buttons, ...(feed.data ?? [])]}
      renderItem={({ item, index }) => {
        if (index < 2) {
          return item as React.ReactElement;
        }
        return <FeedListItem data={item as HPFeedItem} />;
      }}
      onEndReachedThreshold={0.01}
      onEndReached={() => {
        feed.loadNext();
      }}
      ListFooterComponent={feed.hasNext ? <ListItemLoadMore /> : null}
    />
  );
}
