import { Spacing } from '@hpapp/features/common/constants';
import { ExternalImage } from '@hpapp/features/common/image';
import { ListItem } from '@hpapp/features/common/list';
import * as date from '@hpapp/foundation/date';
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
  // TODO: use member thumbnail image if imageURL is not available.
  const imageUrl = item.imageURL ?? '';
  const dateString = date.toDateTimeString(item.postAt);
  return (
    <ListItem
      containerStyle={styles.container}
      rightContent={<ExternalImage uri={getOptimizedImageUrl(imageUrl)} style={styles.image} />}
    >
      <View style={styles.titleAndMetadata}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.metadata}>
          {/* FIXME: #42 react-native-svg doesn't work with Expo 48.0
            <AssetIcon type={item.assetType} size={IconSize.Small} /> */}
          <Text style={styles.dateString}>{dateString}</Text>
          <FeedListItemViewHistoryIcon data={item} />
        </View>
      </View>
    </ListItem>
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
    flexDirection: 'row'
  },
  dateString: {
    marginLeft: Spacing.XSmall,
    marginRight: Spacing.Small
  },
  icon: {
    marginRight: Spacing.Small
  }
});

function getOptimizedImageUrl(src: string) {
  if (src.startsWith('https://stat.ameba.jp/user_images/')) {
    // TODO: choose the proper size based on the screen size.
    return `${src}?cpd=300`;
  }
  return src;
}