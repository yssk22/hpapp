import FeedItemScreen from "@hpapp/features/feed/FeedItemScreen";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";
import { useNavigation } from "@hpapp/features/root/protected/stack";
import HomeTabFeed from "@hpapp/features/home/HomeTabFeed";

export default function HomeTab() {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1 }}>
      <HomeTabFeed />
    </View>
  );
}
