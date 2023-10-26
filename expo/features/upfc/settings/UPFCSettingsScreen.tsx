import { useSettings } from '@hpapp/contexts/settings';
import { LocalUserConfigurationSettings } from '@hpapp/contexts/settings/useLocalUserConfig';
import ConsentGate from '@hpapp/features/policy/ConsentGate';
import { defineScreen, useScreenTitle } from '@hpapp/features/root/protected/stack';
import UPFCSettingsForm from '@hpapp/features/upfc/settings/UPFCSettingsForm';
import { t } from '@hpapp/system/i18n';

export default defineScreen('/upfc/settings/', function UPFCSettingScreen() {
  useScreenTitle(t('FC Settings'));
  const [userConfig, setUserConfig] = useSettings(LocalUserConfigurationSettings);
  return (
    <>
      <ConsentGate
        showHeader={false}
        title={`${t('FC Data Policy')}`}
        moduleId={require('assets/policy/fcdata.html')}
        onConsent={() => {
          const cfg = userConfig!;
          cfg.consentOnUPFCDataPolicy = true;
          setUserConfig(cfg);
        }}
        pass={userConfig!.consentOnUPFCDataPolicy ?? false}
      >
        <UPFCSettingsForm />
      </ConsentGate>
    </>
  );
});
