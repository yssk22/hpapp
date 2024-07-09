import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';

import CalendarDateIcon from './CalendarDateIcon';

const CalendarDateIconMeta: Meta<typeof CalendarDateIcon> = {
  title: 'common/CalendarDateIcon',
  component: CalendarDateIcon,
  argTypes: {
    date: {
      control: {
        type: 'date'
      }
    }
  },
  args: {
    date: new Date('2025/10/18')
  },
  decorators: [
    (Story) => (
      <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
        <Story />
      </View>
    )
  ]
};

export default CalendarDateIconMeta;

export const Basic: StoryObj<typeof CalendarDateIcon> = {};

export const InvalidDate: StoryObj<typeof CalendarDateIcon> = {
  args: {
    date: new Date('invalid date')
  }
};
