import { HPMember, useHelloProject } from '@hpapp/features/app/user';
import { ArtistCard } from '@hpapp/features/artist';
import ArtistMemberScreen from '@hpapp/features/artist/ArtistMemberScreen';
import { useNavigation } from '@hpapp/features/common/stack';
import { FlatList } from 'react-native';

export default function HomeTabArtistByGroupView() {
  const navigation = useNavigation();
  const hp = useHelloProject();
  const artists = hp.useArtists(false);
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
            onMemberIconPress={(member: HPMember) => {
              navigation.push(ArtistMemberScreen, { memberId: member!.id });
            }}
          />
        );
      }}
    />
  );
}
