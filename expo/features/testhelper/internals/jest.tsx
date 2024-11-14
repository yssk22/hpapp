import { SettingsProviderProps, SettingsUserConfigDefault } from '@hpapp/features/app/settings';
import { renderThemeProvider } from '@hpapp/features/app/theme/testhelper';
import * as Stack from '@hpapp/features/common/stack';
import { screen, act, waitForElementToBeRemoved } from '@testing-library/react-native';
import { AppRoot } from 'features/app';
import React from 'react';
import { Text } from 'react-native';

const userConfig = {
  ...SettingsUserConfigDefault,
  completeOnboarding: true,
  consentOnToS: true,
  consentOnPrivacy: true,
  consentOnUPFCDataPolicy: true
};

export async function renderUserScreen(screen: Stack.Screen<Stack.ScreenParams>, props: SettingsProviderProps = {}) {
  const content = await renderThemeProvider(<AppRoot screens={[screen]} />, {
    currentUser: {
      id: '1',
      username: 'risa',
      accessToken: 'token'
    },
    userConfig,
    ...props
  });
  expect(content.getByTestId('UserRoot.Loading')).toBeTruthy();
  await waitForElementToBeRemoved(() => content.queryByTestId('UserRoot.Loading'));
  await act(() => {}); // Update Banner to be shown
  return content;
}

export async function waitForUserRootRerendered() {
  await waitForElementToBeRemoved(() => screen.queryByTestId('UserRoot.Loading'));
}

export async function renderUserComponent(component: React.ReactElement, props: SettingsProviderProps = {}) {
  const screen = Stack.defineScreen('/', function TestComponent() {
    return component;
  });
  return renderUserScreen(screen, props);
}

export async function renderGuestComponent(component: React.ReactElement, props: SettingsProviderProps = {}) {
  const screen = Stack.defineScreen('/', function TestComponent() {
    return <Text>DummyUserRoot</Text>;
  });
  const content = await renderThemeProvider(<AppRoot screens={[screen]} />, {
    userConfig,
    ...props,
    currentUser: undefined
  });
  expect(content.getByTestId('AppRootGuest')).toBeTruthy();
  await act(() => {}); // Update Banner to be shown
  return content;
}

export function mockUseNavigation() {
  const orig = Stack.useNavigation;
  const mocks = {
    navigate: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    canGoBack: jest.fn()
  };
  jest.spyOn(Stack, 'useNavigation').mockImplementation(() => {
    return {
      ...orig(),
      ...mocks
    };
  });
  return mocks;
}
