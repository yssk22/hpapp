import FeedItemScreen from "@hpapp/features/feed/FeedItemScreen";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";
import { useNavigation } from "@hpapp/features/root/protected/stack";
import MembersTab from "@hpapp/features/home/MembersTab";

export default function HomeTab() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Button onPress={() => {}}>Feed</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
