import AppConfigMoal from '@hpapp/features/appconfig/AppConfigModal';
import { AppConfigSettings } from '@hpapp/features/appconfig/useAppConfig';
import { CurrentUserSettings, useCurrentUser } from '@hpapp/features/auth';
import GuestRoot from '@hpapp/features/root/GuestRoot';
import { Analytics, AnalyticsProvider } from '@hpapp/features/root/context/analytics';
import { RelayProvider } from '@hpapp/features/root/context/relay';
import ProtectedRoot from '@hpapp/features/root/protected/ProtectedRoot';
import { ScreenList } from '@hpapp/features/root/protected/stack';
import { SettingsProvider } from '@hpapp/features/settings/context';
import { AppThemeProvider } from '@hpapp/features/settings/context/theme';
import { LocalUserConfigurationSettings } from '@hpapp/features/settings/context/useLocalUserConfig';
import { UPFCSettings } from '@hpapp/features/upfc/settings/useUPFCSettings';
import { registerDevMenuItems } from 'expo-dev-menu';
import { useEffect, useState } from 'react';

const settings = [CurrentUserSettings, LocalUserConfigurationSettings, UPFCSettings, AppConfigSettings];

function UserRoot({ screens }: { screens: ScreenList }) {
  const [user, setUser] = useCurrentUser();
  if (user) {
    return <ProtectedRoot screens={screens} />;
  }
  return <GuestRoot onAuthenticated={setUser} />;
}

export default function Root({ analytics, screens }: { analytics?: Analytics; screens: ScreenList }) {
  const [showAppConfigModal, setShowAppConfigModal] = useState(false);
  useEffect(() => {
    registerDevMenuItems([
      {
        name: 'App Config',
        callback: () => setShowAppConfigModal(!showAppConfigModal)
      }
    ]);
  }, [showAppConfigModal, setShowAppConfigModal]);
  return (
    <SettingsProvider settings={settings}>
      <AppThemeProvider>
        <AnalyticsProvider analytics={analytics}>
          <RelayProvider>
            <AppConfigMoal isVisible={showAppConfigModal} onClose={() => setShowAppConfigModal(false)} />
            <UserRoot screens={screens} />
          </RelayProvider>
        </AnalyticsProvider>
      </AppThemeProvider>
    </SettingsProvider>
  );
}
