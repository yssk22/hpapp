import { SettingsStore, SecureStorage } from '@hpapp/system/kvs';

export type UPFCConfig = {
  // for helloproject (legacy)
  /** @deprecated use hpUsername instead */
  username?: string;
  /** @deprecated use hpPassword instead */
  password?: string;

  // for helloproject (new)
  hpUsername?: string | null;
  hpPassword?: string | null;

  // for mline
  mlUsername?: string | null;
  mlPassword?: string | null;

  // common settings
  calendarId?: string | null;
  eventPrefix?: string | null;

  lastAuthenticatedAt?: number | null;
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
