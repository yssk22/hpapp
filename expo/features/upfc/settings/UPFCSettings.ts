import { SettingsStore, SecureStorage } from '@hpapp/system/kvs';

type UPFCConfig = {
  username: string;
  password: string;
  calendarId?: string | null;
  eventPrefix?: string | null;
};

const UPFCSettings = SettingsStore.register<UPFCConfig>(
  'hpapp.upfc.config',
  new SecureStorage({
    keychainService: 'hpapp.upfc.config'
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

export { UPFCSettings, UPFCConfig };
