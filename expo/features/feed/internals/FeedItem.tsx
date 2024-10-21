import Feather from '@expo/vector-icons/Feather';
import { useThemeColor } from '@hpapp/features/app/theme';
import { AmebloIcon } from '@hpapp/features/common';
import { IconSize, Spacing } from '@hpapp/features/common/constants';
import { useNavigation } from '@hpapp/features/common/stack';
import { StyleSheet, View } from 'react-native';
import { graphql, useLazyLoadQuery } from 'react-relay';

import FeedItemAmeblo from './FeedItemAmeblo';
import FeedItemCTA from './FeedItemCTA';
import { FeedItemCTADownload } from './FeedItemCTADownload';
import { FeedItemCTALove } from './FeedItemCTALove';
import { FeedItemQuery } from './__generated__/FeedItemQuery.graphql';

const FeedItemQueryGraphQL = graphql`
  query FeedItemQuery($feedId: ID!) {
    node(id: $feedId) {
      id
      ... on HPFeedItem {
        title
        sourceURL
        assetType
      }
    }
  }
`;

export type FeedItemProps = {
  feedId: string;
};

export default function FeedItem({ feedId }: FeedItemProps) {
  const [color] = useThemeColor('secondary');
  const data = useLazyLoadQuery<FeedItemQuery>(FeedItemQueryGraphQL, { feedId });
  const navigation = useNavigation();
  navigation.setOptions({
    title: data.node!.title
  });
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FeedItemAmeblo url={data.node!.sourceURL!} optimize />
      </View>
      <View style={styles.ctaContainer}>
        {data.node!.assetType === 'ameblo' && <FeedItemCTA label="Open" icon={<AmebloIcon size={IconSize.Medium} />} />}
        <FeedItemCTA label="Share" icon={<Feather name="share" color={color} size={IconSize.Medium} />} />
        <FeedItemCTADownload />
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
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ctaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingTop: Spacing.XSmall,
    paddingBottom: Spacing.XSmall
  }
});
