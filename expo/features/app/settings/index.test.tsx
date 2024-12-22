import { act, fireEvent, render } from '@testing-library/react-native';
import { Button, Text } from 'react-native';

import {
  SettingsProvider,
  useCurrentUser,
  useCurrentUserUpdator,
  useUPFCConfigUpdator,
  useUPFCConfig,
  useUserConfig,
  useUserConfigUpdator
} from './';
import { SettingsAppConfigDefault } from './internals/SettingsAppConfig';
import { SettingsUserConfigDefault } from './internals/SettingsUserConfig';

describe('settings', () => {
  test('SettingsProvider', async () => {
    const content = await render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );
    await act(async () => {});

    expect(content.getByTestId('settings.test.userConfig').props.children).toBe('hpofficial');
    expect(content.getByTestId('settings.test.upfcConfig.hpUsername').props.children).toBe('empty');
    expect(content.getByTestId('settings.test.upfcConfig.mlUsername').props.children).toBe('empty');
    expect(content.getByTestId('settings.test.currentUser').props.children).toBe('empty');

    await act(async () => fireEvent(content.getByTestId('settings.test.userConfigUpdate'), 'press'));
    await act(async () => fireEvent(content.getByTestId('settings.test.upfcConfigUpdate'), 'press'));
    await act(async () => fireEvent(content.getByTestId('settings.test.currentUserUpdate'), 'press'));

    expect(content.getByTestId('settings.test.userConfig').props.children).toBe('hotpink');
    expect(content.getByTestId('settings.test.upfcConfig.hpUsername').props.children).toBe('risa');
    expect(content.getByTestId('settings.test.upfcConfig.mlUsername').props.children).toBe('mizuki');
    expect(content.getByTestId('settings.test.currentUser').props.children).toBe('risa');
  });

  test('SettingsProvider with overrides', async () => {
    const content = await render(
      <SettingsProvider
        appConfig={{
          ...SettingsAppConfigDefault
        }}
        userConfig={{
          ...SettingsUserConfigDefault,
          themeColorKeyPrimary: 'hotpink'
        }}
        upfcConfig={{
          hpUsername: 'risa',
          hpPassword: 'upfc-password'
        }}
        currentUser={{
          id: '1234',
          username: 'risa',
          accessToken: 'mytoken'
        }}
      >
        <TestComponent />
      </SettingsProvider>
    );
    await act(async () => {});

    expect(content.getByTestId('settings.test.userConfig').props.children).toBe('hotpink');
    expect(content.getByTestId('settings.test.upfcConfig.hpUsername').props.children).toBe('risa');
    expect(content.getByTestId('settings.test.upfcConfig.mlUsername').props.children).toBe('empty');
    expect(content.getByTestId('settings.test.currentUser').props.children).toBe('risa');
  });

  function TestComponent() {
    const userConfig = useUserConfig();
    const updateUserConfig = useUserConfigUpdator();
    const upfcConfig = useUPFCConfig();
    const updateUPFCConfig = useUPFCConfigUpdator();
    const currentUser = useCurrentUser();
    const updateCurrentUser = useCurrentUserUpdator();
    return (
      <>
        <Text testID="settings.test.userConfig">{userConfig!.themeColorKeyPrimary}</Text>
        <Button
          title="userConfigUpdate"
          testID="settings.test.userConfigUpdate"
          onPress={() => {
            updateUserConfig({
              ...userConfig!,
              themeColorKeyPrimary: 'hotpink'
            });
          }}
        />
        <Text testID="settings.test.upfcConfig.hpUsername">{upfcConfig?.hpUsername ?? 'empty'}</Text>
        <Text testID="settings.test.upfcConfig.mlUsername">{upfcConfig?.mlUsername ?? 'empty'}</Text>
        <Button
          title="upfcConfigUpdate"
          testID="settings.test.upfcConfigUpdate"
          onPress={() => {
            updateUPFCConfig({
              hpUsername: 'risa',
              hpPassword: 'hp-password',
              mlUsername: 'mizuki',
              mlPassword: 'ml-password'
            });
          }}
        />
        <Text testID="settings.test.currentUser">{currentUser?.username ?? 'empty'}</Text>
        <Button
          title="currentUserUpdate"
          testID="settings.test.currentUserUpdate"
          onPress={() => {
            updateCurrentUser({
              id: '1234',
              username: 'risa',
              accessToken: 'mytoken'
            });
          }}
        />
      </>
    );
  }
});
