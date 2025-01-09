import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeColor } from '@hpapp/features/app/theme';
import { useNavigationOption } from '@hpapp/features/common/stack';
import { logEvent } from '@hpapp/system/firebase';
import { t } from '@hpapp/system/i18n';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { ComponentProps } from 'react';

import { useHomeContext } from './HomeProvider';
import HomeTabArtist from './artist/HomeTabArtist';
import HomeTabGoods from './goods/HomeTabGoods';
import HomeTabHome from './home/HomeTabHome';
import HomeTabSettings from './menu/HomeTabMenu';
import HomeTabUPFC from './upfc/HomeTabUPFC';

export default function HomeTab() {
  useNavigationOption({ headerShown: false });
  const [primary, contrast] = useThemeColor('primary');
  const ctx = useHomeContext();
  return (
    <Tab.Navigator
      screenListeners={{
        state: (e) => {
          logEvent('home_tab_view', {
            tabName: e.data.state.routes[e.data.state.index].name
          });
        }
      }}
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
      <Tab.Screen
        name={t('Home')}
        component={HomeTabHome}
        options={{
          tabBarIcon: getTabBarIconFn('home'),
          tabBarBadge: getTabBarBadge(ctx.feed.badgeCount)
        }}
      />
      <Tab.Screen
        name={t('Artists')}
        component={HomeTabArtist}
        options={{
          tabBarIcon: getTabBarIconFn('people')
        }}
      />
      <Tab.Screen
        name={t('Fan Club')}
        component={HomeTabUPFC}
        options={{
          tabBarIcon: getTabBarIconFn('calendar'),
          tabBarBadge: getTabBarBadge(ctx.upfc.data?.badgeCount)
        }}
      />
      <Tab.Screen
        name={t('Goods')}
        component={HomeTabGoods}
        options={{
          tabBarIcon: getTabBarIconFn('cart')
        }}
      />
      <Tab.Screen
        name={t('Menu')}
        component={HomeTabSettings}
        options={{
          tabBarIcon: getTabBarIconFn('menu')
        }}
      />
    </Tab.Navigator>
  );
}

const Tab = createBottomTabNavigator();
type IconName = ComponentProps<typeof Ionicons>['name'];

function getTabBarBadge(value: number | undefined) {
  if ((value ?? 0) > 0) {
    return value;
  }
  return undefined;
}

function getTabBarIconFn(iconName: IconName) {
  return function ({ focused, color, size }: { focused: boolean; color: string; size: number }) {
    return <Ionicons name={(focused ? iconName : `${iconName}-outline`) as IconName} size={size} color={color} />;
  };
}
