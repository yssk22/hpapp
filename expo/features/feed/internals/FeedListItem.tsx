import { ArtistMemberIcon } from '@hpapp/features/artist';
import { AssetIcon, ExternalImage } from '@hpapp/features/common';
import { IconSize, Spacing } from '@hpapp/features/common/constants';
import { ListItem } from '@hpapp/features/common/list';
import { useNavigation } from '@hpapp/features/common/stack';
import FeedItemScreen from '@hpapp/features/feed/FeedItemScreen';
import * as date from '@hpapp/foundation/date';
import { isEmpty } from '@hpapp/foundation/string';
import { Divider } from '@rneui/base';
import { View, Text, StyleSheet } from 'react-native';
import { graphql, useFragment } from 'react-relay';

import FeedListItemViewHistoryIcon from './FeedListItemViewHistoryIcon';
import { FeedListItemFragment$key } from './__generated__/FeedListItemFragment.graphql';

const FeedListItemFragmentGraphQL = graphql`
  fragment FeedListItemFragment on HPFeedItem {
    id
    title
    sourceID
    sourceURL
    imageURL
    assetType
    postAt
    ownerMember {
      id
      key
    }
    taggedMembers {
      id
      key
    }
    ...FeedListItemViewHistoryIconFragment
  }
`;

export default function FeedListItem({ data }: { data: FeedListItemFragment$key }) {
  const item = useFragment<FeedListItemFragment$key>(FeedListItemFragmentGraphQL, data);
  const navigation = useNavigation();
  // TODO: use member thumbnail image if imageURL is not available.
  const imageUrl = item.imageURL ?? '';
  const dateString = date.toDateTimeString(item.postAt);
  return (
    <>
      <Divider />
      <ListItem
        containerStyle={styles.container}
        rightContent={
          isEmpty(imageUrl) ? (
            <ArtistMemberIcon memberId={item.ownerMember!.id} size={80} />
          ) : (
            <ExternalImage
              uri={getOptimizedImageUrl(imageUrl)}
              style={styles.image}
              width={80}
              height={80}
              cachePolicy="memory-disk"
            />
          )
        }
        onPress={() => {
          navigation.navigate(FeedItemScreen, { feedId: item.id });
        }}
      >
        <View style={styles.titleAndMetadata}>
          <Text style={styles.title} numberOfLines={3}>
            {item.title}
          </Text>
          <View style={styles.metadata}>
            <AssetIcon type={item.assetType} size={IconSize.Small} />
            <Text style={styles.dateString} numberOfLines={1} ellipsizeMode="tail">
              {dateString}
            </Text>
            <FeedListItemViewHistoryIcon data={item} />
          </View>
        </View>
      </ListItem>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    padding: Spacing.Small
  },
  image: {
    width: 80,
    height: 80
  },
  titleAndMetadata: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: Spacing.Medium
  },
  title: {
    flexGrow: 1
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dateString: {
    paddingLeft: Spacing.XSmall,
    paddingRight: Spacing.XSmall
  }
});

function getOptimizedImageUrl(src: string) {
  if (src.startsWith('https://stat.ameba.jp/user_images/')) {
    // TODO: choose the proper size based on the screen size.
    return `${src}?cpd=300`;
  }
  return src;
}
