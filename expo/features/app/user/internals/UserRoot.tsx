import { useCurrentUser, useUserConfig } from '@hpapp/features/app/settings';
import { Initializer, Loading } from '@hpapp/features/common';
import { Screen, ScreenParams, createStackNavigator } from '@hpapp/features/common/stack';
import {
  usePushNotificationToken,
  usePushNotificationTokenUpdator,
  PushNotificationData,
  PushNotificationHandler
} from '@hpapp/features/push';
import { logScreenView, useSetUserId } from '@hpapp/system/firebase';
import * as logging from '@hpapp/system/logging';
import { init as initURICache } from '@hpapp/system/uricache';
import { useNavigationContainerRef } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';

import UserError from './UserError';
import UserServiceProvider from './UserServiceProvider';
import UserWrapper from './UserWrapper';

const Stack = createStackNavigator({
  rootComponent: UserWrapper
});

const initializers = [initURICache];
const Screens: Screen<ScreenParams>[] = [];

// TODO: genscreen should create this param types as well.
type PushNotificationParams = {
  '/feed/item/': { feedId: string };
};

export type UserRootProps = { screens?: Screen<ScreenParams>[] };

export default function UserRoot({ screens = Screens }: UserRootProps) {
  const userConfig = useUserConfig();
  const navigation = useNavigationContainerRef<PushNotificationParams>();
  const token = usePushNotificationToken();
  const [tokenUpdator] = usePushNotificationTokenUpdator();
  useEffect(() => {
    if (token.data) {
      tokenUpdator(token.data);
    }
  }, [token.data]);
  const currentUser = useCurrentUser();
  useSetUserId(currentUser?.id ?? null);
  const onData = useCallback((data: PushNotificationData) => {
    // TODO: if navigation is not ready, we should wait for it, and navigate after it's ready.
    const nav = navigation?.current;
    if (nav === null) {
      return;
    }
    if (!nav.isReady()) {
      return;
    }

    // we need a compatibility of payload with v2 implementation
    // == Ameblo Notification payload example
    // {
    //   "params": {
    //     "id": 94489510263,
    //     "memberKey": "yukiho_shimoitani",
    //     "path": "/angerme-new/entry-12876844045.html",
    //     "post_id": 12889971534
    //   },
    //   "path": "/ameblo/post/"
    // }
    if (data.body.payload.path === '/ameblo/post/') {
      nav.navigate('/feed/item/', { feedId: data.body.payload.params.id });
      return;
    }
    // in v3, the server should send path and params so that we don't have to handle details.
    nav.navigate(data.body.payload.path, data.body.payload.params);
  }, []);
  return (
    <Initializer initializers={initializers}>
      <UserServiceProvider errorFallback={UserError} loadingFallback={<Loading testID="UserRoot.Loading" />}>
        <PushNotificationHandler onData={onData}>
          <Stack
            ref={navigation}
            screens={screens}
            initialRouteName={userConfig?.completeOnboarding ? '/' : '/onboarding/'}
            onStateChange={(state) => {
              logScreenView(state.screen.name);
              logging.Info('features.app.user.onStateChagne', `to ${state.screen.name}`, {
                name: state.screen.name,
                path: state.screen.path,
                params: state.params
              });
            }}
          />
        </PushNotificationHandler>
      </UserServiceProvider>
    </Initializer>
  );
}
