// import UPFCSettingsScreen from '@hpapp/features/upfc/UPFCSettingsScreen';

import { renderUserComponent } from '@hpapp/features/testhelper';

import HomeTabSettings from './HomeTabSettings';

describe('SettingsTab', () => {
  test('render', async () => {
    const rendered = await renderUserComponent(<HomeTabSettings />);
    expect(rendered).toMatchSnapshot();
  });
});
