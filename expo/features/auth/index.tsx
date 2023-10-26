import { User, UserRole } from '@hpapp/features/auth/types';
import useCurrentUser, { CurrentUserSettings } from '@hpapp/features/auth/useCurrentUser';
import useUserRoles from '@hpapp/features/auth/useUserRoles';
import * as object from '@hpapp/foundation/object';
import React, { useCallback, useMemo } from 'react';

function TierGate({
  allow,
  deny,
  children
}: {
  allow?: UserRole | UserRole[];
  deny?: UserRole | UserRole[];
  children: React.ReactNode;
}) {
  const roles = useUserRoles();
  return useMemo(() => {
    if (allow) {
      const allowedRoles = object.NormalizeA(allow);
      const role = roles.find((r) => {
        return object.In(r, ...allowedRoles);
      });
      if (role) {
        return <>{children}</>;
      }
      return <></>;
    }
    if (deny) {
      const deniedRoles = object.NormalizeA(deny);
      const role = roles.find((r) => {
        return object.In(r, ...deniedRoles);
      });
      if (role) {
        return <></>;
      }
      return <>{children}</>;
    }
    throw new Error('none of allow nor deny is specified in TierGate');
  }, [allow, deny, roles]);
}

function useLogout() {
  const [, setUser] = useCurrentUser();
  return useCallback(() => {
    setUser(null);
  }, [setUser]);
}

type LoginContainer = React.ElementType<{
  onAuthenticated: (user: User) => void;
}>;

export { User, UserRole, CurrentUserSettings, useCurrentUser, useUserRoles, TierGate, useLogout, LoginContainer };
