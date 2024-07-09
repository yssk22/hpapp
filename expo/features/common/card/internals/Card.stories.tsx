import { Text } from '@hpapp/features/common';
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';

import Card from './Card';
import CardBody from './CardBody';

const CardMeta: Meta<typeof Card> = {
  title: 'components/card/Card',
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
    headerText: 'カードのヘッダーテキスト',
    colorScheme: 'primary',
    children: (
      <CardBody>
        <Text>これはカードの本文です。</Text>
      </CardBody>
    )
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
    subHeaderText: 'サブヘッダーテキスト'
  }
};
