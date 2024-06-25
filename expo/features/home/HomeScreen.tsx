import ArtistsTab from '@hpapp/features/artist/ArtistsTab';
import Loading from '@hpapp/features/common/components/Loading';
import GoodsTab from '@hpapp/features/home/GoodsTab';
import HomeTab from '@hpapp/features/home/HomeTab';
import AppUpdateBanner from '@hpapp/features/root/banner/AppUpdateBanner';
import { defineScreen, useNavigationOption } from '@hpapp/features/root/protected/stack';
import SettingsTab from '@hpapp/features/settings/SettingsTab';
import { useColor } from '@hpapp/features/settings/context/theme';
import UPFCTab from '@hpapp/features/upfc/UPFCTab';
import { UPFCProvider } from '@hpapp/features/upfc/context';
import { t } from '@hpapp/system/i18n';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { Suspense } from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
type TabComponent = NonNullable<React.ComponentProps<typeof Tab.Screen>['component']>;

type TabSpec = {
  name: string;
  component: TabComponent;
  icon: string;
};

const Tabs: TabSpec[] = [
  {
    name: 'Home',
    component: HomeTab,
    icon: 'home'
  },
  {
    name: 'Artists',
    component: ArtistsTab,
    icon: 'people'
  },
  {
    name: 'Fan Club',
    component: UPFCTab,
    icon: 'calendar'
  },
  {
    name: 'Goods',
    component: GoodsTab,
    icon: 'cart'
  },
  {
    name: 'Settings',
    component: SettingsTab,
    icon: 'settings'
  }
];

function tabComponent(c: React.ElementType<any>) {
  return function TabComponent() {
    return (
      <View style={styles.tab}>
        <Suspense fallback={<Loading />}>
          <AppUpdateBanner />
          {React.createElement(c)}
        </Suspense>
      </View>
    );
  };
}

function getTabBarIconFn(iconName: string) {
  return function ({ focused, color, size }: { focused: boolean; color: string; size: number }) {
    return <Ionicons name={focused ? iconName : `${iconName}-outline`} size={size} color={color} />;
  };
}

export default defineScreen('/', function HomeScreen() {
  useNavigationOption({ headerShown: false });
  const [primary, contrast] = useColor('primary');
  return (
    <UPFCProvider>
      <Tab.Navigator
        screenOptions={({ route }) => {
          return {
            headerStyle: {
              backgroundColor: primary
            },
            headerTintColor: contrast,
            headerTitleStyle: {
              fontWeight: 'bold'
            }
          };
        }}
      >
        {Tabs.map((tab) => {
          return (
            <Tab.Screen
              key={tab.name}
              name={t(tab.name)}
              component={tabComponent(tab.component)}
              options={{
                tabBarIcon: getTabBarIconFn(tab.icon)
              }}
            />
          );
        })}
      </Tab.Navigator>
    </UPFCProvider>
  );
});

const styles = StyleSheet.create({
  tab: {
    flex: 1
  }
});
