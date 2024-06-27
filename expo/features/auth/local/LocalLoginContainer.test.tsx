import { User } from '@hpapp/features/auth';
import {
  useAuthAuthenticateMutation$data,
  useAuthAuthenticateMutation$variables
} from '@hpapp/features/auth/hooks/__generated__/useAuthAuthenticateMutation.graphql';
import * as useAuthModule from '@hpapp/features/auth/hooks/useAuth';
import LocalLoginContainer from '@hpapp/features/auth/local/LocalLoginContainer';
import { renderWithRoot } from '@hpapp/features/root';
import { screen, fireEvent, waitFor, act } from '@testing-library/react-native';

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
    const rendered = await renderWithRoot(<LocalLoginContainer onAuthenticated={onAuthenticated} />);
    const input = await rendered.findByTestId('inputToken');
    expect(input).toBeTruthy();
    const button = await rendered.findByTestId('btnLogin');
    expect(button).toBeTruthy();
    expect(button.props.accessibilityState.disabled).toBeTruthy();

    // put text
    await act(async () => {
      fireEvent.changeText(input, 'foo');
    });
    expect(button.props.accessibilityState.disabled).toBeFalsy();

    // press the button
    await act(async () => {
      fireEvent.press(button);
      expect(button.props.accessibilityState.disabled).toBeFalsy();
    });
    expect(button.props.accessibilityState.disabled).toBeFalsy();

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

  test('show error if authentication fails', async () => {
    const { authenticate, onAuthenticated } = mockUseAuth(
      {
        id: 'foo',
        username: 'bar',
        accessToken: 'xxxx'
      },
      false,
      new Error('FOO')
    );

    const rendered = await renderWithRoot(<LocalLoginContainer onAuthenticated={onAuthenticated} />);

    const input = await screen.findByTestId('inputToken');
    expect(input).toBeTruthy();
    const button = await screen.findByTestId('btnLogin');
    expect(button).toBeTruthy();
    await act(async () => {
      fireEvent.changeText(input, 'foo');
    });

    await act(async () => {
      fireEvent.press(button);
    });

    expect(authenticate).toHaveBeenCalledWith({
      input: {
        provider: 'localauth',
        accessToken: 'foo',
        refreshToken: ''
      }
    });
    const err = await rendered.findByTestId('errorMessage');
    expect(err).toBeTruthy();
  });
});
