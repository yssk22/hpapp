import React, { ComponentProps } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Image } from "react-native";
// import { ColorScheme, useColor } from "src/models/theme/rneui";

type ImageProps = Omit<ComponentProps<typeof Image>, "source"> & {
  //   colorScheme?: ColorScheme;
  circle?: boolean;
};

export default function ImageLoading({
  //   colorScheme = "primary",
  circle = false,
  style,
  ...rest
}: ImageProps) {
  //   const [assets] = useAssets([
  //     require("beta/icon.png"),
  //     require("prod/icon.png"),
  //   ]);
  //   const [color, contrast] = useColor(colorScheme);
  //   if (assets === undefined) {
  //     return null;
  //   }
  //   const icon = IsBeta ? assets![0] : assets![1];
  //   const source = {
  //     uri: icon.localUri!,
  //     height: icon.height!,
  //     width: icon.width!,
  //   };
  return (
    <View style={[style, styles.spinner]}>
      <ActivityIndicator color={"#ff0000"} />
    </View>
  );
}

const styles = StyleSheet.create({
  spinner: {
    position: "absolute",
    alignContent: "center",
    justifyContent: "center",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
