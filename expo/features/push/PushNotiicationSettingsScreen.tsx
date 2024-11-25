import { WithSafeArea } from '@hpapp/features/common';
import { defineScreen, useScreenTitle } from '@hpapp/features/common/stack';
import { t } from '@hpapp/system/i18n';
import { ScrollView } from 'react-native';

import PushNotificationSettingsContainer from './internals/PushNotificationSettingsContainer';

export default defineScreen('/push/', function PushNotificationSettingsScreen() {
  useScreenTitle(t('Push Notification Settings'));
  return (
    <WithSafeArea>
      <ScrollView>
        <PushNotificationSettingsContainer />
      </ScrollView>
    </WithSafeArea>
  );
});
