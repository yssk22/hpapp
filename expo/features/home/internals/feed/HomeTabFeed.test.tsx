import { renderUserComponent } from '@hpapp/features/app/testhelper';
import { composeStories } from '@storybook/react';
import { waitFor } from '@testing-library/react-native';

import * as stories from './HomeTabFeed.stories';

describe('HomeTabFeed', () => {
  const composed = composeStories(stories);
  Object.keys(composed).forEach((key) => {
    const C = (composed as any)[key];
    test(key, async () => {
      const content = await renderUserComponent(<C />);
      await waitFor(() => content.queryByTestId('HomeTabFeedSectionList.SectionList'));
      expect(content).toMatchSnapshot();
    });
  });
});
