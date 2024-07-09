import { renderUserComponent } from '@hpapp/features/app/testhelper';
import {} from '@hpapp/foundation/globals';
import { composeStories } from '@storybook/react';
import { waitFor } from '@testing-library/react-native';

import * as stories from './ExternalImage.stories';

jest.mock('@hpapp/system/uricache', () => {
  const Orig = jest.requireActual('@hpapp/system/uricache');
  return {
    ...Orig,
    getOrCreateCacheURI: jest.fn(async (uri) => {
      return uri;
    })
  };
});

describe('ExternalImage', () => {
  const composed = composeStories(stories);
  Object.keys(composed).forEach((key) => {
    const C = (composed as any)[key];
    test(key, async () => {
      const content = await renderUserComponent(<C />);
      await waitFor(async () => await content.queryByTestId('ExternalImage.Image'));
      expect(content).toMatchSnapshot();
    });
  });
});
