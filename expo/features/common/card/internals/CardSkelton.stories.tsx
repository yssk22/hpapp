import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';

import CardSkelton from './CardSkelton';

const CardMeta: Meta<typeof CardSkelton> = {
  title: 'components/card/CardSkelton',
  component: CardSkelton,
  argTypes: {
    colorScheme: {
      options: ['primary', 'secondary'],
      control: {
        type: 'select'
      }
    }
  },
  args: {
    colorScheme: 'primary'
  },
  decorators: [
    (Story) => (
      <View style={{ justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    )
  ]
};

export default CardMeta;

export const Basic: StoryObj<typeof CardSkelton> = {};
