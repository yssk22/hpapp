import { useHelloProject } from '@hpapp/features/app/user';
import { FlatList } from 'react-native';

import HomeTabArtistByGroupViewCard from './HomeTabArtistByGroupViewCard';

export default function HomeTabArtistByGroupView() {
  const hp = useHelloProject();
  const artists = hp.useArtists(false);
  return (
    <FlatList
      testID="HomeTabArtistByGroupView.FlatList"
      data={artists}
      keyExtractor={(a) => a.id}
      renderItem={(item) => {
        return <HomeTabArtistByGroupViewCard artist={item.item} />;
      }}
    />
  );
}
