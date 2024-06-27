import { AppConfig, AppConfigSettings } from '@hpapp/features/appconfig/useAppConfig';
import { CurrentUserSettings, User } from '@hpapp/features/auth';
import { AnalyticsProvider } from '@hpapp/features/root/context/analytics';
import { RelayProvider } from '@hpapp/features/root/context/relay';
import { SettingsProvider } from '@hpapp/features/settings/context';
import { AppThemeProvider } from '@hpapp/features/settings/context/theme';
import {
  LocalUserConfiguration,
  LocalUserConfigurationSettings
} from '@hpapp/features/settings/context/useLocalUserConfig';
import { UPFCConfig, UPFCSettings } from '@hpapp/features/upfc/internals/settings/useUPFCSettings';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

const settings = [CurrentUserSettings, LocalUserConfigurationSettings, UPFCSettings, AppConfigSettings];

export type RootContainerProps = {
  currentUser?: User;
  localUserConfiguration?: LocalUserConfiguration;
  appConfig?: AppConfig;
  upfc?: UPFCConfig;
};

export default function RootContainer({
  currentUser,
  localUserConfiguration,
  appConfig,
  upfc,
  children
}: RootContainerProps & { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    (async () => {
      currentUser && (await CurrentUserSettings.save(currentUser));
      localUserConfiguration && (await LocalUserConfigurationSettings.save(localUserConfiguration));
      appConfig && (await AppConfigSettings.save(appConfig));
      upfc && (await UPFCSettings.save(upfc));
      setReady(true);
    })();
  }, []);
  if (!ready) {
    return null;
  }
  return (
    <SettingsProvider settings={settings}>
      <AppThemeProvider>
        <AnalyticsProvider>
          <RelayProvider>
            <View style={{ flex: 1 }} testID="RootContainer">
              {children}
            </View>
          </RelayProvider>
        </AnalyticsProvider>
      </AppThemeProvider>
    </SettingsProvider>
  );
}
