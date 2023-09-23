import React from "react";
import { Text } from "@rneui/base";
import { useNavigationContainerRef } from "@react-navigation/native";
import {
  Screen,
  ScreenParams,
  createStackNavigator,
} from "@hpapp/features/root/protected/stack";
import { ServiceRootProvider } from "@hpapp/contexts/serviceroot";
import Initialize from "@hpapp/features/root/protected/Initializer";
import { initURICache } from "@hpapp/features/common/hooks/uricache";
import LoadError from "@hpapp/features/root/protected/LoadError";
import { AppThemeProvider } from "@hpapp/contexts/settings/theme";
import RootWrapper from "@hpapp/features/root/protected/RootWrapper";

const Stack = createStackNavigator({
  rootComponent: RootWrapper,
});

const initializers = [initURICache];

export default function ProtectedRoot({
  screens,
}: {
  screens: Array<Screen<ScreenParams>>;
}) {
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
