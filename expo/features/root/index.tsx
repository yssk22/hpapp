import RootContainer, { RootContainerProps } from '@hpapp/features/root/internals/RootContainer';
import * as Stack from '@hpapp/features/root/internals/protected/stack';
import { act, render, waitFor } from '@testing-library/react-native';

/**
 * help rendering the component tree with the necessary context for feature components to work.
 * @param options options to configure the initial values of configurations
 * @param children the component to test
 * @returns the rendered component
 */
export async function renderWithRoot(children: React.ReactElement, options?: RootContainerProps) {
  const rendered = render(<RootContainer {...options}>{children}</RootContainer>);
  await act(async () => {}); // TODO: remove this line when we have a better solution for the async rendering

  // make sure RootContainer is properly rendered before start testing the main component
  await waitFor(async () => {
    expect(rendered.getByTestId('RootContainer')).toBeTruthy();
  });
  return rendered;
}

/**
 * help rendering the component tree with the necessary context for feature components to work.
 * if your comopnent rely on the navigation context, use this function instead of renderWithRoot.
 * @param options options to configure the initial values of configurations
 * @param children the component to test
 * @returns the rendered component
 */
export async function renderWithTestScreen(children: React.ReactElement, options?: RootContainerProps) {
  const S = Stack.createStackNavigator();
  const TestScreen = Stack.defineScreen('/__test__/', function HomeScreen() {
    return children;
  });

  return await renderWithRoot(<S screens={[TestScreen]} initialRouteName="/__test__/" />, options);
}
export function mockNavigation() {
  const mock = {
    navigate: jest.fn(),
    push: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
    replace: jest.fn()
  };
  const useNavigationOrig = Stack.useNavigation;
  jest.spyOn(Stack, 'useNavigation').mockImplementation(() => {
    const original = useNavigationOrig();
    return {
      ...original,
      ...mock
    };
  });
  return mock;
}
