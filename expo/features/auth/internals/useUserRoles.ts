import { useCurrentUser, User } from '@hpapp/features/app/settings';
import { useMemo } from 'react';

import { UserRole } from './types';

const adminId = '42949672973'; // TODO: move it to secrets.json
const developerId = '42949672973'; // TODO: move it to secrets.json

export default function useUserRoles(user?: User): UserRole[] {
  const current = useCurrentUser();
  user = useMemo(() => {
    return user ?? current;
  }, [user, current]);
  return useMemo(() => {
    const roles: UserRole[] = [];
    if (user?.id === adminId) {
      roles.push('admin');
    }
    if (user?.id === developerId) {
      roles.push('developer');
    }
    if (typeof user?.id === 'string') {
      roles.push('user');
    }
    // TODO: fcmember
    if (roles.length === 0) {
      roles.push('guest');
    }
    return roles;
  }, [user]);
}
