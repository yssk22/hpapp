import { ServiceRootProvider } from '@hpapp/contexts/serviceroot';
import { AppThemeProvider } from '@hpapp/contexts/settings/theme';
import { initURICache } from '@hpapp/features/common/hooks/uricache';
import Initialize from '@hpapp/features/root/protected/Initializer';
import LoadError from '@hpapp/features/root/protected/LoadError';
import RootWrapper from '@hpapp/features/root/protected/RootWrapper';
import { Screen, ScreenParams, createStackNavigator } from '@hpapp/features/root/protected/stack';
import { useNavigationContainerRef } from '@react-navigation/native';
import { Text } from '@rneui/base';
import React from 'react';

const Stack = createStackNavigator({
  rootComponent: RootWrapper
});

const initializers = [initURICache];

export default function ProtectedRoot({ screens }: { screens: Screen<ScreenParams>[] }) {
  const navigation = useNavigationContainerRef<ReactNavigation.RootParamList>();
  return (
    <Initialize initializers={initializers}>
      <AppThemeProvider>
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
      </AppThemeProvider>
    </Initialize>
  );
}
