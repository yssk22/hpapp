import { SettingsAppConfig, SettingsUserConfig, SettingsUPFCConfig } from '@hpapp/features/app/settings';
import { Text } from '@hpapp/features/common';
import { clearCacheDir } from '@hpapp/system/uricache';
import { ListItem } from '@rneui/themed';
import { Image } from 'expo-image';
import * as Updates from 'expo-updates';
import Toast from 'react-native-root-toast';

export default function DevtoolListItemResetOnboardingFlow() {
  return (
    <ListItem
      onPress={async () => {
        await Promise.all([
          Image.clearDiskCache(),
          Image.clearMemoryCache(),
          SettingsAppConfig.clear(),
          SettingsUserConfig.clear(),
          SettingsUPFCConfig.clear(),
          clearCacheDir()
        ]);
        if (__DEV__) {
          Toast.show('All data cleared, please reload the app manually', { duration: Toast.durations.SHORT });
        } else {
          Updates.reloadAsync();
        }
      }}
    >
      <ListItem.Content>
        <Text>Reset Onboarding Flow</Text>
      </ListItem.Content>
    </ListItem>
  );
}
