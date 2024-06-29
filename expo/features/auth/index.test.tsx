import { User, SettingsAppConfigDefault } from '@hpapp/features/app/settings';
import { renderGuestComponent, renderUserComponent } from '@hpapp/features/app/testhelper';
import FirebaseAuth from '@react-native-firebase/auth';
import { act, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react-native';
import { AccessTokenRequest, TokenResponse } from 'expo-auth-session';
import { Text } from 'react-native';

import AuthFirebaseLoginContainer from './internals/AuthFirebaseLoginContainer';
import AuthGateByRole from './internals/AuthGateByRole';
import AuthLocalLoginContainer from './internals/AuthLocalLoginContainer';
import {
  useAuthAuthenticateMutation$data,
  useAuthAuthenticateMutation$variables
} from './internals/__generated__/useAuthAuthenticateMutation.graphql';
import * as useAuth from './internals/useAuth';

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('auth', () => {
  const Admin = {
    id: '42949672973',
    username: 'admin',
    accessToken: 'token'
  };
  describe('AuthGateByRole', () => {
    function TestComponent() {
      return <Text testID="auth.test.gated">Gated Content</Text>;
    }
    test('allow admin', async () => {
      const content = await renderUserComponent(
        <AuthGateByRole allow="admin">
          <TestComponent />
        </AuthGateByRole>
      );
      expect(content.queryByTestId('auth.test.gated')).toBeNull();
      const allowed = await renderUserComponent(
        <AuthGateByRole allow="admin">
          <TestComponent />
        </AuthGateByRole>,
        {
          currentUser: Admin
        }
      );
      expect(allowed.queryByTestId('auth.test.gated')).not.toBeNull();
    });

    test('deny admin', async () => {
      const content = await renderUserComponent(
        <AuthGateByRole deny="admin">
          <TestComponent />
        </AuthGateByRole>
      );
      expect(content.queryByTestId('auth.test.gated')).not.toBeNull();
      const allowed = await renderUserComponent(
        <AuthGateByRole deny="admin">
          <TestComponent />
        </AuthGateByRole>,
        {
          currentUser: Admin
        }
      );
      expect(allowed.queryByTestId('auth.test.gated')).toBeNull();
    });
  });

  describe('AuthLocalLoginContainer', () => {
    test('authenticate', async () => {
      const { authenticate } = mockUseAuth(
        {
          id: '1234',
          username: 'bar',
          accessToken: 'xxxx'
        },
        false
      );
      const content = await renderGuestComponent(<AuthLocalLoginContainer />);
      expect(content.getByTestId('AuthLocalLoginContainer')).toBeTruthy();
      await act(async () => {
        fireEvent.changeText(content.getByTestId('AuthLocalLoginContainer.inputToken'), 'testtoken');
      });
      await act(async () => {
        fireEvent.press(content.getByTestId('AuthLocalLoginContainer.btnLogin'));
      });
      expect(authenticate).toHaveBeenCalled();
      // now currentUser is refresed, so UserRoot to be shown after loading the base context
      await waitFor(() => content.queryByTestId('UserRoot.Loading'));
      await waitForElementToBeRemoved(() => content.queryByTestId('UserRoot.Loading'));
    });
  });

  describe('AuthFirebaseLoginContainer', () => {
    test('authenticate', async () => {
      mockFirebase();
      const { authenticate } = mockUseAuth(
        {
          id: '1234',
          username: 'bar',
          accessToken: 'xxxx'
        },
        false
      );
      const content = await renderGuestComponent(<AuthFirebaseLoginContainer />, {
        appConfig: {
          ...SettingsAppConfigDefault,
          useLocalAuth: false
        }
      });
      expect(content.getByTestId('AuthFirebaseLoginContainer')).toBeTruthy();
      expect(content.getByTestId('AuthFirebaseLoginProviderButton.google')).toBeTruthy();
      await act(async () => {
        fireEvent.press(content.getByTestId('AuthFirebaseLoginProviderButton.google'));
      });
      expect(authenticate).toHaveBeenCalledWith({});
      // now currentUser is refresed, so UserRoot to be shown after loading the base context
      await waitFor(() => content.queryByTestId('UserRoot.Loading'));
      await waitForElementToBeRemoved(() => content.queryByTestId('UserRoot.Loading'));
      await waitFor(() => content.queryByTestId('DummyUserRoot'));
    });
  });
});

function mockUseAuth(user: User, isAuthenticating: boolean, err?: Error) {
  const authenticate = jest.fn((input: useAuthAuthenticateMutation$variables) => {
    if (err) {
      throw err;
    }
    return Promise.resolve({
      authenticate: user
    });
  });
  const useAuthMock = (): [
    (input: useAuthAuthenticateMutation$variables) => Promise<useAuthAuthenticateMutation$data>,
    boolean
  ] => {
    return [authenticate, isAuthenticating];
  };
  jest.spyOn(useAuth, 'default').mockImplementation(useAuthMock);
  return {
    authenticate
  };
}

function mockFirebase() {
  jest.spyOn(AccessTokenRequest.prototype, 'performAsync').mockImplementation(async (discovery) => {
    return new TokenResponse({
      accessToken: 'accessToken'
    });
  });

  jest.spyOn(FirebaseAuth.GoogleAuthProvider, 'credential').mockImplementation((idToken, accessToken) => {
    return {
      providerId: 'google',
      token: 'google-token',
      secret: 'google-secret'
    };
  });
}

jest.mock('expo-auth-session/providers/google', () => {
  return {
    useAuthRequest: jest.fn(() => {
      return [
        {
          clientId: '1234',
          redirectUri: 'http://localhost',
          scopes: ['email'],
          codeVerifier: 'testcodeverifier'
        },
        undefined,
        jest.fn(() => {
          return {
            type: 'success',
            params: {
              code: 'testcode'
            }
          };
        })
      ];
    })
  };
});
