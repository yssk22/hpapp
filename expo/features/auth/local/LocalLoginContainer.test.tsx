import { User } from '@hpapp/features/auth';
import {
  useAuthAuthenticateMutation$data,
  useAuthAuthenticateMutation$variables
} from '@hpapp/features/auth/hooks/__generated__/useAuthAuthenticateMutation.graphql';
import * as useAuthModule from '@hpapp/features/auth/hooks/useAuth';
import LocalLoginContainer from '@hpapp/features/auth/local/LocalLoginContainer';
import TestRoot from '@hpapp/features/root/TestRoot';
import { ButtonProps } from '@rneui/base';
import * as rneuiButton from '@rneui/themed/dist/Button';
import { screen, render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { PropsWithChildren } from 'react';

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
  jest.spyOn(useAuthModule, 'default').mockImplementation(useAuthMock);
  const onAuthenticated = jest.fn();
  return {
    authenticate,
    onAuthenticated
  };
}

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('LocalLoginContainer', () => {
  test('hitting the button triggers authentication and then call onAuthenticated callback with authenticated user', async () => {
    const { authenticate, onAuthenticated } = mockUseAuth(
      {
        id: 'foo',
        username: 'bar',
        accessToken: 'xxxx'
      },
      false
    );
    render(
      <TestRoot>
        <LocalLoginContainer onAuthenticated={onAuthenticated} />
      </TestRoot>
    );
    await act(async () => {
      const input = await screen.findByTestId('inputToken');
      expect(input).toBeTruthy();
      const button = await screen.findByTestId('btnLogin');
      expect(button);
      fireEvent.changeText(input, 'foo');

      fireEvent.press(button);
      expect(authenticate).toHaveBeenCalledWith({
        input: {
          provider: 'localauth',
          accessToken: 'foo',
          refreshToken: ''
        }
      });
      await waitFor(() =>
        expect(onAuthenticated).toHaveBeenCalledWith({
          id: 'foo',
          username: 'bar',
          accessToken: 'xxxx'
        })
      );
    });
  });

  describe('ErrorMessage', () => {
    test('is shown if authentication fails', async () => {
      const { authenticate, onAuthenticated } = mockUseAuth(
        {
          id: 'foo',
          username: 'bar',
          accessToken: 'xxxx'
        },
        false,
        new Error('FOO')
      );

      const rendered = render(
        <TestRoot>
          <LocalLoginContainer onAuthenticated={onAuthenticated} />
        </TestRoot>
      );
      await act(async () => {
        const input = await screen.findByTestId('inputToken');
        expect(input).toBeTruthy();
        const button = await screen.findByTestId('btnLogin');
        expect(button).toBeTruthy();
        fireEvent.changeText(input, 'foo');
        fireEvent.press(button);
        expect(authenticate).toHaveBeenCalledWith({
          input: {
            provider: 'localauth',
            accessToken: 'foo',
            refreshToken: ''
          }
        });
        await waitFor(async () => {
          const err = await rendered.findByTestId('errorMessage');
          expect(err).toBeTruthy();
        });
      });
    });
  });

  describe('Button', () => {
    it('is disabled when input is empty', async () => {
      const mockButton = jest.spyOn(rneuiButton, 'default').mockImplementation(() => {
        return <></>;
      });

      const { onAuthenticated } = mockUseAuth(
        {
          id: 'foo',
          username: 'bar',
          accessToken: 'xxxx'
        },
        false
      );
      render(
        <TestRoot>
          <LocalLoginContainer onAuthenticated={onAuthenticated} />
        </TestRoot>
      );
      await act(async () => {
        const input = await screen.findByTestId('inputToken');
        expect(input).toBeTruthy();
        expect(mockButton).toHaveBeenCalled();
        expect((mockButton.mock.calls[0][0] as PropsWithChildren<ButtonProps>).disabled).toBeTruthy();

        fireEvent.changeText(input, 'foo');
        expect((mockButton.mock.calls[1][0] as PropsWithChildren<ButtonProps>).disabled).toBeFalsy();
      });
    });

    it('is always disabled during authenticating', async () => {
      const mockButton = jest.spyOn(rneuiButton, 'default').mockImplementation(() => {
        return <></>;
      });

      const { onAuthenticated } = mockUseAuth(
        {
          id: 'foo',
          username: 'bar',
          accessToken: 'xxxx'
        },
        true
      );
      render(
        <TestRoot>
          <LocalLoginContainer onAuthenticated={onAuthenticated} />
        </TestRoot>
      );
      await act(async () => {
        const input = await screen.findByTestId('inputToken');
        expect(input).toBeTruthy();
        expect(mockButton).toHaveBeenCalled();
        expect((mockButton.mock.calls[0][0] as PropsWithChildren<ButtonProps>).disabled).toBeTruthy();

        fireEvent.changeText(input, 'foo');
        expect((mockButton.mock.calls[1][0] as PropsWithChildren<ButtonProps>).disabled).toBeTruthy();
      });
    });
  });
});
