import Feed from '@hpapp/features/feed/Feed';
import { useMe } from '@hpapp/features/root/protected/context';
import useLocalUserConfig from '@hpapp/features/settings/context/useLocalUserConfig';
import { View, StyleSheet } from 'react-native';

export default function HomeTabFeed() {
  const [config] = useLocalUserConfig();
  const followings = useMe()
    .followings.filter((f) => f.type !== 'unfollow')
    .map((f) => f.memberId);
  const numFetch = followings.length > 10 ? followings.length + 10 : 15;
  return (
    <View style={styles.container}>
      <Feed
        numFetch={numFetch}
        assetTypes={['ameblo', 'instagram', 'tiktok', 'twitter']}
        memberIds={followings}
        useMemberTaggings={config?.feedUseMemberTaggings ?? false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
