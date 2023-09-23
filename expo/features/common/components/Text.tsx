import React from "react";
import { Text as Text_, StyleSheet } from "react-native";
import { useColor } from "@hpapp/contexts/settings/theme";
import { FontSize, Fonts } from "@hpapp/features/common/constants";

const styles = StyleSheet.create({
  text: {
    fontFamily: Fonts.Main,
    fontSize: FontSize.Medium,
  },
  textBold: {
    fontFamily: Fonts.Bold,
    fontSize: FontSize.Medium,
  },
});

type TextProps = { bold?: boolean } & React.ComponentProps<typeof Text_>;

export default function Text({
  children,
  bold = false,
  style,
  ...props
}: TextProps) {
  const [_, textColor] = useColor("background");
  return (
    <Text_
      {...props}
      style={[
        { color: textColor },
        bold ? styles.textBold : styles.text,
        style,
      ]}
    >
      {children}
    </Text_>
  );
}
