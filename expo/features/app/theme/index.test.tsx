import { act, render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { ThemeProvider, useThemeSkeltonColor, useThemeColor } from './';

describe('theme', () => {
  test('ThemeProvider', async () => {
    function TestComponent() {
      const [color] = useThemeColor('primary');
      const skeltonColor = useThemeSkeltonColor('primary');
      return (
        <>
          <Text testID="theme.test.color">{color}</Text>
          <Text testID="theme.test.skeltonColor">{skeltonColor}</Text>
        </>
      );
    }
    const content = await render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    await act(() => {});
    expect(content.getByTestId('theme.test.color').props.children).toBe('#0075c2'); // hpofficial
    expect(content.getByTestId('theme.test.skeltonColor').props.children).toBe('#cce3f2');
  });
});
