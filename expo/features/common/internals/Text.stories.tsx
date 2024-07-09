import { FontSize } from '@hpapp/features/common/constants';
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';

import Text from './Text';

const TextMeta: Meta<typeof Text> = {
  title: 'components/Text',
  component: Text,
  argTypes: {},
  args: {},
  decorators: [
    (Story) => (
      <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
        <Text style={{ fontSize: FontSize.XXSmall }}>(FontSize.XXSmall)これはテキストです。</Text>
        <Text style={{ fontSize: FontSize.XSmall }}>(FontSize.XSmall)これはテキストです。</Text>
        <Text style={{ fontSize: FontSize.Small }}>(FontSize.Small)これはテキストです。</Text>
        <Text style={{ fontSize: FontSize.Medium }}>(FontSize.Medium)これはテキストです。</Text>
        <Text style={{ fontSize: FontSize.MediumLarge }}>(FontSize.MediamLarge)これはテキストです。</Text>
        <Text style={{ fontSize: FontSize.Large }}>(FontSize.Large)これはテキストです。</Text>
        <Text style={{ fontSize: FontSize.XLarge }}>(FontSize.XLarge)これはテキストです。</Text>
        <Text style={{ fontSize: FontSize.XXLarge }}>(FontSize.XXLarge)これはテキストです。</Text>
      </View>
    )
  ]
};

export default TextMeta;

export const Basic: StoryObj<typeof Text> = {};
