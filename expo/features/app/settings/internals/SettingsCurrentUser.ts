import { SecureStorage, SettingsStore } from '@hpapp/system/kvs';

export interface CurrentUser {
  id: string;
  username: string;
  accessToken: string;
}

export type CurrentUserRole = 'admin' | 'developer' | 'fcmember' | 'user' | 'guest';

const storage = new SecureStorage();

// TODO: remove this when we see no users in v2.x in the last 30 days.
const LegacyCurrentUserSettings = SettingsStore.register<CurrentUser>(
  'hpapp.user.autholized_user', // there was a typo in the past!!
  storage
);

export default SettingsStore.register<CurrentUser>(
  'hpapp.settings.current_user',
  storage,
  // migration from v2.x
  {
    migrationFrom: LegacyCurrentUserSettings
  }
);
