import { useAppConfig, useCurrentUser, useUserConfig, useUserConfigUpdator } from '@hpapp/features/app/settings';
import Storybook from '@hpapp/features/app/storybook';
import { UserRoot, UserRootProps } from '@hpapp/features/app/user';
import { useUserRoles } from '@hpapp/features/auth';
import { ConsentGate } from '@hpapp/features/common';
import { logEvent, updateUserProperties } from '@hpapp/system/firebase';
import { t } from '@hpapp/system/i18n';
import { registerDevMenuItems } from 'expo-dev-menu';
import { useEffect, useState } from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';

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
  const userConfig = useUserConfig()!;
  const userConfigUpdator = useUserConfigUpdator();
  const roles = useUserRoles();

  useEffect(() => {
    const properties = {
      admin: roles.admin.toString(),
      developer: roles.developer.toString(),
      user: roles.user.toString(),
      fcmember: roles.fcmember.toString(),
      guest: roles.guest.toString()
    };
    updateUserProperties(currentUser?.id ?? null, properties);
  }, [currentUser?.id, roles]);

  return (
    <RootSiblingParent>
      <AppConfigMoal isVisible={showAppConfigModal} onClose={() => setShowAppConfigModal(false)} />
      <ConsentGate
        title={t('Terms of Service')}
        showHeader
        moduleId={require('assets/policy/tos.html')}
        onConsent={() => {
          logEvent('accept_tos');
          userConfigUpdator({ ...userConfig, consentOnToS: !userConfig.consentOnToS });
        }}
        pass={userConfig!.consentOnToS ?? false}
      >
        <ConsentGate
          title={t('Privacy Policy')}
          showHeader
          moduleId={require('assets/policy/privacy.html')}
          onConsent={() => {
            logEvent('accept_privacy_policy');
            userConfigUpdator({ ...userConfig, consentOnPrivacy: !userConfig.consentOnPrivacy });
          }}
          pass={userConfig!.consentOnPrivacy ?? false}
        >
          {component}
        </ConsentGate>
      </ConsentGate>
    </RootSiblingParent>
  );
}
