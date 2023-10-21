import React from "react";
import { Analytics, AnalyticsProvider } from "@hpapp/contexts/analytics";
import { RelayProvider, HttpClientConfig } from "@hpapp/contexts/relay";
import { SettingsProvider } from "@hpapp/contexts/settings";
import {
  CurrentUserSettings,
  LoginContainer,
  useCurrentUser,
} from "@hpapp/features/auth";
import ProtectedRoot from "@hpapp/features/root/protected/ProtectedRoot";
import GuestRoot from "@hpapp/features/root/GuestRoot";
import { ScreenList } from "@hpapp/features/root/protected/stack";
import { LocalUserConfigurationSettings } from "@hpapp/contexts/settings/useLocalUserConfig";
import { UPFCSettings } from "@hpapp/features/upfc/settings/UPFCSettings";
import {
  useFonts,
  BIZUDGothic_400Regular,
  BIZUDGothic_700Bold,
} from "@expo-google-fonts/biz-udgothic";

const settings = [
  CurrentUserSettings,
  LocalUserConfigurationSettings,
  UPFCSettings,
];

function UserRoot({
  LoginContainer,
  screens,
}: {
  LoginContainer: LoginContainer;
  screens: ScreenList;
}) {
  const [user, setUser] = useCurrentUser();
  if (user) {
    return <ProtectedRoot screens={screens} />;
  }
  return (
    <GuestRoot>
      <LoginContainer onAuthenticated={setUser} />
    </GuestRoot>
  );
}

export default function Root({
  loginContainer,
  analytics,
  httpClientConfig = {
    NetworkTimeoutSecond: 60,
  },
  screens,
}: {
  loginContainer: LoginContainer;
  analytics?: Analytics;
  httpClientConfig?: HttpClientConfig;
  screens: ScreenList;
}) {
  const [fontsLoaded] = useFonts({
    BIZUDGothic_400Regular,
    BIZUDGothic_700Bold,
  });
  if (!fontsLoaded) {
    return <></>;
  }
  return (
    <SettingsProvider settings={settings}>
      <AnalyticsProvider analytics={analytics}>
        <RelayProvider config={httpClientConfig}>
          <UserRoot LoginContainer={loginContainer} screens={screens} />
        </RelayProvider>
      </AnalyticsProvider>
    </SettingsProvider>
  );
}
