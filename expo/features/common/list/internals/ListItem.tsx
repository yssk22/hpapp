import { Spacing } from '@hpapp/features/common/constants';
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

type StyleProps = React.ComponentProps<typeof View>['style'];

export type ListItemProps = {
  leftContent?: React.JSX.Element;
  rightContent?: React.JSX.Element;
  containerStyle?: StyleProps;
  children: React.ReactNode;
  onPress?: () => void;
};

/**
 * ListItem is a standard 1 ~ 3 column layout of an list item to display items with a left, center, and right content.
 */
export default function ListItem({
  leftContent,
  rightContent,
  onPress,
  children,
  containerStyle,
  ...rest
}: ListItemProps) {
  const content = (
    <View style={[styles.container, containerStyle]}>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: Spacing.Small,
    paddingRight: Spacing.Small,
    paddingTop: Spacing.Small,
    paddingBottom: Spacing.Small
  },
  left: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    minWidth: 0
  },
  center: {
    justifyContent: 'center',
    flexGrow: 1,
    flex: 1,
    minWidth: 0
  },
  right: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    minWidth: 0
  }
});
