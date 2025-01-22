import { useArtist } from '@hpapp/features/app/user';
import { defineScreen, useNavigation } from '@hpapp/features/common/stack';
import { HPAssetType } from '@hpapp/features/feed';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import ArtistContextProvider from './internals/ArtistContext';
import ArtistHeader from './internals/ArtistHeader';
import ArtistMemberFlatList from './internals/ArtistMemberFlatList';

export type ArtistMemberScreenProps = {
  artistId: string;
};

export default defineScreen('/artist/', function ArtistScreen(props: ArtistMemberScreenProps) {
  const artist = useArtist(props.artistId);
  const [assetType, setAssetType] = useState<HPAssetType>('ameblo');

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      title: artist!.name
    });
  }, [artist!.id]);
  return (
    <View style={styles.container}>
      <ArtistContextProvider artistId={artist!.id} feedAssetType={assetType}>
        <>
          <ArtistMemberFlatList header={<ArtistHeader artist={artist!} />} onSelect={setAssetType} />
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
