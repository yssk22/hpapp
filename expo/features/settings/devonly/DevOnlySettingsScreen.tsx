import { defineScreen } from "@hpapp/features/root/protected/stack";
import { useCurrentUser } from "@hpapp/features/auth";
import DevOnlySettingsListItem from "@hpapp/features/settings/devonly/DevOnlySettingsListItem";
import { Divider } from "@rneui/themed";
import useLocalUserConfig from "@hpapp/contexts/settings/useLocalUserConfig";

export default defineScreen(
  "/settings/devonly/",
  function DevOnlySettingsScreen() {
    const [user] = useCurrentUser();
    const [config] = useLocalUserConfig();
    return (
      <>
        <DevOnlySettingsListItem name="User ID" value={user!.id} />
        <Divider />
        <DevOnlySettingsListItem
          name="Access Token"
          value={user!.accessToken}
          displayValue={user!.accessToken.substring(0, 4) + "****"}
        />
        <Divider />
        <DevOnlySettingsListItem
          name="Local User Config"
          value={JSON.stringify(config, null, 2)}
        />
        <Divider />
      </>
    );
  }
);
