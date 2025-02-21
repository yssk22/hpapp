import { defineScreen } from '@hpapp/features/common/stack';
import { renderUserComponent, renderUserScreen } from '@hpapp/features/testhelper';
import { sleep } from '@hpapp/foundation/globals';
import { act, fireEvent, render, waitFor, waitForElementToBeRemoved } from '@testing-library/react-native';
import * as Updates from 'expo-updates';
import { Text } from 'react-native';

import { App } from './';
import AppConfigModal from './internals/AppConfigModal';
import { SettingsUserConfigDefault } from './settings';
import { clearSettings } from './settings/testhelper';

const userConfig = {
  ...SettingsUserConfigDefault,
  completeOnboarding: true,
  consentOnToS: true,
  consentOnPrivacy: true,
  consentOnUPFCDataPolicy: true
};

beforeEach(async () => {
  await clearSettings();
});

describe('app', () => {
  const TestScreen = defineScreen('/', function TestScreen() {
    return <Text testID="app.test">Hello, Guest!</Text>;
  });

  describe('AppConfigModal', () => {
    test('render and close', async () => {
      const onClose = jest.fn();
      const content = await renderUserComponent(<AppConfigModal isVisible onClose={onClose} />);
      await act(() => {});
      expect(content.getByTestId('AppConfigModal.content')).toBeTruthy();
      await act(async () => {
        fireEvent.press(content.getByTestId('AppConfigModal.btnClose'));
      });
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('AppUpdateBanner', () => {
    test('show banner', async () => {
      const fetchUpdateAsync = jest.fn();
      const reloadAsync = jest.fn();
      jest.spyOn(Updates, 'fetchUpdateAsync').mockImplementation(fetchUpdateAsync);
      jest.spyOn(Updates, 'reloadAsync').mockImplementation(reloadAsync);
      jest.spyOn(Updates, 'checkForUpdateAsync').mockImplementation(async () => {
        return {
          isAvailable: true,
          manifest: {
            id: 'test',
            commitTime: 100,
            assets: []
          },
          isRollBackToEmbedded: false,
          reason: undefined
        };
      });

      const content = await renderUserScreen(TestScreen);
      expect(content).toMatchSnapshot();
      const banner = await content.getByTestId('AppUpdateBanner');
      expect(banner).toBeTruthy();

      // hit the banner to trigger updates
      await act(async () => {
        fireEvent(banner, 'press');
      });
      expect(fetchUpdateAsync).toHaveBeenCalled();
      expect(reloadAsync).toHaveBeenCalled();

      // reloadAsync will reload the app so do not need to validate the end result of the banner

      // wait to surpress Animated(View) warning
      await waitFor(async () => {
        await sleep(500);
      });
    });
  });

  describe('AppRoot', () => {
    test('user', async () => {
      const content = await render(
        <App
          screens={[TestScreen]}
          currentUser={{
            id: '1',
            username: 'risa',
            accessToken: 'token'
          }}
          userConfig={userConfig}
        />
      );
      await act(() => {});
      expect(content.getByTestId('UserRoot.Loading')).toBeTruthy();
      await waitForElementToBeRemoved(() => content.queryByTestId('UserRoot.Loading'));
      expect(content.getByTestId('app.test')).toBeTruthy();
      expect(content.queryByTestId('AppRootGuest')).toBeNull();
    });

    test('guest', async () => {
      const content = await render(<App screens={[TestScreen]} userConfig={userConfig} />);
      await act(() => {});
      expect(content.queryByTestId('UserRoot.Loading')).toBeNull();
      expect(content.getByTestId('AppRootGuest')).toBeTruthy();
    });
  });
});
