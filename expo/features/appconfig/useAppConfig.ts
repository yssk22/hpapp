import { useSettings } from '@hpapp/features/settings/context';
import { SettingsStore, AsyncStorage } from '@hpapp/system/kvs';
import Constants from 'expo-constants';

type AppConfig = {
  readonly useLocalAppConfig: boolean;
  readonly graphQLEndpoint: string;
  readonly useLocalAuth: boolean;
  readonly useUPFCDemoScraper: boolean;
};

const DefaultAppConfig: AppConfig = {
  useLocalAppConfig: false,
  graphQLEndpoint: Constants.expoConfig?.extra!.hpapp!.graphQLEndpoint!,
  useLocalAuth: Constants.expoConfig?.extra!.hpapp!.useLocalAuth!,
  useUPFCDemoScraper: true
};

const AppConfigSettings = SettingsStore.register<AppConfig>('hpapp.appconfig', new AsyncStorage(), {
  defaultValue: DefaultAppConfig
});

function useAppConfigForEdit() {
  return useSettings(AppConfigSettings);
}

export default function useAppConfig() {
  const [settings] = useAppConfigForEdit();
  if (settings?.useLocalAppConfig) {
    return settings;
  }
  return DefaultAppConfig;
}

export { AppConfigSettings, useAppConfigForEdit, useAppConfig, AppConfig, DefaultAppConfig };
