import { ListItemClearCache } from '@hpapp/features/account';
import { useAppConfig, useCurrentUser, useUserConfig } from '@hpapp/features/app/settings';
import { useThemeColor } from '@hpapp/features/app/theme';
import { AuthGateByRole } from '@hpapp/features/auth';
import { Text } from '@hpapp/features/common';
import { defineScreen } from '@hpapp/features/common/stack';
import { usePushNotificationToken } from '@hpapp/features/push';
import { getAppCheckToken } from '@hpapp/system/firebase';
import { t } from '@hpapp/system/i18n';
import { Divider, ListItem } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

import DevtoolListItem from './internals/DevtoolListItem';
import DevtoolListItemResetOnboardingFlow from './internals/DevtoolListItemResetOnboardingFlow';
import DevtoolUserConfigForm from './internals/DevtoolUserConfigForm';

export default defineScreen('/devtool/', function DevtoolScreen() {
  const [color, contrast] = useThemeColor('warning');
  const user = useCurrentUser();
  const appConfig = useAppConfig();
  const userConfig = useUserConfig();
  const [appCheckToken, setAppCheckToken] = useState<string | null>(null);
  const pushToken = usePushNotificationToken();

  useEffect(() => {
    (async () => {
      setAppCheckToken((await getAppCheckToken()).token);
    })();
  }, [setAppCheckToken]);

  return (
    <ScrollView>
      <ListItem containerStyle={{ backgroundColor: color }}>
        <ListItem.Content>
          <Text style={{ color: contrast }}>
            {t('These Settings are for Developers only.') + t("Do not change unless you know what you're doing.")}
          </Text>
        </ListItem.Content>
      </ListItem>
      <Divider />
      <DevtoolListItem name="User ID" value={user!.id} />
      <Divider />
      <DevtoolListItem
        name="Access Token"
        value={user!.accessToken}
        displayValue={user!.accessToken.substring(0, 20) + '****'}
      />
      <Divider />
      <DevtoolListItem
        name="App Check Token"
        value={appCheckToken ?? ''}
        displayValue={(appCheckToken ?? '').substring(0, 20) + '****'}
      />
      <Divider />
      <DevtoolListItem
        name="Push Token"
        value={pushToken.error !== undefined ? pushToken.error.toString() : (pushToken.data ?? '')}
        displayValue={
          pushToken.error !== undefined ? pushToken.error.toString() : (pushToken.data ?? '').substring(0, 20) + '****'
        }
      />
      <Divider />
      <DevtoolListItemResetOnboardingFlow />
      <Divider />
      <ListItemClearCache />
      <Divider />
      <DevtoolUserConfigForm />
      <AuthGateByRole allow={['admin', 'developer']}>
        <DevtoolListItem name="Local User Config" value={JSON.stringify(userConfig, null, 2)} />
        <Divider />
        <DevtoolListItem name="Local App  Config" value={JSON.stringify(appConfig, null, 2)} />
      </AuthGateByRole>
      <Divider />
    </ScrollView>
  );
});
