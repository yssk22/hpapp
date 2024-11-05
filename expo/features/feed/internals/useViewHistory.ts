import { useCallback } from 'react';
import { graphql, useMutation } from 'react-relay';

import type { useViewHistoryMutation } from './__generated__/useViewHistoryMutation.graphql';

const addOrUpdateViewHisotryMutation = graphql`
  mutation useViewHistoryMutation($params: HPViewHistoryUpsertParamsInput!) {
    me {
      upsertViewHistory(params: $params) {
        id
        isFavorite
      }
    }
  }
`;

const useViewHistory = () => {
  const [addOrUpdateViewHistory] = useMutation<useViewHistoryMutation>(addOrUpdateViewHisotryMutation);
  const update = useCallback(
    async (feedId: string, userId: string, isFavorite: boolean = false, historyId?: string): Promise<string> => {
      const optimisticResponse = historyId
        ? {
            me: {
              upsertViewHistory: {
                id: historyId,
                isFavorite
              }
            }
          }
        : undefined;
      const p = new Promise((resolve: (id: string) => void, reject: (err: object) => void) => {
        addOrUpdateViewHistory({
          variables: {
            params: {
              feedId: parseInt(feedId, 10),
              userId: parseInt(userId, 10),
              isFavorite
            }
          },
          onCompleted: (data, err) => {
            if (err) {
              reject(err);
            } else {
              const id = data.me?.upsertViewHistory?.id;
              resolve(id!);
            }
          },
          onError: (err) => {
            reject(err);
          },
          optimisticResponse,
          updater: (store, payload) => {
            const historyId = payload?.me?.upsertViewHistory?.id;
            const feedItem = store.get(feedId);
            if (historyId === undefined || feedItem === undefined || feedItem === null) {
              return;
            }
            // explicitly add a linked record since there is no way for relay to identify
            // the existing feed item to update with the history.
            const record = feedItem.getOrCreateLinkedRecord('myViewHistory', 'HPViewHistory');
            record.setValue(historyId, 'id');
            record.setValue(isFavorite, 'isFavorite');
          }
        });
      });
      return p;
    },
    [addOrUpdateViewHistory]
  );
  return [update];
};

export default useViewHistory;
