import { CurrentUserSettings } from '@hpapp/features/auth';
import { AnalyticsProvider } from '@hpapp/features/root/context/analytics';
import { RelayProvider } from '@hpapp/features/root/context/relay';
import { SettingsProvider } from '@hpapp/features/settings/context';
import { LocalUserConfigurationSettings } from '@hpapp/features/settings/context/useLocalUserConfig';

const settings = [CurrentUserSettings, LocalUserConfigurationSettings];

export default function TestRoot({ children }: { children: React.ReactElement }) {
  return (
    <SettingsProvider settings={settings}>
      <AnalyticsProvider>
        <RelayProvider
          config={{
            Endpoint: 'http://localhost:8080/graphql/v3',
            NetworkTimeoutSecond: 10
          }}
        >
          {children}
        </RelayProvider>
      </AnalyticsProvider>
    </SettingsProvider>
  );
}
