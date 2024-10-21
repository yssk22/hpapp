import { renderUserScreen } from '@hpapp/features/testhelper';
import { sleep } from '@hpapp/foundation/globals';
import { act, waitFor } from '@testing-library/react-native';

import HomeScreen from './HomeScreen';

describe('home', () => {
  test('HomeScreen', async () => {
    const content = await renderUserScreen(HomeScreen);
    await waitFor(async () => content.queryByTestId('HomeTabFeedSectionList'));
    await act(async () => {
      await sleep(500); // Wait for the tabs to be rendered
    });
    expect(content).toMatchSnapshot();
  });
});
