import { UserServiceProvider } from '@hpapp/features/app/user';
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';

import HomeTabFeed from './HomeTabFeed';

const HomeTabFeedMeta: Meta<typeof HomeTabFeed> = {
  title: 'home/internals/feed/HomeTabFeed',
  component: HomeTabFeed,
  argTypes: {},
  args: {
    children: <HomeTabFeed />
  },
  decorators: [
    (Story) => (
      <UserServiceProvider>
        <View style={{ justifyContent: 'center', flex: 1 }}>
          <Story />
        </View>
      </UserServiceProvider>
    )
  ],
  tags: ['autodocs']
};

export default HomeTabFeedMeta;

export const Basic: StoryObj<typeof HomeTabFeed> = {};
