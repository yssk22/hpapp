import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';

import ExternalImage from './ExternalImage';

const ExternalImageMeta: Meta<typeof ExternalImage> = {
  title: 'common/image/ExternalImage',
  component: ExternalImage,
  argTypes: {
    resizeMethod: {
      options: ['auto', 'resize', 'scale'],
      control: {
        type: 'select'
      }
    },
    resizeMode: {
      options: ['cover', 'contain', 'stretch', 'repeat', 'center'],
      control: {
        type: 'select'
      }
    }
  },
  args: {
    uri: 'http://cdn.helloproject.com/img/rotation/ff25b71d00ea5ff0b44e18c31c0e1e3c4a7230c9.jpg',
    resizeMethod: 'resize',
    resizeMode: 'contain',
    width: 150,
    height: 150
  },
  decorators: [
    (Story) => (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1
        }}
      >
        <Story />
      </View>
    )
  ]
};

export default ExternalImageMeta;

export const Basic: StoryObj<typeof ExternalImage> = {};
