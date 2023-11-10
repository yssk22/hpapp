import { useColor } from '@hpapp/features/settings/context/theme';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Loading() {
  const [color] = useColor('primary');
  return (
    <View style={styles.container}>
      <ActivityIndicator color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
