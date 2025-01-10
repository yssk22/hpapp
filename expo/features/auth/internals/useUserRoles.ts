import { useCurrentUser, User, useUPFCConfig } from '@hpapp/features/app/settings';
import { useMemo } from 'react';

import { UserRoleMap } from './types';

const adminId = '42949672973';
const developerId = '42949672973';

export default function useUserRoles(user?: User): UserRoleMap {
  const current = useCurrentUser();
  const config = useUPFCConfig();
  user = useMemo(() => {
    return user ?? current;
  }, [user, current]);
  return useMemo(() => {
    return {
      admin: user?.id === adminId,
      developer: user?.id === developerId,
      user: typeof user?.id === 'string',
      fcmember: (config?.lastAuthenticatedAt ?? 0) > 0,
      guest: typeof user?.id !== 'string'
    };
  }, [user?.id, config?.lastAuthenticatedAt]);
}
