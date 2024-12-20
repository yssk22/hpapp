import { useThemeColor } from '@hpapp/features/app/theme';
import { FontSize } from '@hpapp/features/common/constants';
import React from 'react';
import { Text as Text_, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  text: {
    fontSize: FontSize.Medium
  },
  textBold: {
    fontSize: FontSize.Medium
  }
});

type TextProps = { bold?: boolean } & React.ComponentProps<typeof Text_>;

export default function Text({ children, bold = false, style, ...props }: TextProps) {
  const [, textColor] = useThemeColor('background');
  return (
    <Text_ {...props} style={[{ color: textColor }, bold ? styles.textBold : styles.text, style]}>
      {children}
    </Text_>
  );
}
