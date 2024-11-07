import { Spacing } from '@hpapp/features/common/constants';
import { ListItem } from '@hpapp/features/common/list';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

export default function FeedListItemLoadMore() {
  return (
    <ListItem containerStyle={styles.list}>
      <View style={styles.container}>
        <ActivityIndicator size="small" />
      </View>
    </ListItem>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: Spacing.Small
  },
  container: {
    flex: 1,
    justifyContent: 'space-between'
  }
});
