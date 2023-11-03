import { initURICache } from '@hpapp/features/common/hooks/uricache';
import Initialize from '@hpapp/features/root/protected/Initializer';
import LoadError from '@hpapp/features/root/protected/LoadError';
import RootWrapper from '@hpapp/features/root/protected/RootWrapper';
import { ServiceRootProvider } from '@hpapp/features/root/protected/context';
import { Screen, ScreenParams, createStackNavigator } from '@hpapp/features/root/protected/stack';
import { AppThemeProvider } from '@hpapp/features/settings/context/theme';
import { useNavigationContainerRef } from '@react-navigation/native';
import { Text } from '@rneui/base';

const Stack = createStackNavigator({
  rootComponent: RootWrapper
});

const initializers = [initURICache];

export default function ProtectedRoot({ screens }: { screens: Screen<ScreenParams>[] }) {
  const navigation = useNavigationContainerRef<ReactNavigation.RootParamList>();
  return (
    <Initialize initializers={initializers}>
      <ServiceRootProvider
        errorFallback={<LoadError />}
        loadingFallback={
          <>
            <Text>Loading</Text>
          </>
        }
      >
        <Stack ref={navigation} screens={screens} initialRouteName="/" />
      </ServiceRootProvider>
    </Initialize>
  );
}
