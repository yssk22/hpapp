import { HPMember } from '@hpapp/features/app/user';
import { FeedListItem, FeedListItemLoadMore, HPAssetType, HPFeedItem } from '@hpapp/features/feed';
import { FlatList } from 'react-native';

import { useArtistMemberFeed } from './ArtistMemberContext';
import ArtistMemberFlatListButtonGroup from './ArtistMemberFlastListButtonGroup';
import ArtistMemberHeader from './ArtistMemberHeader';

export type ArtistMemberFlatListProps = {
  member: HPMember;
  onSelect: (button: HPAssetType) => void;
};

export default function ArtistMemberFlatList({ member, onSelect }: ArtistMemberFlatListProps) {
  const header = <ArtistMemberHeader member={member} />;
  const buttons = <ArtistMemberFlatListButtonGroup onPress={onSelect} />;
  const feed = useArtistMemberFeed();
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
      ListFooterComponent={feed.hasNext ? <FeedListItemLoadMore /> : null}
    />
  );
}
