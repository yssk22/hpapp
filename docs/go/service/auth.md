# auth

## Mobile App User Authentication

When the server authenticate the user, we use 3 different HTTP headers for each.

### Client Authentication

If a client sends an HTTP request with `X-HpApp-Client-Authorization` header with AppCheck token, the server validates the token to identify if the request comes from the valid client or not.

In Go code, you can get the status of the client authentication by using `github.com/yssk22/hpapp/service/auth/client.CurrentClient(ctx).IsVerified(ctx)`.

### External User Authentication

If a client sends an HTTP request with `X-HPAPP-3P-Authorization`header with the access token provided by Firebase, the server validates the token to identify if the request is issued by the logged in user.

In Go code, you can get the current user by using `github.com/yssk22/hpapp/service/auth/extuser.CurrentUser(ctx)`. Once the client is authenticated by appuser, it doesn't need to send the Firebase token so this function may return nil even `appuser` is authenticated.

### App User Authetnication

When a client calls `authenticate` GraphQL mutation with `X-HpApp-3p-Authorization`, the server issue the user access token for that user.

If a client sends an HTTP request with `Authorization` header with AppCheck token, the server validates the token to identify if the request comes from the valid client or not.

The server validates `X-HPAPP-CLIENT-AUTHORIZATION` header and see if the token is an AppCheck token, If both fails, the request is marked as unauthorized client, so functions may not authorize the request to perform.

In Go code, you can get the current user by using `github.com/yssk22/hpapp/service/auth/appuser.CurrentUser(ctx)`.

## Server To Server Call

Server To Server call is used when the server call it's http endpoint recursively or other systems like Google Cloud Scheduler call the http endpoint of the app server. In this scenario, Google Cloud uses `Authorization` header to verify the http request is called by the service account. When the server validates the header, it sets the `client.CurrentClient(ctx)` as a verified client and `appuser.CurrentUser(ctx)` as a system user.

## See also

- [github.com/yssk22/hpapp/service/auth/client](./godoc/pkg/github.com/yssk22/hpapp/go/service/auth/client/index.html)
- [github.com/yssk22/hpapp/service/auth/extuser](./godoc/pkg/github.com/yssk22/hpapp/go/service/auth/extuser/index.html)
- [github.com/yssk22/hpapp/service/auth/appuser](./godoc/pkg/github.com/yssk22/hpapp/go/service/auth/appuser/index.html)
