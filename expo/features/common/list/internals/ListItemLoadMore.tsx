import { useThemeColor } from '@hpapp/features/app/theme';
import { ListItem } from '@rneui/themed';
import { StyleSheet, ActivityIndicator, View } from 'react-native';

export default function ListItemLoadMore() {
  const [color] = useThemeColor('primary');
  return (
    <ListItem>
      <View style={styles.container}>
        <ActivityIndicator size="small" color={color} />
      </View>
    </ListItem>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  }
});
