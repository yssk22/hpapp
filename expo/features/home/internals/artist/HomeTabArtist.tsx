import { t } from '@hpapp/system/i18n';
import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

import ArtistHomeTabByAgeView from './HomeTabArtistByAgeView';
import ArtistHomeTabByGroupView from './HomeTabArtistByGroupView';
import ArtistHomeTabBySortView from './HomeTabArtistBySortView';
import HomeTabArtistInnnerTabBar from './HomeTabArtistInnnerTabBar';

const renderScene = SceneMap({
  BySort: ArtistHomeTabBySortView,
  ByGroup: ArtistHomeTabByGroupView,
  ByAge: ArtistHomeTabByAgeView
});

export default function HomeTabArtist() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'BySort', title: t('By Sort'), testID: 'ArtistHomeTab.BySort' },
    { key: 'ByGroup', title: t('By Group'), testID: 'ArtistHomeTab.ByGroup' },
    { key: 'ByAge', title: t('By Age'), testID: 'ArtistHomeTab.ByAge' }
  ]);
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={HomeTabArtistInnnerTabBar}
    />
  );
}
