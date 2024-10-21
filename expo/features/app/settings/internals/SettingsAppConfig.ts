import { SettingsStore, AsyncStorage } from '@hpapp/system/kvs';
import Constants from 'expo-constants';

const config = Constants.expoConfig?.extra?.hpapp ?? {
  graphQLEndpoint: 'http://localhost:8080/graphql/v3',
  useLocalAuth: false,
  firebaseIOSClientID: '',
  firebaseAndroidClientID: '',
  cloudStoragePublicUrl: '',
  cloudStorageAuthUrl: ''
};

export type AppConfig = {
  readonly useStorybook: boolean;
  readonly useLocalAppConfig: boolean;
  readonly graphQLEndpoint: string;
  readonly useLocalAuth: boolean;
  readonly useUPFCDemoScraper: boolean;

  readonly firebaseIOSClientID?: string;
  readonly firebaseAndroidClientID?: string;
};

export const SettingsAppConfigDefault: AppConfig = {
  useStorybook: false,
  useLocalAppConfig: false,
  graphQLEndpoint: config.graphQLEndpoint!,
  useLocalAuth: config.useLocalAuth!,
  useUPFCDemoScraper: true,
  firebaseIOSClientID: config.firebaseIOSClientID,
  firebaseAndroidClientID: config.firebaseAndroidClientID
};

export default SettingsStore.register<AppConfig>('hpapp.settings.appconfig', new AsyncStorage(), {
  defaultValue: SettingsAppConfigDefault
});
