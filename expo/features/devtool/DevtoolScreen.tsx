import { useAppConfig, useCurrentUser, useUserConfig } from '@hpapp/features/app/settings';
import { Text } from '@hpapp/features/common';
import { defineScreen } from '@hpapp/features/common/stack';
import { clearCacheDir } from '@hpapp/system/uricache';
import { Divider, ListItem } from '@rneui/themed';
import { Image } from 'expo-image';
import { ScrollView } from 'react-native';
import Toast from 'react-native-root-toast';

import SettingsDevOnlyListItem from './internals/DevtoolListItem';
import SettingsUserConfigForm from './internals/DevtoolUserConfigForm';

export default defineScreen('/devtool/', function DevtoolScreen() {
  const user = useCurrentUser();
  const appConfig = useAppConfig();
  const userConfig = useUserConfig();
  return (
    <ScrollView>
      <SettingsDevOnlyListItem name="User ID" value={user!.id} />
      <Divider />
      <SettingsDevOnlyListItem
        name="Access Token"
        value={user!.accessToken}
        displayValue={user!.accessToken.substring(0, 4) + '****'}
      />
      <Divider />
      <ListItem
        onPress={async () => {
          await Promise.all([Image.clearDiskCache(), clearCacheDir()]);
          Toast.show('Cache cleared', { duration: Toast.durations.SHORT });
        }}
      >
        <ListItem.Content>
          <Text>Clear Cache</Text>
        </ListItem.Content>
      </ListItem>
      <Divider />
      <SettingsUserConfigForm />
      <SettingsDevOnlyListItem name="Local User Config" value={JSON.stringify(userConfig, null, 2)} />
      <Divider />
      <SettingsDevOnlyListItem name="Local App  Config" value={JSON.stringify(appConfig, null, 2)} />
      <Divider />
    </ScrollView>
  );
});
