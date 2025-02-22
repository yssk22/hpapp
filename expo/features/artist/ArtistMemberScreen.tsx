import { useArtist, useMember } from '@hpapp/features/app/user';
import { defineScreen, useNavigation } from '@hpapp/features/common/stack';
import { HPAssetType } from '@hpapp/features/feed';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import ArtistContextProvider from './internals/ArtistContext';
import ArtistMemberFlatList from './internals/ArtistMemberFlatList';
import ArtistMemberHeader from './internals/ArtistMemberHeader';

export type ArtistMemberScreenProps = {
  memberId: string;
};

export default defineScreen('/artist/member/', function ArtistMemberScreen(props: ArtistMemberScreenProps) {
  const member = useMember(props.memberId);
  const artist = useArtist(member!.artistID!);
  const [assetType, setAssetType] = useState<HPAssetType>('ameblo');

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      title: `${member!.name} / ${artist!.name}`
    });
  }, [member!.id]);
  return (
    <View style={styles.container}>
      <ArtistContextProvider memberId={member!.id} feedAssetType={assetType}>
        <>
          <ArtistMemberFlatList header={<ArtistMemberHeader member={member!} />} onSelect={setAssetType} />
        </>
      </ArtistContextProvider>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
