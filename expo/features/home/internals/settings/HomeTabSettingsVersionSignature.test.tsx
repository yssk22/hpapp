import { renderUserComponent } from '@hpapp/features/app/testhelper';
import { composeStories } from '@storybook/react';

import * as stories from './HomeTabSettingsVersionSignature.stories';

describe('HomeTabSettingsVersionSignature', () => {
  const composed = composeStories(stories);
  Object.keys(composed).forEach((key) => {
    const C = (composed as any)[key];
    test(key, async () => {
      const content = await renderUserComponent(<C />);
      expect(content).toMatchSnapshot();
    });
  });
});
