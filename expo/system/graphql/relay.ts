import { wrapRenderable } from '@hpapp/foundation/errors';
import { withTimeout } from '@hpapp/foundation/function';
import { isIn } from '@hpapp/foundation/object';
import * as logging from '@hpapp/system/logging';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Network, RequestParameters, Variables, Environment, Store, RecordSource } from 'relay-runtime';

import { HttpClientConfig, RequestTokenFactory } from './types';

const QueryToSuppressDebugLogs: string[] = ['UserServiceProviderQuery', 'FeedContextQuery'];

export function createEnvironment(config: HttpClientConfig, tokenFactory: RequestTokenFactory) {
  const endpoint = config.Endpoint;
  const network = Network.create(async (operation: RequestParameters, variables: Variables) => {
    const eventName = `system.graphql.relay.${operation.name}`;
    const start = new Date();
    try {
      const resp = await withTimeout<Response>(
        config.NetworkTimeoutSecond * 1000,
        (async () => {
          const headers: { [key: string]: string } = {
            'Content-Type': 'application/json',
            'X-HPAPP-VERSION': Constants.expoConfig?.version ?? '<unknown>',
            'X-HPAPP-EXPO-VERSION': Constants.expoConfig?.runtimeVersion?.toString() ?? '<unknown>',
            'X-HPAPP-DEVICE-INFO': `${Device.modelName}/${Device.osName}/${Device.osVersion}`
          };
          if (config.ExtraHeaderFn !== undefined) {
            const extra = await config.ExtraHeaderFn();
            Object.assign(headers, extra);
          }
          const tokens = await tokenFactory();
          if (tokens !== null) {
            if (tokens.userToken) {
              headers['Authorization'] = 'Bearer ' + tokens.userToken;
            }
            if (tokens.clientToken) {
              headers['X-HPAPP-CLIENT-AUTHORIZATION'] = `${tokens.clientToken}`;
            }
            if (tokens.idToken) {
              headers['X-HPAPP-3P-AUTHORIZATION'] = `Bearer ${tokens.idToken}`;
            }
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
      if (!isIn(operation.name, ...QueryToSuppressDebugLogs)) {
        logging.Debug(eventName, 'GraphQL success', {
          request: {
            body: {
              query: operation.text,
              variables // TODO: get rid of potentially sensitive information
            }
          },
          response: json,
          benchmark
        });
      }
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
