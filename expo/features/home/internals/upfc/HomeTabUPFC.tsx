import { View, StyleSheet } from 'react-native';

import UPFCCurentApplicationList from './HomeTabUPFCCurrentApplicationList';

export default function HomeTabUPFC() {
  return (
    <View style={styles.container}>
      <UPFCCurentApplicationList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
