import { useUserConfig, useUserConfigUpdator } from '@hpapp/features/app/settings';
import { ConsentGate } from '@hpapp/features/common';
import { useNavigation } from '@hpapp/features/common/stack';
import { t } from '@hpapp/system/i18n';

import UPFCSettingsForm from './UPFCSettingsForm';

export default function UPFCSettingsScreenContainer() {
  const userConfig = useUserConfig();
  const updateUserConfig = useUserConfigUpdator();
  const navigation = useNavigation();
  return (
    <>
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
      >
        <UPFCSettingsForm
          onSave={() => {
            navigation.goBack();
          }}
        />
      </ConsentGate>
    </>
  );
}
