import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';

import ExternalImage from './ExternalImage';

const CardMeta: Meta<typeof ExternalImage> = {
  title: 'components/image/ExternalImage',
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
    resizeMode: 'contain'
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
        <View
          style={{
            borderColor: '#ffff00',
            borderWidth: 2,
            width: 150,
            height: 150
          }}
        >
          <Story />
        </View>
      </View>
    )
  ]
};

export default CardMeta;

export const Basic: StoryObj<typeof ExternalImage> = {};
