import * as helper from '@hpapp/foundation/test_helper';
import { HttpClientConfig, RequestTokenFactory } from '@hpapp/system/graphql/types';
import * as logging from '@hpapp/system/logging';
import * as Crypto from 'expo-crypto';
import path from 'path';
import { Network, RequestParameters, Variables, Environment, Store, RecordSource } from 'relay-runtime';

type SnapshotFileFormat = {
  operation: string;
  response: any;
  variables: Variables;
};

export function createEnvironment(config: HttpClientConfig, tokenFactory?: RequestTokenFactory) {
  const network = Network.create(async (operation: RequestParameters, variables: Variables) => {
    const eventName = `system.graphql.relay.${operation.name}`;
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      JSON.stringify({
        query: operation.text,
        variables
      })
    );
    if (operation.operationKind !== 'query') {
      throw new Error(`Only query operation is supported, tried "${operation.operationKind} ${operation.name}"`);
    }
    const filePath = path.join(__dirname, 'snapshots', `${operation.name}.${hash}.json`);
    try {
      const json = await helper.readFileAsJSON<SnapshotFileFormat>(filePath);
      return json.response;
    } catch {
      try {
        const [endpoint, headers] = getHeaders(operation, variables);
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            query: operation.text,
            variables
          })
        });
        const content = await resp.json();
        await helper.writeAsJSON(filePath, {
          operation: operation.name,
          response: content,
          variables
        });
        logging.Info(`${eventName}.writeToFile`, 'GraphQL response was stored as a file', {
          filePath
        });
        return content;
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error(`
You should mock the network request in your test. See more details at https://github.com/yssk22/hpapp/blob/main/docs/expo/test.md
Internal Error: ${e.toString()}

Mock file: ${filePath}

-- Query --

${operation.text}

-- Variables --

${JSON.stringify(variables, null, 2)}
        `);
        throw new Error('Network request is not mocked in Jest');
      }
    }
  });
  const store = new Store(new RecordSource());
  return new Environment({
    network,
    store
  });
}

function getHeaders(operation: RequestParameters, variables: Variables): [string, { [key: string]: string }] {
  const endpoint = process.env['HPAPP_GRAPHQL_ENDPOINT_FOR_JEST'];
  const userToken = process.env['HPAPP_USER_TOKEN_FOR_JEST'];
  const clientToken = process.env['HPAPP_APP_TOKEN_FOR_JEST'];
  if (endpoint === undefined) {
    throw new Error('HPAPP_GRAPHQL_ENDPOINT_FOR_JEST is not set to create a response snapshot');
  }
  if (userToken === undefined) {
    throw new Error('HPAPP_USER_TOKEN_FOR_JEST is not set to create a response snapshot');
  }
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${userToken}`
  };
  if (clientToken !== undefined) {
    headers['X-HPAPP-CLIENT-AUTHORIZATION'] = `Bearer ${clientToken}`;
  }
  return [endpoint, headers];
}
