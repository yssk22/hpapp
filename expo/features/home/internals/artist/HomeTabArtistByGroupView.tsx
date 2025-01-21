import { HPArtist, HPMember, useArtistList } from '@hpapp/features/app/user';
import { ArtistCard } from '@hpapp/features/artist';
import ArtistMemberScreen from '@hpapp/features/artist/ArtistMemberScreen';
import ArtistScreen from '@hpapp/features/artist/ArtistScreen';
import { useNavigation } from '@hpapp/features/common/stack';
import { FlatList } from 'react-native';

export default function HomeTabArtistByGroupView() {
  const navigation = useNavigation();
  const artists = useArtistList(false);
  return (
    <FlatList
      testID="HomeTabArtistByGroupView.FlatList"
      data={artists}
      keyExtractor={(a) => a.id}
      renderItem={(item) => {
        return (
          <ArtistCard
            artist={item.item}
            memberIconShowFollow
            onArtistIconPress={(artist: HPArtist) => {
              navigation.push(ArtistScreen, { artistId: artist.id });
            }}
            onMemberIconPress={(member: HPMember) => {
              navigation.push(ArtistMemberScreen, { memberId: member!.id });
            }}
          />
        );
      }}
    />
  );
}
