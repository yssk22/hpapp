import { AmebloIcon } from '@hpapp/features/common';
import { IconSize, Spacing } from '@hpapp/features/common/constants';
import { useNavigation } from '@hpapp/features/common/stack';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { graphql, useLazyLoadQuery } from 'react-relay';

import FeedItemAmeblo from './FeedItemAmeblo';
import FeedItemCTA from './FeedItemCTA';
import { FeedItemCTADownload } from './FeedItemCTADownload';
import { FeedItemCTALove } from './FeedItemCTALove';
import { FeedItemCTAShare } from './FeedItemCTAShare';
import { FeedItemQuery } from './__generated__/FeedItemQuery.graphql';

const FeedItemQueryGraphQL = graphql`
  query FeedItemQuery($feedId: ID!) {
    node(id: $feedId) {
      id
      ... on HPFeedItem {
        title
        sourceURL
        assetType
        ownerMember {
          name
        }
        media {
          url
        }
      }
    }
  }
`;

export type FeedItemProps = {
  feedId: string;
};

export default function FeedItem({ feedId }: FeedItemProps) {
  const data = useLazyLoadQuery<FeedItemQuery>(FeedItemQueryGraphQL, { feedId });
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  navigation.setOptions({
    title: data.node!.title
  });
  const ownerName = data.node!.ownerMember?.name ?? 'unknown';
  const urls = data.node!.media?.map((m) => m.url) ?? [];
  const albumName = `hellofanapp.${ownerName}`;
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FeedItemAmeblo url={data.node!.sourceURL!} optimize />
      </View>
      <View style={[styles.ctaContainer, { marginBottom: insets.bottom }]}>
        {data.node!.assetType === 'ameblo' && <FeedItemCTA label="Open" icon={<AmebloIcon size={IconSize.Medium} />} />}
        <FeedItemCTAShare url={data.node!.sourceURL!} />
        {urls.length > 0 && <FeedItemCTADownload albumName={albumName} urls={urls} />}
        <FeedItemCTALove />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    flexGrow: 1
  },
  ctaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingTop: Spacing.XSmall,
    paddingBottom: Spacing.XSmall
  }
});
