import useLocalUserConfig from '@hpapp/contexts/settings/useLocalUserConfig';
import { useCurrentUser } from '@hpapp/features/auth';
import { defineScreen } from '@hpapp/features/root/protected/stack';
import DevOnlySettingsListItem from '@hpapp/features/settings/devonly/DevOnlySettingsListItem';
import { Divider } from '@rneui/themed';

export default defineScreen('/settings/devonly/', function DevOnlySettingsScreen() {
  const [user] = useCurrentUser();
  const [config] = useLocalUserConfig();
  return (
    <>
      <DevOnlySettingsListItem name="User ID" value={user!.id} />
      <Divider />
      <DevOnlySettingsListItem
        name="Access Token"
        value={user!.accessToken}
        displayValue={user!.accessToken.substring(0, 4) + '****'}
      />
      <Divider />
      <DevOnlySettingsListItem name="Local User Config" value={JSON.stringify(config, null, 2)} />
      <Divider />
    </>
  );
});