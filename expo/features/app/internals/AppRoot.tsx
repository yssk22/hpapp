import { useCurrentUser } from '@hpapp/features/app/settings';
import { UserRoot, UserRootProps } from '@hpapp/features/app/user';
import { registerDevMenuItems } from 'expo-dev-menu';
import React, { useEffect, useState } from 'react';

import AppConfigMoal from './AppConfigModal';
import AppRootGuest from './AppRootGuest';

export type AppRootProps = UserRootProps;

export default function AppRoot(props?: UserRootProps) {
  const currentUser = useCurrentUser();
  const [showAppConfigModal, setShowAppConfigModal] = useState(false);
  useEffect(() => {
    registerDevMenuItems([
      {
        name: 'App Config',
        callback: () => setShowAppConfigModal(!showAppConfigModal)
      }
    ]);
  }, [showAppConfigModal, setShowAppConfigModal]);
  return (
    <>
      <AppConfigMoal isVisible={showAppConfigModal} onClose={() => setShowAppConfigModal(false)} />
      {currentUser ? <UserRoot {...props} /> : <AppRootGuest />}
    </>
  );
}
