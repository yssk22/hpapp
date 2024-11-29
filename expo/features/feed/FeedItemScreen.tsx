import { Loading } from '@hpapp/features/common';
import { defineScreen } from '@hpapp/features/common/stack';
import { Suspense } from 'react';
import { StyleSheet, View } from 'react-native';

import FeedItem from './internals/FeedItem';

export type FeedItemScreenProps = {
  feedId: string;
};

export default defineScreen('/feed/item/', function FeedItemScreen(props: FeedItemScreenProps) {
  return (
    <View style={styles.container}>
      <Suspense fallback={<Loading />}>
        <FeedItem {...props} />
      </Suspense>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
