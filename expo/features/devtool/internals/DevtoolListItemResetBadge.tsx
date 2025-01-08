import { Text } from '@hpapp/features/common';
import { ListItem } from '@rneui/themed';
import { setBadgeCountAsync } from 'expo-notifications';
import Toast from 'react-native-root-toast';

export default function DevtoolListItemResetBadge() {
  return (
    <ListItem
      onPress={async () => {
        const x = 10;
        const ok = await setBadgeCountAsync(x);
        if (ok) {
          Toast.show(`Badge count has been updated to ${x}`, { duration: Toast.durations.SHORT });
        } else {
          Toast.show(`Your device is not supported to update the badge`, { duration: Toast.durations.SHORT });
        }
      }}
    >
      <ListItem.Content>
        <Text>Reset Badge</Text>
      </ListItem.Content>
    </ListItem>
  );
}
