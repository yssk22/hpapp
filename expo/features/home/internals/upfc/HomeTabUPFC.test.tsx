import { SettingsAppConfigDefault } from '@hpapp/features/app/settings';
import { mockUseNavigation, renderUserComponent } from '@hpapp/features/testhelper';
import UPFCSettingsScreen from '@hpapp/features/upfc/UPFCSettingsScreen';
import { act, fireEvent, waitFor } from '@testing-library/react-native';

import HomeTabUPFC from './HomeTabUPFC';
import HomeTabProvider from '../HomeTabProvider';
// import UPFCSettingsScreen from '@hpapp/features/upfc/UPFCSettingsScreen';

describe('HomeTabUPFC', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 9, 18));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('render UPFCErrorBox if settings is not configured', async () => {
    const navigation = mockUseNavigation();
    const rendered = await renderUserComponent(
      <HomeTabProvider>
        <HomeTabUPFC />
      </HomeTabProvider>
    );

    const errorBoxButton = await rendered.findByTestId('UPFCErrorBox.ConfigureButton');
    expect(rendered.toJSON()).toMatchSnapshot();
    expect(errorBoxButton).toBeTruthy();

    await act(async () => {
      fireEvent.press(errorBoxButton);
    });
    expect(navigation.push).toHaveBeenCalledWith(UPFCSettingsScreen);
  });

  test('render list if settings is configured', async () => {
    const rendered = await renderUserComponent(
      <HomeTabProvider>
        <HomeTabUPFC />
      </HomeTabProvider>,
      {
        appConfig: {
          ...SettingsAppConfigDefault,
          useUPFCDemoScraper: true
        },
        upfcConfig: {
          hpUsername: '00000000',
          hpPassword: 'password'
        }
      }
    );
    const loading = await rendered.findByTestId('HomeTabUPFCCurrentApplicationList.Skelton');
    expect(loading).toBeTruthy();
    await waitFor(() => rendered.getByTestId('HomeTabUPFCCurrentApplicationList.Flatlist'));
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
