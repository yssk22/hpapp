import { useCurrentUserUpdator } from '@hpapp/features/app/settings';
import { useCallback } from 'react';

import AuthFirebaseLoginContainer from './internals/AuthFirebaseLoginContainer';
import AuthGateByRole from './internals/AuthGateByRole';
import AuthLocalLoginContainer from './internals/AuthLocalLoginContainer';
import { UserRole } from './internals/types';
import useUserRoles from './internals/useUserRoles';

export { AuthGateByRole, AuthFirebaseLoginContainer, AuthLocalLoginContainer, useUserRoles, UserRole };

export function useLogout() {
  const update = useCurrentUserUpdator();
  return useCallback(async () => {
    return update(null);
  }, [update]);
}
