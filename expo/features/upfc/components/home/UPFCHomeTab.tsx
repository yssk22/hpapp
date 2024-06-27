import UPFCCurentApplicationList from '@hpapp/features/upfc/internals/UPFCCurrentApplicationList';
import { View, StyleSheet } from 'react-native';

export default function UPFCHomeTab() {
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
