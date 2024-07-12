import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';

import HomeTabSettingsVersionSignature from './HomeTabSettingsVersionSignature';

const HomeTabSettingsVersionSignatureMeta: Meta<typeof HomeTabSettingsVersionSignature> = {
  title: 'home/internals/settings/HomeTabSettingsVersionSignature',
  component: HomeTabSettingsVersionSignature,
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

export default HomeTabSettingsVersionSignatureMeta;

export const Basic: StoryObj<typeof HomeTabSettingsVersionSignature> = {};
