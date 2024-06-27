# Test

We use [`jest`](https://jestjs.io/) as a primary testing framework for Expo projects.

## Component Test

### When to Write a test?

If you create a new component under `feature/{featureName}/components`, then test user experience and behavior of the component with the development build, then write a test for the component with snapshots.

### Basic Template

Here is a basic template to write a test for a component.

```typescript
import { DefaultAppConfig } from "@hpapp/features/appconfig/useAppConfig";
import { mockNavigation, renderWithTestScreen } from "@hpapp/features/root";
import { act, fireEvent } from "@testing-library/react-native";

beforeEach(() => {
  jest.restoreAllMocks();
});

describe("{ComponentName}", () => {
  test("test case", async () => {
    const navigation = mockNavigation();
    const rendered = await renderWithTestScreen(<ComponentName />);
    // test the initial state by snapshot. You already confirm look & feel of the component with the development build
    // just dump the hierarchy of the component to the snapshot so that you can avoid the regression of the look & feel.
    expect(rendered.toJSON()).toMatchSnapshot();

    // interaction
    const btn = await rendered.findByTestId("ComponentName.Button");
    expect(btn).toBeTruthy();
    await act(async () => {
      fireEvent.press(btn);
    });
    // confirm navigation
    expect(navigation.push).toBeCalledWith(UPFCSettingsScreen);
  });
});
```

`renderWithTestScreen` is a key to build the component tree for hpapp. It utilize the `RootComponent` so that any necessary context providers are composed as same as the real application
and it also provides the way to customize the context settings.

For example, if you want to set the UPFC credentials, you can just pass the `upfc` prop to the `renderWithTestScreen` function.

```typescript
const rendered = await renderWithTestScreen(<ComponentName />, {
  upfc: {
    username: "test",
    password: "test",
  },
});
```
