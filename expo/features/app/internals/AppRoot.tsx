import { useAppConfig, useCurrentUser, useUserConfig, useUserConfigUpdator } from '@hpapp/features/app/settings';
import Storybook from '@hpapp/features/app/storybook';
import { UserRoot, UserRootProps } from '@hpapp/features/app/user';
import { ConsentGate } from '@hpapp/features/common';
import { t } from '@hpapp/system/i18n';
import { registerDevMenuItems } from 'expo-dev-menu';
import { useEffect, useState } from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
  return (
    <RootSiblingParent>
      <SafeAreaProvider testID="AppRoot.SafeAreaProvider">
        <AppConfigMoal isVisible={showAppConfigModal} onClose={() => setShowAppConfigModal(false)} />
        <ConsentGate
          title={t('Terms of Service')}
          showHeader
          moduleId={require('assets/policy/tos.html')}
          onConsent={() => {
            userConfigUpdator({ ...userConfig, consentOnToS: !userConfig.consentOnToS });
          }}
          pass={userConfig!.consentOnToS ?? false}
        >
          <ConsentGate
            title={t('Privacy Policy')}
            showHeader
            moduleId={require('assets/policy/privacy.html')}
            onConsent={() => {
              userConfigUpdator({ ...userConfig, consentOnPrivacy: !userConfig.consentOnPrivacy });
            }}
            pass={userConfig!.consentOnPrivacy ?? false}
          >
            {component}
          </ConsentGate>
        </ConsentGate>
      </SafeAreaProvider>
    </RootSiblingParent>
  );
}
