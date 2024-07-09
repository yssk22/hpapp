import { act, fireEvent, render } from '@testing-library/react-native';
import { Button, Text } from 'react-native';

import {
  SettingsProvider,
  useAppConfig,
  useAppConfigUpdator,
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

    expect(content.getByTestId('settings.test.appConfig').props.children).toBe('http://localhost:8080/graphql/v3');
    expect(content.getByTestId('settings.test.userConfig').props.children).toBe('hpofficial');
    expect(content.getByTestId('settings.test.upfcConfig').props.children).toBe('empty');
    expect(content.getByTestId('settings.test.currentUser').props.children).toBe('empty');

    await act(async () => fireEvent(content.getByTestId('settings.test.appConfigUpdate'), 'press'));
    await act(async () => fireEvent(content.getByTestId('settings.test.userConfigUpdate'), 'press'));
    await act(async () => fireEvent(content.getByTestId('settings.test.upfcConfigUpdate'), 'press'));
    await act(async () => fireEvent(content.getByTestId('settings.test.currentUserUpdate'), 'press'));

    expect(content.getByTestId('settings.test.appConfig').props.children).toBe('http://example.com');
    expect(content.getByTestId('settings.test.userConfig').props.children).toBe('hotpink');
    expect(content.getByTestId('settings.test.upfcConfig').props.children).toBe('risa');
    expect(content.getByTestId('settings.test.currentUser').props.children).toBe('risa');
  });

  test('SettingsProvider with overrides', async () => {
    const content = await render(
      <SettingsProvider
        appConfig={{
          ...SettingsAppConfigDefault,
          graphQLEndpoint: 'http://example.com'
        }}
        userConfig={{
          ...SettingsUserConfigDefault,
          themeColorKeyPrimary: 'hotpink'
        }}
        upfcConfig={{
          username: 'risa',
          password: 'upfc-password'
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

    expect(content.getByTestId('settings.test.appConfig').props.children).toBe('http://example.com');
    expect(content.getByTestId('settings.test.userConfig').props.children).toBe('hotpink');
    expect(content.getByTestId('settings.test.upfcConfig').props.children).toBe('risa');
    expect(content.getByTestId('settings.test.currentUser').props.children).toBe('risa');
  });

  function TestComponent() {
    const appConfig = useAppConfig();
    const updateAppConfig = useAppConfigUpdator();
    const userConfig = useUserConfig();
    const updateUserConfig = useUserConfigUpdator();
    const upfcConfig = useUPFCConfig();
    const updateUPFCConfig = useUPFCConfigUpdator();
    const currentUser = useCurrentUser();
    const updateCurrentUser = useCurrentUserUpdator();
    return (
      <>
        <Text testID="settings.test.appConfig">{appConfig!.graphQLEndpoint}</Text>
        <Button
          title="appConfigUpdate"
          testID="settings.test.appConfigUpdate"
          onPress={() => {
            updateAppConfig({
              ...appConfig!,
              graphQLEndpoint: 'http://example.com'
            });
          }}
        />
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
        <Text testID="settings.test.upfcConfig">{upfcConfig?.username ?? 'empty'}</Text>
        <Button
          title="upfcConfigUpdate"
          testID="settings.test.upfcConfigUpdate"
          onPress={() => {
            updateUPFCConfig({
              username: 'risa',
              password: 'upfc-password'
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
