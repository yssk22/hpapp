import { Text } from '@hpapp/features/common';
import { Spacing } from '@hpapp/features/common/constants';
import { ScrollView, StyleSheet, View } from 'react-native';
import { graphql, useLazyLoadQuery } from 'react-relay';

import { FeedItemInstagramOptimizedViewMedia } from './FeedItemInstagramOptimizedViewMedia';
import { FeedItemInstagramOptimizedViewQuery } from './__generated__/FeedItemInstagramOptimizedViewQuery.graphql';

const FeedItemInstagramOptimizedViewQueryGraphQL = graphql`
  query FeedItemInstagramOptimizedViewQuery($id: ID!) {
    node(id: $id) {
      id
      ... on HPIgPost {
        description
        media {
          url
          type
          width
          height
          thumbnailUrl
        }
      }
    }
  }
`;

type FeedItemInstagramOptimizedViewProps = {
  id: number;
};

export default function FeedItemInstasgramOptimizedView({ id }: FeedItemInstagramOptimizedViewProps) {
  const data = useLazyLoadQuery<FeedItemInstagramOptimizedViewQuery>(FeedItemInstagramOptimizedViewQueryGraphQL, {
    id: id.toString()
  });
  return (
    <ScrollView style={styles.container}>
      <FeedItemInstagramOptimizedViewMedia media={[...data.node?.media!]} />
      <View style={styles.description}>
        <Text>{data.node?.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  description: {
    padding: Spacing.Medium
  }
});
