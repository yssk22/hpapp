import { renderUserComponent } from '@hpapp/features/testhelper';

import HomeTabArtist from './HomeTabArtist';

describe('HomeTabArtist', () => {
  beforeAll(() => {
    jest.useFakeTimers({
      doNotFake: [
        'nextTick',
        'setImmediate',
        'clearImmediate',
        'setInterval',
        'clearInterval',
        'setTimeout',
        'clearTimeout'
      ]
    });
    jest.setSystemTime(new Date(2024, 10, 18));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('tab', async () => {
    const content = await renderUserComponent(<HomeTabArtist />);
    const sortView = await content.findByTestId('HomeTabArtistBySortView.ScrollView');
    expect(sortView).toBeTruthy();

    // all tabs are actually rendered with accessibilityHidden={true|false} so
    // we can just dump the tabview into a snapshot to test the whole rendered contents.
    expect(content).toMatchSnapshot();
  });
});
