import { SettingsStore, AsyncStorage } from '@hpapp/system/kvs';
import Constants from 'expo-constants';

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
  graphQLEndpoint: Constants.expoConfig?.extra!.hpapp!.graphQLEndpoint!,
  useLocalAuth: Constants.expoConfig?.extra!.hpapp!.useLocalAuth!,
  useUPFCDemoScraper: true,

  // TODO: should refer to Constants.expoConfig?.extra?.hpapp.firebase[IOS|Android]ClientID
  firebaseIOSClientID: Constants.expoConfig?.extra?.hpapp?.auth?.google?.iosClientId,
  firebaseAndroidClientID: Constants.expoConfig?.extra?.hpapp?.auth?.google?.androidClientId
};

export default SettingsStore.register<AppConfig>('hpapp.settings.appconfig', new AsyncStorage(), {
  defaultValue: SettingsAppConfigDefault
});
