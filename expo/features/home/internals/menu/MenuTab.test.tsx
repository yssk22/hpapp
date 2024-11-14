// import UPFCSettingsScreen from '@hpapp/features/upfc/UPFCSettingsScreen';

import { renderUserComponent } from '@hpapp/features/testhelper';

import HomeTabMenu from './HomeTabMenu';

describe('SettingsTab', () => {
  test('render', async () => {
    const rendered = await renderUserComponent(<HomeTabMenu />);
    expect(rendered).toMatchSnapshot();
  });
});
