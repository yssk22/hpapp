import { Text } from '@hpapp/features/common';
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';

import ListItem from './ListItem';

const ListItemMeta: Meta<typeof ListItem> = {
  title: 'common/list/ListItem',
  component: ListItem,
  argTypes: {},
  args: {
    children: <Text>List Item Content</Text>
  },
  decorators: [
    (Story) => (
      <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
        <Story />
        <Story />
        <Story />
      </View>
    )
  ]
};

export default ListItemMeta;

export const Basic: StoryObj<typeof ListItem> = {};

export const WithLeft: StoryObj<typeof ListItem> = {
  args: {
    leftContent: <Text>Left Content</Text>
  }
};

export const WithRight: StoryObj<typeof ListItem> = {
  args: {
    rightContent: <Text>Right Content</Text>
  }
};

export const WithBoth: StoryObj<typeof ListItem> = {
  args: {
    leftContent: <Text>Left Content</Text>,
    rightContent: <Text>Right Content</Text>
  }
};

export const OnPress: StoryObj<typeof ListItem> = {
  args: {
    leftContent: <Text>Left Content</Text>,
    rightContent: <Text>Right Content</Text>,
    onPress: () => alert('Pressed')
  }
};
