import { useSettings } from '@hpapp/features/settings/context';
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

export default function useUPFCSettings() {
  return useSettings(UPFCSettings);
}

export { UPFCSettings, UPFCConfig };
