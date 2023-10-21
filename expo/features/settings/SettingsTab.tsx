import { useLogout } from "@hpapp/features/auth";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button, Divider } from "@rneui/themed";
import NavigationListItem from "@hpapp/features/common/components/list/NavigationListItem";
import ThemeSettingsScreen from "@hpapp/features/settings/theme/ThemeSettingsScreen";
import { ListItem } from "@rneui/base";
import { t } from "@hpapp/system/i18n";
import LogoutListItem from "@hpapp/features/settings/LogoutListItem";
import VersionSignature from "@hpapp/features/settings/VersionSignature";
import UPFCSettingsScreen from "@hpapp/features/upfc/settings/UPFCSettingsScreen";

export default function SettingsTab() {
  return (
    <ScrollView>
      <NavigationListItem screen={ThemeSettingsScreen}>
        {t("Theme Settings")}
      </NavigationListItem>
      <Divider />
      <NavigationListItem screen={UPFCSettingsScreen}>
        {t("FC Settings")}
      </NavigationListItem>
      <Divider />
      <LogoutListItem />
      <Divider />
      <VersionSignature />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
