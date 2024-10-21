import { ThemeProvider } from '../features/app/theme';
import AppRelayProvider from '../features/app/internals/AppRelayProvider';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import type { Preview } from '@storybook/react';
import React from 'react';
import { Dimensions, View } from 'react-native';

function Root(Story, context) {
  const dimensions = Dimensions.get('window');
  return (
    <View style={{ height: dimensions.height, width: dimensions.width, overflow: 'hidden' }}>
      <ThemeProvider>
        <AppRelayProvider>
          <Story {...context} />
        </AppRelayProvider>
      </ThemeProvider>
    </View>
  );
}

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    },
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphonex'
    }
  },
  decorators: [Root]
};

export default preview;
