import { useColor } from '@hpapp/contexts/settings/theme';
import ByAgeView from '@hpapp/features/artist/ByAgeView';
import ByGroupView from '@hpapp/features/artist/ByGroupView';
import BySortView from '@hpapp/features/artist/BySortView';
import Text from '@hpapp/features/common/components/Text';
import { t } from '@hpapp/system/i18n';
import { useState } from 'react';
import { TouchableHighlight, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar, SceneRendererProps, NavigationState } from 'react-native-tab-view';

const renderScene = SceneMap({
  BySort: BySortView,
  ByGroup: ByGroupView,
  ByAge: ByAgeView
});

function ArtistTabBar(
  props: SceneRendererProps & {
    navigationState: NavigationState<{
      key: string;
      title: string;
    }>;
  }
) {
  const [primaryColor, contrastPrimaryColor] = useColor('primary');
  const [bgColor] = useColor('background');
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

export default function ArtistsTab() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'BySort', title: t('By Sort') },
    { key: 'ByGroup', title: t('By Group') },
    { key: 'ByAge', title: t('By Age') }
  ]);
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={ArtistTabBar}
    />
  );
}
