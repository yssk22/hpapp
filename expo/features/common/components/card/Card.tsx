import Text from '@hpapp/features/common/components/Text';
import { FontSize, Spacing } from '@hpapp/features/common/constants';
import { ColorScheme, useColor } from '@hpapp/features/settings/context/theme';
import React from 'react';
import { View, StyleSheet } from 'react-native';

type StyleProps = React.ComponentProps<typeof View>['style'];

export type CardProps = {
  colorScheme?: ColorScheme;
  headerText?: string;
  subHeaderText?: string;
  footerContent?: JSX.Element;
  containerStyle?: StyleProps;
  headerStyle?: StyleProps;
  children: React.ReactNode;
};

export default function Card({
  colorScheme = 'primary',
  headerText,
  subHeaderText,
  containerStyle,
  headerStyle,
  children
}: CardProps) {
  const [color, contrast] = useColor(colorScheme);
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
    borderWidth: 1
  },
  header: {
    padding: Spacing.Small
  },
  headerText: {
    fontSize: FontSize.Medium,
    fontWeight: 'bold'
  },
  subHeaderText: {
    fontSize: FontSize.XXSmall
  }
});
