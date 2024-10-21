import { ScreenDecorator } from '@hpapp/features/testhelper';
import type { Meta, StoryObj } from '@storybook/react';

import FeedItemScreen from './FeedItemScreen';

const FeedItemScreenComponent = FeedItemScreen.component;

const FeedIteMScreenMeta: Meta<typeof FeedItemScreenComponent> = {
  title: 'feed/FeedItemScreen',
  component: FeedItemScreen.component,
  argTypes: {},
  args: {
    feedId: '94489456035'
  },
  decorators: [ScreenDecorator]
};

export default FeedIteMScreenMeta;

export const Basic: StoryObj<typeof FeedItemScreenComponent> = {};
