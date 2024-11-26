import { View, StyleSheet } from 'react-native';

import HomeTabUPFCCurrentApplicationList from './HomeTabUPFCCurrentApplicationList';

export default function HomeTabUPFC() {
  return (
    <View style={styles.container}>
      <HomeTabUPFCCurrentApplicationList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
