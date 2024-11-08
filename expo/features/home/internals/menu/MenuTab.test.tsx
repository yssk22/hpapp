// import UPFCSettingsScreen from '@hpapp/features/upfc/UPFCSettingsScreen';

import { renderUserComponent } from '@hpapp/features/testhelper';

import HomeTabSettings from './HomeTabMenu';

describe('SettingsTab', () => {
  test('render', async () => {
    const rendered = await renderUserComponent(<HomeTabSettings />);
    expect(rendered).toMatchSnapshot();
  });
});
