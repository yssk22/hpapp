import { useColor } from "@hpapp/contexts/settings/theme";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RootWrapper({
  children,
}: {
  children: React.ReactElement;
}) {
  const [background] = useColor("background");
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: background,
      }}
    >
      {children}
    </View>
  );
}
