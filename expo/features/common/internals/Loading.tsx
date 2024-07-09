import { useThemeColor } from '@hpapp/features/app/theme';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export type LoadingProps = {
  testID?: string;
};

export default function Loading({ testID }: LoadingProps) {
  const [color] = useThemeColor('primary');
  return (
    <View style={styles.container} testID={testID}>
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
