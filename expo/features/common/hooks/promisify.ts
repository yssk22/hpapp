import { RenderaleError } from '@hpapp/foundation/errors';
import { useMemo } from 'react';
import { useMutation } from 'react-relay';
import { MutationParameters, GraphQLTaggedNode, VariablesOf, PayloadError } from 'relay-runtime';

function getFirstMessageFromPayloadError(err: PayloadError[] | null): Error | null {
  if (err === null) {
    return null;
  }
  return new RenderaleError(err[0].message, null);
}

// usePromisify converts the GraphQL mutation call v to async/promise function call.
function usePromisifyMutation<T extends MutationParameters>(
  mutation: GraphQLTaggedNode
): [(input: VariablesOf<T>) => Promise<T['response']>, boolean] {
  const [commit, isCommiting] = useMutation<T>(mutation);
  const p = useMemo(
    () => async (v: VariablesOf<T>) => {
      return new Promise<T['response']>((resolve, reject) => {
        commit({
          variables: v,
          onError: (err) => {
            reject(err);
          },
          onCompleted: (data, err) => {
            const error = getFirstMessageFromPayloadError(err);
            if (error != null) {
              reject(error);
              return;
            }
            resolve(data);
          }
        });
      });
    },
    [commit]
  );
  return [p, isCommiting];
}

export { usePromisifyMutation };
