import { useThemeColor } from '@hpapp/features/app/theme';
import { Spacing } from '@hpapp/features/common/constants';
import { ThemeColorScheme } from '@hpapp/system/theme';
import React from 'react';
import { View, StyleSheet } from 'react-native';

type StyleProps = React.ComponentProps<typeof View>['style'];

export type CardProps = {
  colorScheme?: ThemeColorScheme;
  headerText?: string;
  subHeaderText?: string;
  containerStyle?: StyleProps;
  headerStyle?: StyleProps;
  header?: React.ReactElement;
  bodyStyle?: StyleProps;
  body?: React.ReactElement;
};

/**
 * Card is a component that displays a card with a header and body.
 */
export default function Card({
  colorScheme = 'primary',
  containerStyle,
  headerStyle,
  header,
  bodyStyle,
  body
}: CardProps) {
  const [color] = useThemeColor(colorScheme);
  const showHeader = header !== undefined;
  return (
    <View style={[styles.container, { borderColor: color }, containerStyle]}>
      {showHeader && <View style={[styles.header, { backgroundColor: color }, headerStyle]}>{header}</View>}
      <View style={[styles.body, bodyStyle]}>{body}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 3,
    borderWidth: 1,
    margin: Spacing.Small
  },
  header: {
    padding: Spacing.Small
  },
  body: {
    padding: Spacing.Small
  }
});
