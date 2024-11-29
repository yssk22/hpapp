import { logEvent } from '@hpapp/system/firebase';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef } from 'react';

type Subscription = ReturnType<typeof Notifications.addNotificationResponseReceivedListener>;

export type PushNotificationData = {
  id: string;
  timestamp: Date;
  body: {
    type: string;
    payload: { [key: string]: any };
  };
};

export type PushNotificationHandlerProps = {
  children: React.ReactElement;
  onData?: (data: PushNotificationData) => void;
};

export default function PushNotificationHandler({ children, onData }: PushNotificationHandlerProps) {
  const responseSubscription = useRef<Subscription>();
  useEffect(() => {
    (async () => {
      responseSubscription.current = Notifications.addNotificationResponseReceivedListener((response) => {
        const body = response.notification.request.content.data as {
          type: string;
          payload: string;
        };
        logEvent('respond_to_notification', {
          body
        });
        onData?.({
          id: response.notification.request.identifier,
          timestamp: new Date(response.notification.date),
          body: {
            type: body.type,
            payload: JSON.parse(body.payload)
          }
        });
      });
      return () => {
        if (responseSubscription.current) {
          Notifications.removeNotificationSubscription(responseSubscription.current);
        }
      };
    })();
  }, [onData]);
  return <>{children}</>;
}
