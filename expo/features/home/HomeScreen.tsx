import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { defineScreen } from "@hpapp/features/root/protected/stack";
import HomeTab from "@hpapp/features/home/HomeTab";
import EventsTab from "@hpapp/features/home/Events";
import SettingsTab from "@hpapp/features/settings/SettingsTab";
import GoodsTab from "@hpapp/features/home/GoodsTab";
import ArtistsTab from "@hpapp/features/artist/ArtistsTab";
import { useColor } from "@hpapp/contexts/settings/theme";
import { Fonts } from "@hpapp/features/common/constants";
import { t } from "@hpapp/system/i18n";
import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";

const Tab = createBottomTabNavigator();
type TabComponent = NonNullable<
  React.ComponentProps<typeof Tab.Screen>["component"]
>;

type TabSpec = {
  name: string;
  component: TabComponent;
  icon: string;
};

const Tabs: Array<TabSpec> = [
  {
    name: "Home",
    component: HomeTab,
    icon: "home",
  },
  {
    name: "Artists",
    component: ArtistsTab,
    icon: "people",
  },
  {
    name: "Events",
    component: EventsTab,
    icon: "md-calendar",
  },
  {
    name: "Goods",
    component: GoodsTab,
    icon: "cart",
  },
  {
    name: "Settings",
    component: SettingsTab,
    icon: "settings",
  },
];
function getTabBarIconFn(iconName: string) {
  return function ({
    focused,
    color,
    size,
  }: {
    focused: boolean;
    color: string;
    size: number;
  }) {
    return (
      <Ionicons
        name={focused ? iconName : `${iconName}-outline`}
        size={size}
        color={color}
      />
    );
  };
}

export default defineScreen(
  "/",
  function () {
    const [primary, contrast] = useColor("primary");
    return (
      <Tab.Navigator
        screenOptions={({ route }) => {
          return {
            headerStyle: {
              backgroundColor: primary,
            },
            headerTintColor: contrast,
            headerTitleStyle: {
              fontWeight: "bold",
              fontFamily: Fonts.Main,
            },
          };
        }}
      >
        {Tabs.map((tab) => {
          return (
            <Tab.Screen
              key={tab.name}
              name={t(tab.name)}
              component={tab.component}
              options={{
                tabBarIcon: getTabBarIconFn(tab.icon),
              }}
            />
          );
        })}
      </Tab.Navigator>
    );
  },
  {
    headerShown: false,
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
