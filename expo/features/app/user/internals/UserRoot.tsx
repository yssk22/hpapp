import { Initializer, initURICache, Loading } from '@hpapp/features/common';
import { Screen, ScreenParams, createStackNavigator } from '@hpapp/features/common/stack';
import * as logging from '@hpapp/system/logging';
import { useNavigationContainerRef } from '@react-navigation/native';

import UserError from './UserError';
import Provider from './UserServiceProvider';
import UserWrapper from './UserWrapper';

const Stack = createStackNavigator({
  rootComponent: UserWrapper
});

const initializers = [initURICache];
const Screens: Screen<ScreenParams>[] = [];

export type UserRootProps = { screens?: Screen<ScreenParams>[] };

export default function UserRoot({ screens = Screens }: UserRootProps) {
  const navigation = useNavigationContainerRef<ReactNavigation.RootParamList>();
  return (
    <Initializer initializers={initializers}>
      <Provider errorFallback={UserError} loadingFallback={<Loading testID="UserRoot.Loading" />}>
        <Stack
          ref={navigation}
          screens={screens}
          initialRouteName="/"
          onStateChange={(state) => {
            logging.Info('features.app.user.onStateChagne', `to ${state.screen.name}`, {
              name: state.screen.name,
              path: state.screen.path,
              params: state.params
            });
          }}
        />
      </Provider>
    </Initializer>
  );
}
