import { useSettings } from "@hpapp/contexts/settings";
import { SecureStorage, SettingsStore } from "@hpapp/system/kvs";
import React, { useCallback } from "react";
import * as logging from "@hpapp/system/logging";

interface User {
  id: string;
  username: string;
  accessToken: string;
}

const storage = new SecureStorage();

// TODO: remove this when we see no users in v2.x in the last 30 days.
const LegacyCurrentUserSettings = SettingsStore.register<User>(
  "hpapp.user.autholized_user", // there was a typo in the past!!
  storage
);

const CurrentUserSettings = SettingsStore.register<User>(
  "hpapp.auth.current_user",
  storage,
  // migration from v2.x
  {
    migrationFrom: LegacyCurrentUserSettings,
  }
);

function useCurrentUser(): [User | undefined, (user: User | null) => void] {
  const [user, setUser] = useSettings(CurrentUserSettings);
  const setUserWithLoggig = useCallback(
    (update: User | null) => {
      if (user) {
        if (update == null) {
          logging.Info("features.auth.logout", "logout", {
            userid: user.id,
          });
        }
      } else {
        if (update) {
          logging.Info("features.auth.login", "login", {
            userid: update.id,
          });
        }
      }
      setUser(update);
    },
    [setUser]
  );
  return [user, setUserWithLoggig];
}

type UserTier = "admin" | "fcmember" | "normal" | "guest";

function useUserTier(user: User | undefined): UserTier {
  if (!user) {
    return "guest";
  }
  return "normal";
}

function useLogout() {
  const [user, setUser] = useCurrentUser();
  return useCallback(() => {
    setUser(null);
  }, [setUser]);
}

type LoginContainer = React.ElementType<{
  onAuthenticated: (user: User) => void;
}>;

export {
  User,
  CurrentUserSettings,
  useCurrentUser,
  useUserTier,
  useLogout,
  LoginContainer,
  UserTier,
};
