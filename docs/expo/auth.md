# Auth

As described in [Mobile App User Authorization](/hpapp/go/service/auth/), there are three types of authentication methods - Client Authentication, External User Authentication, and App User Authentication. This document describes how each authentication method is implemented in Expo.

## Comopnent Tree

Any HTTP request to Go servers are GraphQL requests, which are issued under Relay context set by [`RelayProvider`](https://yssk22.github.io/hpapp/expo/typedoc/functions/features_root_context_relay.RelayProvider.html)

`RelayProvider` receives a `[HttpClientConig](https://yssk22.github.io/hpapp/expo/typedoc/interfaces/features_root_context_relay.HttpClientConfig.html)` object as a prop, and configure the http header based on that object and [the current user context](https://yssk22.github.io/hpapp/expo/typedoc/functions/features_auth_useCurrentUser.useCurrentUser.html), which is set by [`SettingsProvider`](https://yssk22.github.io/hpapp/expo/typedoc/functions/features_settings_context.SettingsProvider.html).

```jsx
<SettingsProvider>
    <RelayProvider config={...}>
        <UIComponentVisibleToUsers /> 
    </RelayProvider>
</SettingsProvider>
```

`config` value is actually set by [`useFirebaseTokensInHttpHeader()`](https://yssk22.github.io/hpapp/expo/typedoc/functions/features_auth_firebase_useFirebaseTokensInHttpHeader.useFirebaseTokensInHttpHeader.html), which covers `Client Authorization` and `External User Authorization` where the token is managed outside React component tree.

## How three authorization headers are set

### Client Authorization

Go server expects clients to send an [AppCheck](https://firebase.google.com/docs/app-check) token in `X-HPAPP-CLIENT-AUTHORIZATION` and the token can be fetched via firebase SDK. [`appcheck`](https://github.com/yssk22/hpapp/blob/main/expo/features/auth/firebase/appcheck.ts) module is a wrapper to do this.

### External User Authorization

Go server expect clients to send an OAuth's ID token  in `X-HPAPP-CLIENT-AUTHORIZATION` and the token can be fetched via firebase SDK as well. [`user`](https://github.com/yssk22/hpapp/blob/main/expo/features/auth/firebase/user.ts) module si a wrapper to do this.

### App User Authorization

As mentioned `RelayProvider` refers to the user context (provided by `SettingsProvider`), which has an user token set to the `Authorization` header. So when a user context value is updated, SettingsProvider rerender the tree to reconstruct the `RelayProvider` with the new token. With this component tree, the login/logout process is isolated from http header configurations and you can focus on the login/lotout user experience.

## Login flow on top of Firebase SDK

The current login flow implemented in [`FirebaseLoginContainer`](https://github.com/yssk22/hpapp/blob/main/expo/features/auth/firebase/FirebaseLoginContainer.tsx) fully rely on Firebase SDK as follows.

1. When a user click *Login with `Provider`* then it triggers the firebase authentication flow for `Provider`
2. When firebase authentication completed and id token is returned, a GraphQL request to call  `authenticate` mutation with id token is issued to the GraphQL server.
3. GraphQL server validates the id token and returns a user token (JWT).
4. The flow fires `onAuthenticated` event where we can update the user context with the token.

## Logout flow

The current logout flow is super simple - just clear the user context. We don't invalidate any tokens since the main user token is built on top of JWT. See also [Issue#66](https://github.com/yssk22/hpapp/issues/66).
