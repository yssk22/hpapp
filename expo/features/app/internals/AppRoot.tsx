import { useAppConfig, useCurrentUser } from '@hpapp/features/app/settings';
import Storybook from '@hpapp/features/app/storybook';
import { UserRoot, UserRootProps } from '@hpapp/features/app/user';
import { registerDevMenuItems } from 'expo-dev-menu';
import { useEffect, useState } from 'react';

import AppConfigMoal from './AppConfigModal';
import AppRootGuest from './AppRootGuest';

export type AppRootProps = UserRootProps;

export default function AppRoot(props?: UserRootProps) {
  const appConfig = useAppConfig();
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
  const component = appConfig.useStorybook ? <Storybook /> : currentUser ? <UserRoot {...props} /> : <AppRootGuest />;
  return (
    <>
      <AppConfigMoal isVisible={showAppConfigModal} onClose={() => setShowAppConfigModal(false)} />
      {component}
    </>
  );
}
