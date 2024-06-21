import { useCurrentUser } from '@hpapp/features/auth';
import { wrapRenderable } from '@hpapp/foundation/errors';
import { WithTimeout } from '@hpapp/foundation/function';
import * as logging from '@hpapp/system/logging';
import Constants from 'expo-constants';
import { useMemo } from 'react';
import { RelayEnvironmentProvider, useRelayEnvironment } from 'react-relay';
import { Network, RequestParameters, Variables, Environment, Store, RecordSource } from 'relay-runtime';

/**
 * An interface to configure the HTTP client for GraphQL.
 */
export interface HttpClientConfig {
  /**
   * GraphQL Endpoint. If undefined, it will use the default endpoint configured in `extra.hpapp.graphQLEndpoint` in appc.config.
   */
  Endpoint?: string;
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

function getDefaultGraphQLEndpoint() {
  const endpoint = Constants.expoConfig?.extra?.hpapp?.graphQLEndpoint;
  const hostUri = Constants.platform?.hostUri; // ip:port if app is running with Metro
  if (typeof endpoint === 'string') {
    return endpoint;
  }
  if (typeof hostUri === 'string') {
    const ip = hostUri.split(':')[0];
    return 'http://' + ip + ':8080/graphql/v3';
  }
  throw new Error("Couldn't get GraphQL endpoint. Did you set expo.extra.hpapp.graphqlEndpoint properly?");
}

function createEnvironment(config: HttpClientConfig, userToken?: string) {
  const endpoint = config.Endpoint ?? getDefaultGraphQLEndpoint();
  const network = Network.create(async (operation: RequestParameters, variables: Variables) => {
    const eventName = `contexts.relay.graphql.${operation.name}`;
    const start = new Date();
    try {
      const resp = await WithTimeout<Response>(
        config.NetworkTimeoutSecond * 1000,
        (async () => {
          const headers: { [key: string]: string } = {
            'Content-Type': 'application/json'
          };
          if (config.ExtraHeaderFn !== undefined) {
            const extra = await config.ExtraHeaderFn();
            Object.assign(headers, extra);
          }
          if (userToken !== undefined) {
            headers['Authorization'] = 'Bearer ' + userToken;
          }
          return await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              query: operation.text,
              variables
            })
          });
        })()
      );
      const json = await resp.json();
      const benchmark = new Date().getTime() - start.getTime();
      logging.Info(eventName, 'GraphQL success', {
        request: {
          body: {
            query: operation.text,
            variables // TODO: get rid of potentially sensitive information
          }
        },
        response: json,
        benchmark
      });
      return json;
    } catch (err) {
      const benchmark = new Date().getTime() - start.getTime();
      logging.Error(eventName, `GraphQL error: ${(err as Error).message}`, {
        request: {
          endpoint,
          body: {
            query: operation.text,
            variables // TODO: get rid of potentially sensitive information
          }
        },
        // TODO: capture response text here
        error: err,
        benchmark
      });
      // wrapRenderable always returns an Error object
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw wrapRenderable(err);
    }
  });
  const store = new Store(new RecordSource());
  return new Environment({
    network,
    store
  });
}

function RelayProvider({ children, config }: { children: React.ReactNode; config: HttpClientConfig }) {
  const [user] = useCurrentUser();
  const environment = useMemo(() => {
    return createEnvironment(config, user?.accessToken);
  }, [config, user?.accessToken]);
  return <RelayEnvironmentProvider environment={environment}>{children}</RelayEnvironmentProvider>;
}

const useRelay = useRelayEnvironment;

export { RelayProvider, useRelay };
