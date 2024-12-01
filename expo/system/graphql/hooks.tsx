import { useCallback, useState } from 'react';
import {
  FetchPolicy,
  fetchQuery,
  GraphQLTaggedNode,
  useLazyLoadQuery,
  useRelayEnvironment,
  Variables
} from 'react-relay';
import { OperationType } from 'relay-runtime';

type QueryOptinos = {
  fetchKey?: number | undefined;
  fetchPolicy?: FetchPolicy | undefined;
};

export function useLazyReloadableQuery<TQuery extends OperationType>(
  taggedNode: GraphQLTaggedNode,
  variables: Variables
) {
  const [isReloading, setIsReloading] = useState(false);
  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState<QueryOptinos>({});
  const env = useRelayEnvironment();
  const reload = useCallback(() => {
    if (isReloading) {
      return;
    }
    setIsReloading(true);
    fetchQuery(env, taggedNode, variables).subscribe({
      complete: () => {
        setIsReloading(false);
        setRefreshedQueryOptions((prev) => ({
          fetchKey: (prev?.fetchKey ?? 0) + 1,
          fetchPolicy: 'network-only'
        }));
      },
      error: () => {
        setIsReloading(false);
      }
    });
  }, [variables]);
  const data = useLazyLoadQuery<TQuery>(taggedNode, variables, refreshedQueryOptions);
  return { data, isReloading, reload };
}
