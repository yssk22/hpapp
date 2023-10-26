import Text from '@hpapp/features/common/components/Text';
import { IconSize, Spacing } from '@hpapp/features/common/constants';
import { Screen, ScreenParams, useNavigation } from '@hpapp/features/root/protected/stack';
import { ListItem } from '@rneui/base';
import { Icon } from '@rneui/themed';
import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';

type ListItemProps = React.ComponentProps<typeof ListItem>;

export default function NavigationListItem<P extends ScreenParams>({
  leftContent,
  screen,
  params,
  replace,
  containerStyle,
  children,
  ...rest
}: {
  leftContent?: React.ReactElement;
  screen: Screen<P>;
  params?: P;
  replace?: boolean;
  children: React.ReactElement | string;
} & ListItemProps) {
  const navigation = useNavigation();
  const handleOnPress = useCallback(() => {
    if (replace) {
      return navigation.replace(screen, params);
    }
    return navigation.push(screen, params);
  }, [screen, params, replace]);
  return (
    <ListItem onPress={handleOnPress} containerStyle={[styles.containerStyle, containerStyle]} {...rest}>
      {leftContent}
      <ListItem.Content>{typeof children === 'string' ? <Text>{children}</Text> : children}</ListItem.Content>
      <View style={styles.rightContent}>
        <Icon name="navigate-next" size={IconSize.Small} />
      </View>
    </ListItem>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    padding: Spacing.Small
  },
  rightContent: {
    justifyContent: 'center',
    alignItems: 'flex-end'
  }
});
