import { RenderableError } from '@hpapp/foundation/errors';
import { useMemo } from 'react';
import { useMutation } from 'react-relay';
import { MutationParameters, GraphQLTaggedNode, VariablesOf, PayloadError } from 'relay-runtime';

function getFirstMessageFromPayloadError(err: PayloadError[] | null): Error | null {
  if (err === null) {
    return null;
  }
  return new RenderableError(err[0].message, null);
}

export default function useMutationPromise<T extends MutationParameters>(
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
