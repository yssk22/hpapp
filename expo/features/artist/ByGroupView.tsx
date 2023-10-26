import { useHelloProject } from '@hpapp/contexts/serviceroot';
import ArtistCard from '@hpapp/features/artist/ArtistCard';
import { FlatList } from 'react-native';

export default function ByGroupView() {
  const hp = useHelloProject();
  const artists = hp.useArtists(false);
  return (
    <FlatList
      data={artists}
      keyExtractor={(a) => a.id}
      renderItem={(item) => {
        return <ArtistCard artist={item.item} />;
      }}
    />
  );
}
