import { defineScreen } from '@hpapp/features/root/protected/stack';
import { View, StyleSheet, Text } from 'react-native';

export default defineScreen('/feed/', function () {
  return (
    <View style={styles.container}>
      <Text>FeedItem</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
