import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { useCallback } from 'react';
import { graphql, useMutation } from 'react-relay';

import { usePushNotificationTokenUpdatorMutation } from './__generated__/usePushNotificationTokenUpdatorMutation.graphql';

const usePushNotificationTokenUpdatorMutationGraphQL = graphql`
  mutation usePushNotificationTokenUpdatorMutation($token: String!, $params: NotificationSettingsInput!) {
    me {
      upsertNotificationToken(token: $token, params: $params) {
        id
        token
        slug
        name
        enableNewPosts
        enablePaymentStart
        enablePaymentDue
      }
    }
  }
`;

export type usePushNotificationTokenUpdatorOptions = {
  enableNewPosts?: boolean;
  enablePaymentStart?: boolean;
  enablePaymentDue?: boolean;
};

export default function usePushNotificationTokenUpdator(): [
  (token: string | null | undefined, options?: usePushNotificationTokenUpdatorOptions) => void,
  boolean
] {
  const [upsertNotificationToken, isUpserting] = useMutation<usePushNotificationTokenUpdatorMutation>(
    usePushNotificationTokenUpdatorMutationGraphQL
  );
  const mutation = useCallback(
    (token: string | null | undefined, options?: usePushNotificationTokenUpdatorOptions) => {
      if (!isUpserting && token !== null && token !== undefined) {
        const deviceName = `${Device.deviceName ?? 'Unknown'} (${Device.modelName})/${Constants.expoConfig!.slug}`;
        upsertNotificationToken({
          variables: {
            token,
            params: {
              name: deviceName,
              slug: Constants.expoConfig!.slug,
              ...options
            }
          }
        });
      }
    },
    [upsertNotificationToken, isUpserting]
  );
  return [mutation, isUpserting];
}
