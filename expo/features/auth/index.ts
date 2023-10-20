import { useSettings } from "@hpapp/contexts/settings";
import { SecureStorage, SettingsStore } from "@hpapp/system/kvs";
import React, { useCallback } from "react";

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

function useCurrentUser() {
  return useSettings(CurrentUserSettings);
}

type UserTier = "admin" | "fcmember" | "normal" | "guest";

function useUserTier(user: User | undefined): UserTier {
  if (!user) {
    return "guest";
  }
  return "normal";
}

function useLogout() {
  const [_, setUser] = useSettings(CurrentUserSettings);
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
