import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeColor } from '@hpapp/features/app/theme';
import { Loading } from '@hpapp/features/common/';
import { useNavigationOption } from '@hpapp/features/common/stack';
import { t } from '@hpapp/system/i18n';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { ComponentProps, Suspense } from 'react';
import { View, StyleSheet } from 'react-native';

import HomeTabArtist from './artist/HomeTabArtist';
import HomeTabFeed from './feed/HomeTabFeed';
import HomeTabGoods from './goods/HomeTabGoods';
import HomeTabSettings from './settings/HomeTabSettings';
import HomeTabUPFC from './upfc/HomeTabUPFC';

export default function HomeTab() {
  useNavigationOption({ headerShown: false });
  const [primary, contrast] = useThemeColor('primary');
  return (
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
            // eslint-disable-next-line local-rules/no-translation-entry
            name={t(tab.name)}
            component={tabComponent(tab.component)}
            options={{
              tabBarIcon: getTabBarIconFn(tab.icon)
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tab: {
    flex: 1
  }
});

const Tab = createBottomTabNavigator();
type TabComponent = NonNullable<React.ComponentProps<typeof Tab.Screen>['component']>;
type IconName = ComponentProps<typeof Ionicons>['name'];

type TabSpec = {
  name: string;
  component: TabComponent;
  icon: IconName;
};

const Tabs: TabSpec[] = [
  {
    name: 'Home',
    component: HomeTabFeed,
    icon: 'home'
  },
  {
    name: 'Artists',
    component: HomeTabArtist,
    icon: 'people'
  },
  {
    name: 'Fan Club',
    component: HomeTabUPFC,
    icon: 'calendar'
  },
  {
    name: 'Goods',
    component: HomeTabGoods,
    icon: 'cart'
  },
  {
    name: 'Settings',
    component: HomeTabSettings,
    icon: 'settings'
  }
];

function tabComponent(c: React.ElementType<any>) {
  return function TabComponent() {
    return (
      <View style={styles.tab}>
        <Suspense fallback={<Loading />}>{React.createElement(c)}</Suspense>
      </View>
    );
  };
}

function getTabBarIconFn(iconName: IconName) {
  return function ({ focused, color, size }: { focused: boolean; color: string; size: number }) {
    return <Ionicons name={(focused ? iconName : `${iconName}-outline`) as IconName} size={size} color={color} />;
  };
}
