/**
 * An interface to configure the HTTP client for GraphQL.
 */
export interface HttpClientConfig {
  /**
   * GraphQL Endpoint. If undefined, it will use the default endpoint configured in `extra.hpapp.graphQLEndpoint` in appc.config.
   */
  Endpoint: string;
  /**
   * Network timeout in seconds.
   */
  NetworkTimeoutSecond: number;
  /**
   * A hook to add extra headers to the request.
   * @returns A promise that resolves to a record of headers.
   */
  ExtraHeaderFn?: () => Promise<Record<string, string>>;
}

export type RequestTokenFactory = () => Promise<RequestTokenSet | null>;

export type RequestTokenSet = {
  userToken: string | undefined;
  clientToken?: string | undefined;
  idToken?: string | undefined;
};
