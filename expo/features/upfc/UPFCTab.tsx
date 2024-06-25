import UPFCCurentApplicationList from '@hpapp/features/upfc/UPFCCurrentApplicationList';
import UPFCNoCredentials from '@hpapp/features/upfc/UPFCNoCredentials';
import useUPFCSettings from '@hpapp/features/upfc/settings/useUPFCSettings';
import { View, StyleSheet } from 'react-native';

export default function UPFCTab() {
  const [upfc] = useUPFCSettings();
  if (!upfc) {
    return <UPFCNoCredentials />;
  }
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
