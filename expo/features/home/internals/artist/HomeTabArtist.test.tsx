import { renderUserComponent } from '@hpapp/features/app/testhelper';

import HomeTabArtist from './HomeTabArtist';

describe('HomeTabArtist', () => {
  test('tab', async () => {
    const content = await renderUserComponent(<HomeTabArtist />);
    const sortView = await content.findByTestId('HomeTabArtistBySortView.ScrollView');
    expect(sortView).toBeTruthy();

    // all tabs are actually rendered with accessibilityHidden={true|false} so
    // we can just dump the tabview into a snapshot to test the whole rendered contents.
    expect(content).toMatchSnapshot();
  });
});
