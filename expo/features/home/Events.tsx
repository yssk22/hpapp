import { View, Text, StyleSheet } from "react-native";

export default function EventsTab() {
  return (
    <View style={styles.container}>
      <Text>Events</Text>
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
