import { useThemeColor } from '@hpapp/features/app/theme';
import { Text } from '@hpapp/features/common';
import { FontSize, Spacing } from '@hpapp/features/common/constants';
import { ThemeColorScheme } from '@hpapp/system/theme';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import CardBody from './CardBody';

type StyleProps = React.ComponentProps<typeof View>['style'];

export type CardProps = {
  colorScheme?: ThemeColorScheme;
  headerText?: string;
  subHeaderText?: string;
  containerStyle?: StyleProps;
  headerStyle?: StyleProps;
  children: React.ReactElement<typeof CardBody>;
};

/**
 * Card is a component that displays a card with a header and body.
 */
export default function Card({
  colorScheme = 'primary',
  headerText,
  subHeaderText,
  containerStyle,
  headerStyle,
  children
}: CardProps) {
  const [color, contrast] = useThemeColor(colorScheme);
  const showHeader = headerText !== undefined || subHeaderText !== undefined;
  return (
    <View style={[styles.container, { borderColor: color }, containerStyle]}>
      {showHeader && (
        <View style={[styles.header, { backgroundColor: color }, headerStyle]}>
          {headerText && (
            <Text style={[{ color: contrast }, styles.headerText]} numberOfLines={1}>
              {headerText}
            </Text>
          )}
          {subHeaderText && (
            <Text style={[{ color: contrast }, styles.subHeaderText]} numberOfLines={1}>
              {subHeaderText}
            </Text>
          )}
        </View>
      )}
      <View>{children}</View>
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
  headerText: {
    fontSize: FontSize.Medium,
    fontWeight: 'bold'
  },
  subHeaderText: {
    fontSize: FontSize.Small
  }
});
