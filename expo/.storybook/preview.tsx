import { ThemeProvider } from '../features/app/theme';
import AppRelayProvider from '../features/app/internals/AppRelayProvider';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import type { Preview } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';

function Root(Story, context) {
  return (
    <ThemeProvider>
      <AppRelayProvider>
        <View>
          <Story {...context} />
        </View>
      </AppRelayProvider>
    </ThemeProvider>
  );
}

const preview: Preview = {
  parameters: {
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
