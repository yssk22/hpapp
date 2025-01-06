import { useUserConfig, useUserConfigUpdator } from '@hpapp/features/app/settings';
import { useNavigation } from '@hpapp/features/common/stack';
import HomeScreen from '@hpapp/features/home/HomeScreen';
import { logEvent } from '@hpapp/system/firebase';
import * as logging from 'system/logging';

export default function useCompleteOnboarding() {
  const navigation = useNavigation();
  const userConfig = useUserConfig();
  const userConfigUpdate = useUserConfigUpdator();
  return function completeOnboarding(params?: Record<string, any>) {
    userConfigUpdate({ ...userConfig!, completeOnboarding: true });
    logging.Info('features.onboarding.useCompleteOnboarding', 'onboarding completed', params);
    logEvent('onboarding_complete', params);
    navigation.replace(HomeScreen);
  };
}
