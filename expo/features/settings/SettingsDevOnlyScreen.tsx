import { useAppConfig, useCurrentUser, useUserConfig } from '@hpapp/features/app/settings';
import { defineScreen } from '@hpapp/features/common/stack';
import { Divider } from '@rneui/themed';

import SettingsDevOnlyListItem from './internals/SettingsDevOnlyListItem';

export default defineScreen('/settings/devonly/', function DevOnlySettingsScreen() {
  const user = useCurrentUser();
  const appConfig = useAppConfig();
  const userConfig = useUserConfig();
  return (
    <>
      <SettingsDevOnlyListItem name="User ID" value={user!.id} />
      <Divider />
      <SettingsDevOnlyListItem
        name="Access Token"
        value={user!.accessToken}
        displayValue={user!.accessToken.substring(0, 4) + '****'}
      />
      <Divider />
      <SettingsDevOnlyListItem name="Local User Config" value={JSON.stringify(userConfig, null, 2)} />
      <Divider />
      <SettingsDevOnlyListItem name="Local App  Config" value={JSON.stringify(appConfig, null, 2)} />
      <Divider />
    </>
  );
});
