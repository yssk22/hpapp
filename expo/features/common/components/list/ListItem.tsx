import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

type StyleProps = React.ComponentProps<typeof View>["style"];

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  left: {
    justifyContent: "center",
    alignItems: "flex-start",
    minWidth: 0,
  },
  center: {
    flexGrow: 1,
    flex: 1,
    minWidth: 0,
  },
  right: {
    justifyContent: "center",
    alignItems: "flex-end",
    minWidth: 0,
  },
});

export type ListItemProps = {
  leftContent?: JSX.Element;
  rightContent?: JSX.Element;
  containerStyle?: StyleProps;
  children: React.ReactNode;
  onPress?: () => void;
};

export default function ListItem({
  leftContent,
  rightContent,
  onPress,
  children,
  containerStyle,
  ...rest
}: ListItemProps) {
  const content = (
    <View style={[containerStyle, styles.container]}>
      {leftContent && <View style={styles.left}>{leftContent}</View>}
      <View style={styles.center}>{children}</View>
      {rightContent && <View style={styles.right}>{rightContent}</View>}
    </View>
  );
  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>;
  }
  return content;
}
