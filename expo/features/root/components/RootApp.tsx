import AppConfigMoal from '@hpapp/features/appconfig/AppConfigModal';
import { useCurrentUser } from '@hpapp/features/auth';
import GuestRoot from '@hpapp/features/root/internals/GuestRoot';
import RootContainer from '@hpapp/features/root/internals/RootContainer';
import ProtectedRoot from '@hpapp/features/root/internals/protected/ProtectedRoot';
import { ScreenList } from '@hpapp/features/root/internals/protected/stack';
import Screens from '@hpapp/generated/Screens';
import { registerDevMenuItems } from 'expo-dev-menu';
import { useEffect, useState } from 'react';

function UserRoot({ screens }: { screens: ScreenList }) {
  const [user, setUser] = useCurrentUser();
  if (user) {
    return <ProtectedRoot screens={screens} />;
  }
  return <GuestRoot onAuthenticated={setUser} />;
}

export default function RootApp() {
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
    <RootContainer>
      <AppConfigMoal isVisible={showAppConfigModal} onClose={() => setShowAppConfigModal(false)} />
      <UserRoot screens={Screens as ScreenList} />
    </RootContainer>
  );
}
