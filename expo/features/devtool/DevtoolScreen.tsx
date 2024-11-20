import { ListItemClearCache } from '@hpapp/features/account';
import { useAppConfig, useCurrentUser, useUserConfig } from '@hpapp/features/app/settings';
import { useThemeColor } from '@hpapp/features/app/theme';
import { AuthGateByRole } from '@hpapp/features/auth';
import { Text } from '@hpapp/features/common';
import { defineScreen } from '@hpapp/features/common/stack';
import { t } from '@hpapp/system/i18n';
import { Divider, ListItem } from '@rneui/themed';
import { ScrollView } from 'react-native';

import DevtoolListItem from './internals/DevtoolListItem';
import DevtoolUserConfigForm from './internals/DevtoolUserConfigForm';

export default defineScreen('/devtool/', function DevtoolScreen() {
  const [color, contrast] = useThemeColor('warning');
  const user = useCurrentUser();
  const appConfig = useAppConfig();
  const userConfig = useUserConfig();
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
        displayValue={user!.accessToken.substring(0, 4) + '****'}
      />
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
