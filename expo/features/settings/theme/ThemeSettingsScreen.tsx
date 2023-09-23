import { useLogout } from "@hpapp/features/auth";
import { View, StyleSheet } from "react-native";
import { ListItem } from "@rneui/themed";
import { defineScreen } from "@hpapp/features/root/protected/stack";
import NavigationListItem from "@hpapp/features/common/components/list/NavigationListItem";
import ThemeColorSelectorScreen from "@hpapp/features/settings/theme/ThemeColorSelectorScreen";
import { t } from "@hpapp/system/i18n";
import { ColorScheme, useColor } from "@hpapp/contexts/settings/theme";
import { Spacing } from "@hpapp/features/common/constants";
import Text from "@hpapp/features/common/components/Text";

export default defineScreen(
  "/settings/theme/",
  function ThemeSettngsScreen() {
    const [primary, primaryContrast] = useColor("primary");
    const [secondary, secondaryContrast] = useColor("secondary");
    const [background, backgroundContrast] = useColor("background");
    return (
      <View style={styles.container}>
        <NavigationListItem
          screen={ThemeColorSelectorScreen}
          params={{
            title: t("Primary Color"),
            scheme: "primary" as ColorScheme,
          }}
        >
          <Text
            style={[
              styles.text,
              { backgroundColor: primary, color: primaryContrast },
            ]}
          >
            {t("Primary Color")}
          </Text>
        </NavigationListItem>
        <NavigationListItem
          screen={ThemeColorSelectorScreen}
          params={{
            title: t("Secondary Color"),
            scheme: "secondary" as ColorScheme,
          }}
        >
          <Text
            style={[
              styles.text,
              { backgroundColor: secondary, color: secondaryContrast },
            ]}
          >
            {t("Secondary Color")}
          </Text>
        </NavigationListItem>
        <NavigationListItem
          screen={ThemeColorSelectorScreen}
          params={{
            title: t("Background Color"),
            scheme: "background" as ColorScheme,
          }}
        >
          <Text
            style={[
              styles.text,
              { backgroundColor: background, color: backgroundContrast },
            ]}
          >
            {t("Background Color")}
          </Text>
        </NavigationListItem>
      </View>
    );
  },
  {
    title: t("Theme Settings"),
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    paddingHorizontal: Spacing.Small,
    paddingVertical: Spacing.XXSmall,
  },
});
