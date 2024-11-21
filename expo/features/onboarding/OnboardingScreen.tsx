import { useUserConfig, useUserConfigUpdator } from '@hpapp/features/app/settings';
import { defineScreen, useNavigation } from '@hpapp/features/common/stack';
import HomeScreen from '@hpapp/features/home/HomeScreen';
import { t } from '@hpapp/system/i18n';

import OnboardingStepFollowMembers from './internals/OnboardingStepFollowMembers';
import OnboardingStepProvider from './internals/OnboardingStepProvider';
import OnboardinStepUPCSettings from './internals/OnboardingStepUPFCSettings';

export default defineScreen('/onboarding/', function OnboardingScreen() {
  const navigation = useNavigation();
  const userConfig = useUserConfig();
  const userConfigUpdate = useUserConfigUpdator();
  return (
    <OnboardingStepProvider
      firstStep="followMembers"
      steps={{
        followMembers: {
          props: {
            title: t('Step 1: Follow Members'),
            description: [
              t('Tap members you want to follow to get blog and instagram updates.'),
              t('You can also subscribe e-LineUP!Mall goods for your following members.')
            ].join(' '),
            element: <OnboardingStepFollowMembers />
          },
          next: 'upfcSettings'
        },
        upfcSettings: {
          props: {
            title: t('Step 2: Set FC Credentails'),
            description: [
              t('You can manage your FC tickets in the app by provising your fan club credentails.'),
              t('Please read the data policy below and agree to it before you can proceed.'),
              t('You can skip this step to complete the initial settings.')
            ].join(' '),
            element: (
              <OnboardinStepUPCSettings
                onSave={() => {
                  userConfigUpdate({ ...userConfig!, completeOnboarding: true });
                  navigation.replace(HomeScreen);
                }}
              />
            )
          }
        }
      }}
    />
  );
});
