import { IconSize } from '@hpapp/features/common/constants';
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';

import AmebloIcon from './AmebloIcon';

const AmebloIconMeta: Meta<typeof AmebloIcon> = {
  title: 'common/AmebloIcon',
  component: AmebloIcon,
  argTypes: {},
  args: {
    size: IconSize.Small
  },
  decorators: [
    (Story) => (
      <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
        <Story />
      </View>
    )
  ]
};

export default AmebloIconMeta;

export const Basic: StoryObj<typeof AmebloIcon> = {};
