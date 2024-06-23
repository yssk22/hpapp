import { CurrentUserSettings, LoginContainer, useCurrentUser } from '@hpapp/features/auth';
import GuestRoot from '@hpapp/features/root/GuestRoot';
import { Analytics, AnalyticsProvider } from '@hpapp/features/root/context/analytics';
import { RelayProvider, HttpClientConfig } from '@hpapp/features/root/context/relay';
import ProtectedRoot from '@hpapp/features/root/protected/ProtectedRoot';
import { ScreenList } from '@hpapp/features/root/protected/stack';
import { SettingsProvider } from '@hpapp/features/settings/context';
import { AppThemeProvider } from '@hpapp/features/settings/context/theme';
import { LocalUserConfigurationSettings } from '@hpapp/features/settings/context/useLocalUserConfig';
import { UPFCSettings } from '@hpapp/features/upfc/settings/useUPFCSettings';

const settings = [CurrentUserSettings, LocalUserConfigurationSettings, UPFCSettings];

function UserRoot({ LoginContainer, screens }: { LoginContainer: LoginContainer; screens: ScreenList }) {
  const [user, setUser] = useCurrentUser();
  if (user) {
    return <ProtectedRoot screens={screens} />;
  }
  return <GuestRoot LoginContainer={LoginContainer} onAuthenticated={setUser} />;
}

export default function Root({
  loginContainer,
  analytics,
  httpClientConfig = {
    NetworkTimeoutSecond: 60
  },
  screens
}: {
  loginContainer: LoginContainer;
  analytics?: Analytics;
  httpClientConfig?: HttpClientConfig;
  screens: ScreenList;
}) {
  return (
    <SettingsProvider settings={settings}>
      <AppThemeProvider>
        <AnalyticsProvider analytics={analytics}>
          <RelayProvider config={httpClientConfig}>
            <UserRoot LoginContainer={loginContainer} screens={screens} />
          </RelayProvider>
        </AnalyticsProvider>
      </AppThemeProvider>
    </SettingsProvider>
  );
}
