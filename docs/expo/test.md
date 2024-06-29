# Test

We use [`jest`](https://jestjs.io/) as a primary testing framework for Expo projects.

## Component Test

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
- `HPAPP_USER_TOKEN_FOR_JEST`: most of GraphQL requests need a user token.
- `HPAPP_APP_TOKEN_FOR_JEST`: needed if you create a json data file from the production.

When the jest execute the test first time (or the response snapshot file is not found.), it will issue the request to the server and save the respose snapshot file under `system/graphql/__mocks__/snapshots` directory and use the response for the next time.

### Testing with GraphQL Mutation

Mutation is a bit tricky because it changes the server state and response is usually simple so that you can create a response data file manually.
