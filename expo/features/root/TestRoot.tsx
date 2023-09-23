import { AnalyticsProvider } from "@hpapp/contexts/analytics";
import { RelayProvider } from "@hpapp/contexts/relay";
import { SettingsProvider } from "@hpapp/contexts/settings";
import { CurrentUserSettings } from "@hpapp/features/auth";

const settings = [CurrentUserSettings];

export default function TestRoot({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <SettingsProvider settings={settings}>
      <AnalyticsProvider>
        <RelayProvider
          config={{
            Endpoint: "http://localhost:8080/graphql/v3",
            NetworkTimeoutSecond: 10,
          }}
        >
          {children}
        </RelayProvider>
      </AnalyticsProvider>
    </SettingsProvider>
  );
}
