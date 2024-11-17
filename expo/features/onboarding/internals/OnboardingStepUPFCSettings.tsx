import { useUserConfig, useUserConfigUpdator } from '@hpapp/features/app/settings';
import { ConsentGate } from '@hpapp/features/common';
import { UPFCSettingsForm } from '@hpapp/features/upfc';
import { t } from '@hpapp/system/i18n';

export type OnboardinStepUPCSettingsProps = {
  onSave: () => void;
};

export default function OnboardinStepUPCSettings({ onSave }: OnboardinStepUPCSettingsProps) {
  const userConfig = useUserConfig();
  const updateUserConfig = useUserConfigUpdator();
  return (
    <ConsentGate
      showHeader={false}
      title={`${t('FC Data Policy')}`}
      moduleId={require('assets/policy/fcdata.html')}
      onConsent={() => {
        const cfg = userConfig!;
        cfg.consentOnUPFCDataPolicy = true;
        updateUserConfig(cfg);
      }}
      pass={userConfig!.consentOnUPFCDataPolicy ?? false}
      containerStyle={{ height: 480 }}
    >
      <UPFCSettingsForm onSave={onSave} />
    </ConsentGate>
  );
}
