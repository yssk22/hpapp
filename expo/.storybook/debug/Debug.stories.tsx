import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { View, Text } from 'react-native';
import { useTheme, Button } from '@rneui/themed';

const CardMeta: Meta<typeof Text> = {
  title: 'components/card/Button',
  component: Text,
  argTypes: {},
  args: {
    children: 'Hello World'
  },
  decorators: [
    (Story) => {
      const a = useTheme();
      console.log(a);
      return (
        <View style={{ justifyContent: 'center', flex: 1 }}>
          <Button title="Press me" />
          <Story />
        </View>
      );
    }
  ],
  tags: ['autodocs']
};

export default CardMeta;

export const Basic: StoryObj<typeof Text> = {};
