import { useColor } from '@hpapp/contexts/settings/theme';
import ArtistsTab from '@hpapp/features/artist/ArtistsTab';
import { Fonts } from '@hpapp/features/common/constants';
import EventsTab from '@hpapp/features/home/Events';
import GoodsTab from '@hpapp/features/home/GoodsTab';
import HomeTab from '@hpapp/features/home/HomeTab';
import { defineScreen, useNavigationOption } from '@hpapp/features/root/protected/stack';
import SettingsTab from '@hpapp/features/settings/SettingsTab';
import { t } from '@hpapp/system/i18n';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
    name: 'Events',
    component: EventsTab,
    icon: 'md-calendar'
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
function getTabBarIconFn(iconName: string) {
  return function ({ focused, color, size }: { focused: boolean; color: string; size: number }) {
    return <Ionicons name={focused ? iconName : `${iconName}-outline`} size={size} color={color} />;
  };
}

export default defineScreen('/', function () {
  useNavigationOption({ headerShown: false });
  const [primary, contrast] = useColor('primary');
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        return {
          headerStyle: {
            backgroundColor: primary
          },
          headerTintColor: contrast,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: Fonts.Main
          }
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
              tabBarIcon: getTabBarIconFn(tab.icon)
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
});
