import { SettingsStore, AsyncStorage } from '@hpapp/system/kvs';
import Constants from 'expo-constants';

const config = Constants.expoConfig?.extra?.hpapp ?? {
  useLocalAuth: false,
  firebaseIOSClientID: '',
  firebaseAndroidClientID: '',
  cloudStoragePublicUrl: '',
  cloudStorageAuthUrl: ''
};

export type AppConfig = {
  readonly useStorybook: boolean;
  readonly useLocalAuth: boolean;
  readonly useUPFCDemoScraper: boolean;

  readonly firebaseIOSClientID?: string;
  readonly firebaseAndroidClientID?: string;
};

export const SettingsAppConfigDefault: AppConfig = {
  useStorybook: false,
  useLocalAuth: config.useLocalAuth!,
  useUPFCDemoScraper: false,
  firebaseIOSClientID: config.firebaseIOSClientID,
  firebaseAndroidClientID: config.firebaseAndroidClientID
};

export default SettingsStore.register<AppConfig>('hpapp.settings.appconfig', new AsyncStorage(), {
  defaultValue: SettingsAppConfigDefault
});
