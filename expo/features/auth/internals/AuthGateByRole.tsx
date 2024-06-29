import * as object from '@hpapp/foundation/object';
import React, { useMemo } from 'react';

import { UserRole } from './types';
import useUserRoles from './useUserRoles';

export default function AuthGateByRole({
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
      const allowedRoles = object.normalizeA(allow);
      const role = roles.find((r) => {
        return object.isIn(r, ...allowedRoles);
      });
      if (role) {
        return <>{children}</>;
      }
      return <></>;
    }
    if (deny) {
      const deniedRoles = object.normalizeA(deny);
      const role = roles.find((r) => {
        return object.isIn(r, ...deniedRoles);
      });
      if (role) {
        return <></>;
      }
      return <>{children}</>;
    }
    throw new Error('none of allow nor deny is specified in AuthGateByRole');
  }, [allow, deny, roles]);
}
