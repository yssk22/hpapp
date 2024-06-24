import { AppConfigSettings } from '@hpapp/features/appconfig/useAppConfig';
import { CurrentUserSettings } from '@hpapp/features/auth';
import { AnalyticsProvider } from '@hpapp/features/root/context/analytics';
import { RelayProvider } from '@hpapp/features/root/context/relay';
import { SettingsProvider } from '@hpapp/features/settings/context';
import { LocalUserConfigurationSettings } from '@hpapp/features/settings/context/useLocalUserConfig';

const settings = [CurrentUserSettings, LocalUserConfigurationSettings, AppConfigSettings];

export default function TestRoot({ children }: { children: React.ReactElement }) {
  return (
    <SettingsProvider settings={settings}>
      <AnalyticsProvider>
        <RelayProvider>{children}</RelayProvider>
      </AnalyticsProvider>
    </SettingsProvider>
  );
}
