import { Text } from '@hpapp/features/common';
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';

import Card from './Card';

const CardMeta: Meta<typeof Card> = {
  title: 'common/card/Card',
  component: Card,
  argTypes: {
    colorScheme: {
      options: ['primary', 'secondary'],
      control: {
        type: 'select'
      }
    }
  },
  args: {
    headerText: 'Card Header Text',
    colorScheme: 'primary',
    body: <Text>CardBody component to show the content on the card body</Text>
  },
  decorators: [
    (Story) => (
      <View style={{ justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    )
  ],
  tags: ['autodocs']
};

export default CardMeta;

export const Basic: StoryObj<typeof Card> = {};

export const SubHeader: StoryObj<typeof Card> = {
  args: {
    subHeaderText: 'subheader text can be added in the header container'
  }
};
