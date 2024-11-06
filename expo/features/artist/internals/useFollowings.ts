import { useCallback } from 'react';
import { graphql, useMutation } from 'react-relay';

import { useFollowingsMutation, HPFollowType } from './__generated__/useFollowingsMutation.graphql';

const useFollowingsMutationGraphQL = graphql`
  mutation useFollowingsMutation($params: HPFollowUpsertParamsInput!) {
    me {
      upsertFollow(params: $params) {
        id
        type
        member {
          id
        }
      }
    }
  }
`;

const useFollowings = (): [(memberId: string, followType: HPFollowType) => Promise<string>, boolean] => {
  const [upsertFollow, isUpdating] = useMutation<useFollowingsMutation>(useFollowingsMutationGraphQL);
  const update = useCallback(
    async (memberId: string, followType: HPFollowType): Promise<string> => {
      const p = new Promise((resolve: (id: string) => void, reject: (err: object) => void) => {
        upsertFollow({
          variables: {
            params: {
              memberId: parseInt(memberId, 10),
              followType
            }
          },
          onCompleted: (data, err) => {
            if (err) {
              reject(err);
            } else {
              const id = data.me?.upsertFollow?.id;
              resolve(id!);
            }
          },
          onError: (err) => {
            reject(err);
          },
          updater: (store, payload) => {
            const followId = payload?.me?.upsertFollow?.id;
            const member = store.get(memberId) ?? undefined;
            if (followId === undefined || member === undefined) {
              return;
            }
            const record = member.getOrCreateLinkedRecord('following', 'HPFollow');
            record.setValue(followId, 'id');
            record.setValue(followType, 'followType');
          }
        });
      });
      return p;
    },
    [upsertFollow]
  );
  return [update, isUpdating];
};

export default useFollowings;
