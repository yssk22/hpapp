import { SettingsAppConfigDefault } from '@hpapp/features/app/settings';
import { mockUseNavigation, renderUserComponent } from '@hpapp/features/testhelper';
import UPFCSettingsScreen from '@hpapp/features/upfc/UPFCSettingsScreen';
import { act, fireEvent } from '@testing-library/react-native';

import HomeTabUPFC from './HomeTabUPFC';
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
    const rendered = await renderUserComponent(<HomeTabUPFC />);
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });
    expect(rendered.toJSON()).toMatchSnapshot();
    const errorBoxButton = await rendered.findByTestId('UPFCErrorBox.ConfigureButton');
    expect(errorBoxButton).toBeTruthy();

    await act(async () => {
      fireEvent.press(errorBoxButton);
    });
    expect(navigation.push).toBeCalledWith(UPFCSettingsScreen);
  });

  test('render list if settings is configured', async () => {
    const rendered = await renderUserComponent(<HomeTabUPFC />, {
      appConfig: {
        ...SettingsAppConfigDefault,
        useUPFCDemoScraper: true
      },
      upfcConfig: {
        username: '00000000',
        password: 'password'
      }
    });
    const loading = await rendered.findByTestId('HomeTabUPFCCurrentApplicationList.Skelton');
    expect(loading).toBeTruthy();
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
