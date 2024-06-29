import { SettingsStore, SecureStorage } from '@hpapp/system/kvs';

export type UPFCConfig = {
  username: string;
  password: string;
  calendarId?: string | null;
  eventPrefix?: string | null;
};

export default SettingsStore.register<UPFCConfig>(
  'hpapp.settings.upfc_config',
  new SecureStorage({
    keychainService: 'hpapp.settings.upfc_config'
  }),
  {
    migrationFrom: SettingsStore.register<UPFCConfig>(
      'hpapp.settings.fanclub',
      new SecureStorage({
        keychainService: 'hpapp.settings.fanclub.credentials'
      })
    )
  }
);
