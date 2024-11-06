# Test

We use [`jest`](https://jestjs.io/) as a primary testing framework for Expo projects and also use [`storybook`](https://storybook.js.org/) for UX/UI testing.

## Component Test by Jest

### When to Write a test?

each feature export the components from index.tsx so you can put index.test.tsx in the same directory to test those components. You can still add test in internals directory if you want.

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
    const rendered = await renderUserComponent(<ComponentName />);
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

`renderUserComponent` is a key to build the component tree for hpapp. Most of components are used for the logged in users so that it includes the user context provider and the navigation provider. If you want to test the component for the logged out users, you can use `renderGuestComponent` function.

`renderUserComponent` can have options to customize the app configuratio and user configuration. For example, if you want to set the UPFC credentials, you can just pass the `upfc` prop to the `renderUserComponent` function.

```typescript
const rendered = await renderUserComponent(<ComponentName />, {
  upfc: {
    username: "test",
    password: "test",
  },
});
```

### Testing with GraphQL Query

If your commpnent uses GraphQL, you need a json data file to mock the GraphQL request. To make it easy to create a json data file, you can use the following environment variable when executing the test.

- `HPAPP_GRAPHQL_ENDPOINT_FOR_JEST`: GraphQL endpoint for the test. we recommend to use the production.
- `HPAPP_USER_TOKEN_FOR_JEST`: most of GraphQL requests need a user token. You can open the expo devclient app, then go to '設定' -> '開発者設定', then tap "Access Token" to get the token logged in your console.
- `HPAPP_APP_TOKEN_FOR_JEST`: needed if you create a json data file from the production.

When the jest execute the test first time (or the response snapshot file is not found.), it will issue the request to the server and save the respose snapshot file under `system/graphql/__mocks__/snapshots` directory and use the response for the next time.

### Testing with GraphQL Mutation

Mutation is a bit tricky because it changes the server state and response is usually simple so that you can create a response data file manually.

## UX/UI Test by storybook

Our storybook implementation is on top of both `react-native` and `react-native-web` while stories are shared across platforms. So when you write a story, your component has to support both platforms.

### Storybook Configuration

We reuse the environment variables for the jest test as mentioned above.

### Native vs Web

#### Storybook for native applications

AppConfig has a filed to control for the development build to show the storybook or the app. You can switch the mode by opening the development menu (shake your device), open AppConfig dialog, then switch `Use Storybook` so that you can see the storybook or go back to app.

The storybook configuration is in the `features/app/storybook` directory.

#### Storybook for web

You can also launch the storybook web by running `yarn storybook-web` and access to `http://localhost:6006` on your browser. For components that uses GraphQL, it will access to `http://localhost:8080/graphql/v3` regardless of `HPAPP_GRAPHQL_ENDPOINT_FOR_JEST` settings since we still don't have a secured way for GraphQL endpoint to serve for browsers. so you need to run the GraphQL server on your local machine as well.

The storybook configuration is in the `.storybook` directory.
