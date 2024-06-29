import { renderThemeProvider } from '@hpapp/features/app/theme/testhelper';
import { fireEvent, act } from '@testing-library/react-native';
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
          testID="stack.test.btnNavigateToScreenWithParams"
          title="btnScreenWithParams"
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
          testID="stack.test.btnNavigateToScreenWithoutParams"
          title="btnScreenWithoutParams"
          onPress={() => {
            navigation.push(ScreenWithoutParams, { path: 'a' });
          }}
        />
      </View>
    );
  });

  const rendered = await renderThemeProvider(
    <Stack screens={[HomeScreen, ScreenWithParams, ScreenWithoutParams]} initialRouteName="/" />
  );

  let text = await rendered.findByText('HomeScreen');
  expect(text).toBeTruthy();
  const buttonToScreenWithoutParams = await rendered.findByTestId('stack.test.btnNavigateToScreenWithoutParams');
  expect(buttonToScreenWithoutParams).toBeTruthy();
  await act(async () => {
    fireEvent.press(buttonToScreenWithoutParams);
  });

  text = await rendered.findByText('ScreenWithoutParams');
  expect(text).toBeTruthy();
  const buttonToScreenWithParams = await rendered.findByTestId('stack.test.btnNavigateToScreenWithParams');
  expect(buttonToScreenWithParams).toBeTruthy();
  // await act(async () => {
  //   fireEvent.press(buttonToScreenWithParams);
  // });
});
