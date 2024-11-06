import { useHelloProject } from '@hpapp/features/app/user';
import { defineScreen, useNavigation } from '@hpapp/features/common/stack';
import { HPAssetType } from '@hpapp/features/feed';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import ArtistMemberContextProvider from './internals/ArtistMemberContext';
import ArtistMemberFlatList from './internals/ArtistMemberFlatList';

export type ArtistMemberScreenProps = {
  memberId: string;
};

export default defineScreen('/arttist/member/', function ArtistMemberScreen(props: ArtistMemberScreenProps) {
  const hp = useHelloProject();
  const member = hp.useMember(props.memberId);
  const artist = hp.useArtist(member!.artistID!);
  const [assetType, setAssetType] = useState<HPAssetType>('ameblo');

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      title: `${member!.name} / ${artist!.name}`
    });
  }, [member!.id]);
  return (
    <View style={styles.container}>
      <ArtistMemberContextProvider member={member!} feedAssetType={assetType}>
        <>
          <ArtistMemberFlatList member={member!} onSelect={setAssetType} />
        </>
      </ArtistMemberContextProvider>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
