import { User } from '@hpapp/features/auth/types';
import { useSettings } from '@hpapp/features/settings/context';
import { SecureStorage, SettingsStore } from '@hpapp/system/kvs';
import * as logging from '@hpapp/system/logging';
import { useCallback } from 'react';

const storage = new SecureStorage();

// TODO: remove this when we see no users in v2.x in the last 30 days.
const LegacyCurrentUserSettings = SettingsStore.register<User>(
  'hpapp.user.autholized_user', // there was a typo in the past!!
  storage
);

export const CurrentUserSettings = SettingsStore.register<User>(
  'hpapp.auth.current_user',
  storage,
  // migration from v2.x
  {
    migrationFrom: LegacyCurrentUserSettings
  }
);

export default function useCurrentUser(): [User | undefined, (user: User | null) => void] {
  const [user, setUser] = useSettings(CurrentUserSettings);
  const setUserWithLoggig = useCallback(
    (update: User | null) => {
      if (user) {
        if (update == null) {
          logging.Info('features.auth.logout', 'logout', {
            userid: user.id
          });
        }
      } else {
        if (update) {
          logging.Info('features.auth.login', 'login', {
            userid: update.id
          });
        }
      }
      setUser(update);
    },
    [setUser]
  );
  return [user, setUserWithLoggig];
}
