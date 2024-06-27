import { DefaultAppConfig } from '@hpapp/features/appconfig/useAppConfig';
import { mockNavigation, renderWithTestScreen } from '@hpapp/features/root';
import UPFCSettingsScreen from '@hpapp/features/upfc/components/UPFCSettingsScreen';
import UPFCHomeTab from '@hpapp/features/upfc/components/home/UPFCHomeTab';
import { act, fireEvent } from '@testing-library/react-native';

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('UPFCHomeTab', () => {
  test('render UPFCErrorBox if settings is not configured', async () => {
    const navigation = mockNavigation();
    const rendered = await renderWithTestScreen(<UPFCHomeTab />);
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

  jest.useFakeTimers();
  test('render list if settings is configured', async () => {
    const rendered = await renderWithTestScreen(<UPFCHomeTab />, {
      appConfig: {
        ...DefaultAppConfig,
        useUPFCDemoScraper: true
      },
      upfc: {
        username: '00000000',
        password: 'password'
      }
    });
    const loading = await rendered.findByTestId('UPFCCurentApplicationList.Skelton');
    expect(loading).toBeTruthy();
    await act(async () => {
      jest.advanceTimersByTime(1500);
    });
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
