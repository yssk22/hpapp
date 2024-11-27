import { Text } from '@hpapp/features/common';
import { clearCacheDir } from '@hpapp/system/uricache';
import { ListItem } from '@rneui/themed';
import { Image } from 'expo-image';
import Toast from 'react-native-root-toast';

export default function ListItemClearCache() {
  return (
    <ListItem
      onPress={async () => {
        await Promise.all([Image.clearDiskCache(), Image.clearMemoryCache(), clearCacheDir()]);
        Toast.show('Cache cleared', { duration: Toast.durations.SHORT });
      }}
    >
      <ListItem.Content>
        <Text>Clear Cache</Text>
      </ListItem.Content>
    </ListItem>
  );
}
