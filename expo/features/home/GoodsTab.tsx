import { View, Text, StyleSheet } from "react-native";

export default function GoodsTab() {
  return (
    <View style={styles.container}>
      <Text>Shops</Text>
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
