import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';

import HomeTabMenuVersionSignature from './HomeTabMenuVersionSignature';

const HomeTabMenuVersionSignatureMeta: Meta<typeof HomeTabMenuVersionSignature> = {
  title: 'home/internals/settings/HomeTabMenuVersionSignature',
  component: HomeTabMenuVersionSignature,
  argTypes: {},
  args: {},
  decorators: [
    (Story) => (
      <View style={{ justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    )
  ],
  tags: ['autodocs']
};

export default HomeTabMenuVersionSignatureMeta;

export const Basic: StoryObj<typeof HomeTabMenuVersionSignature> = {};
