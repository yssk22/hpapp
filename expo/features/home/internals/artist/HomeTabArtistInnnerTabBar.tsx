import { useThemeColor } from '@hpapp/features/app/theme';
import { Text } from '@hpapp/features/common';
import { TouchableHighlight } from 'react-native';
import { TabBar, SceneRendererProps, NavigationState } from 'react-native-tab-view';

export default function HomeTabArtistInnnerTabBar(
  props: SceneRendererProps & {
    navigationState: NavigationState<{
      key: string;
      title: string;
    }>;
  }
) {
  const [primaryColor, contrastPrimaryColor] = useThemeColor('primary');
  const [bgColor] = useThemeColor('background');
  return (
    <TabBar
      {...props}
      tabStyle={{
        backgroundColor: bgColor
      }}
      renderLabel={({ route, focused }) => {
        return (
          <TouchableHighlight
            style={{
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              borderColor: primaryColor,
              backgroundColor: focused ? primaryColor : contrastPrimaryColor
            }}
          >
            <Text style={{ color: focused ? contrastPrimaryColor : primaryColor }}>{route.title}</Text>
          </TouchableHighlight>
        );
      }}
    />
  );
}
