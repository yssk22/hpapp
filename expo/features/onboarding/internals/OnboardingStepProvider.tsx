import { useUserConfig, useUserConfigUpdator } from '@hpapp/features/app/settings';
import { useNavigation, useScreenTitle } from '@hpapp/features/common/stack';
import HomeScreen from '@hpapp/features/home/HomeScreen';
import { t } from '@hpapp/system/i18n';
import { useState } from 'react';

import OnboardingStep, { OnboardingStepProps } from './OnboardingStep';

export type OnboardingStepContainerProps = {
  firstStep: string;
  steps: {
    [key: string]: {
      props: OnboardingStepProps;
      next?: string;
    };
  };
};

export default function OnboardingStepContainer({ firstStep, steps }: OnboardingStepContainerProps) {
  useScreenTitle(t('Welcome to Hello!Fan App!'));
  const navigation = useNavigation();
  const userConfig = useUserConfig();
  const userConfigUpdate = useUserConfigUpdator();
  const [stack, setStack] = useState([firstStep]);
  return (
    <>
      {Object.keys(steps).map((k) => {
        if (k === stack[0]) {
          const { props, next } = steps[k];
          const onNextPress = next
            ? () => {
                if (props.onNextPress) {
                  props.onNextPress();
                }
                setStack((prev) => [next, ...prev]);
              }
            : () => {
                userConfigUpdate({ ...userConfig!, completeOnboarding: true });
                navigation.replace(HomeScreen);
              };
          const onBackPress = stack.length > 1 ? () => setStack((prev) => prev.slice(1)) : undefined;
          const nextText = next ? t('Next') : t('Complete');
          return (
            <OnboardingStep
              key={k}
              {...props}
              nextText={nextText}
              onNextPress={onNextPress}
              onBackPress={onBackPress}
            />
          );
        }
        return null;
      })}
    </>
  );
}