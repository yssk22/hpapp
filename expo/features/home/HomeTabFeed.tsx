import { View, Text, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";
import { useNavigation } from "@hpapp/features/root/protected/stack";
import { useMe } from "@hpapp/contexts/serviceroot";
import useLocalUserConfig from "@hpapp/contexts/settings/useLocalUserConfig";
import Feed from "@hpapp/features/feed/Feed";

export default function HomeTabFeed() {
  const navigation = useNavigation();
  const [config, _] = useLocalUserConfig();
  const followings = useMe()
    .followings.filter((f) => f.type != "unfollow")
    .map((f) => f.memberId);
  return (
    <View style={styles.container}>
      <Feed
        numFetch={20}
        assetTypes={["ameblo", "instagram", "tiktok", "twitter"]}
        memberIds={followings}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
