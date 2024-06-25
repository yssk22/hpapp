import TestRoot from '@hpapp/features/root/TestRoot';
import { AppThemeProvider } from '@hpapp/features/settings/context/theme';
import { screen, render, fireEvent } from '@testing-library/react-native';
import { View, Text, Button } from 'react-native';

import { createStackNavigator, useNavigation, defineScreen } from './index';

test('stack', async () => {
  function Root({ children }: { children: React.ReactElement }) {
    return children;
  }

  const Stack = createStackNavigator({ rootComponent: Root });

  const ScreenWithParams = defineScreen('/with/params', function ScreenWithParams({ param1 }: { param1: number }) {
    return (
      <View>
        <Text>ScreenWithParams</Text>
        <Text>param1={param1}</Text>
      </View>
    );
  });

  const ScreenWithoutParams = defineScreen('/without/params', function ScreenWitoutParams() {
    const navigation = useNavigation();
    return (
      <View>
        <Text>ScreenWithoutParams</Text>
        <Button
          testID="btnNavigateToScreenWithParams"
          title="ScreenWithParams"
          onPress={() => {
            // param1: number is enforced by typescript compiler (not javascript)
            navigation.push(ScreenWithParams, { param1: 10 });
          }}
        />
      </View>
    );
  });

  const HomeScreen = defineScreen('/', function HomeScreen() {
    const navigation = useNavigation();
    return (
      <View>
        <Text>HomeScreen</Text>
        <Button
          testID="btnNavigateToScreenWithoutParams"
          title="ScreenWithoutParams"
          onPress={() => {
            navigation.push(ScreenWithoutParams, { path: 'a' });
          }}
        />
      </View>
    );
  });

  function StackContainer() {
    return (
      <TestRoot>
        <AppThemeProvider>
          <Stack screens={[HomeScreen, ScreenWithParams, ScreenWithoutParams]} initialRouteName="/" />
        </AppThemeProvider>
      </TestRoot>
    );
  }

  render(<StackContainer />);
  let text = await screen.findByText('HomeScreen');
  expect(text).toBeTruthy();
  const buttonToScreenWithoutParams = await screen.findByTestId('btnNavigateToScreenWithoutParams');
  expect(buttonToScreenWithoutParams).toBeTruthy();
  fireEvent.press(buttonToScreenWithoutParams);

  text = await screen.findByText('ScreenWithoutParams');
  expect(text).toBeTruthy();
  const buttonToScreenWithParams = await screen.findByTestId('btnNavigateToScreenWithParams');
  expect(buttonToScreenWithParams).toBeTruthy();
  fireEvent.press(buttonToScreenWithParams);

  text = await screen.findByText('ScreenWithParams');
  expect(text).toBeTruthy();
  text = await screen.findByText('param1=10');
  expect(text).toBeTruthy();
});
