import { IconSize } from '@hpapp/features/common/constants';
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';

import AssetIcon from './AssetIcon';

const AssetIconMeta: Meta<typeof AssetIcon> = {
  title: 'common/AssetIcon',
  component: AssetIcon,
  argTypes: {
    type: {
      options: ['ameblo', 'elineupmall', 'instagram', 'twitter', 'youtube'],
      control: {
        type: 'select'
      }
    },
    size: {
      options: [IconSize.Small, IconSize.Medium, IconSize.Large],
      control: {
        type: 'select'
      }
    }
  },
  args: {
    size: IconSize.Small,
    type: 'ameblo'
  },
  decorators: [
    (Story) => (
      <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
        <Story />
      </View>
    )
  ]
};

export default AssetIconMeta;

export const Basic: StoryObj<typeof AssetIcon> = {};
