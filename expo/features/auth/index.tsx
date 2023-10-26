import { useSettings } from "@hpapp/contexts/settings";
import { SecureStorage, SettingsStore } from "@hpapp/system/kvs";
import React, { useCallback, useMemo } from "react";
import * as logging from "@hpapp/system/logging";
import * as object from "@hpapp/foundation/object";
import useCurrentUser, {
  CurrentUserSettings,
} from "@hpapp/features/auth/useCurrentUser";
import { User, UserRole } from "@hpapp/features/auth/types";
import useUserRoles from "@hpapp/features/auth/useUserRoles";

function TierGate({
  allow,
  deny,
  children,
}: {
  allow?: UserRole | Array<UserRole>;
  deny?: UserRole | Array<UserRole>;
  children: React.ReactNode;
}) {
  const roles = useUserRoles();
  return useMemo(() => {
    if (allow) {
      const allowedRoles = object.NormalizeA(allow);
      for (let i in roles) {
        const r = roles[i];
        if (object.In(r, ...allowedRoles)) {
          return <>{children}</>;
        }
      }
      return <></>;
    }
    if (deny) {
      const deniedRoles = object.NormalizeA(deny);
      for (let i in roles) {
        const r = roles[i];
        if (object.In(r, ...deniedRoles)) {
          return <></>;
        }
        return <>{children}</>;
      }
    }
    throw new Error("none of allow nor deny is specified in TierGate");
  }, [allow, deny, roles]);
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
  UserRole,
  CurrentUserSettings,
  useCurrentUser,
  useUserRoles,
  TierGate,
  useLogout,
  LoginContainer,
};
