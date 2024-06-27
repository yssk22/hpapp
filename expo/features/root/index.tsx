import RootContainer, { RootContainerProps } from '@hpapp/features/root/internals/RootContainer';
import { createStackNavigator, defineScreen } from '@hpapp/features/root/internals/protected/stack';
import { act, render } from '@testing-library/react-native';

/**
 * help rendering the component tree with the necessary context for feature components to work.
 * @param options options to configure the initial values of configurations
 * @param children the component to test
 * @returns the rendered component
 */
export async function renderWithRoot(children: React.ReactElement, options?: RootContainerProps) {
  const rendered = render(<RootContainer {...options}>{children}</RootContainer>);
  await act(async () => {});
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
  const Stack = createStackNavigator();
  const TestScreen = defineScreen('/__test__/', function HomeScreen() {
    return children;
  });

  return await renderWithRoot(<Stack screens={[TestScreen]} initialRouteName="/__test__/" />, options);
}
