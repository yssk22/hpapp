import ConsentGate from '@hpapp/features/policy/ConsentGate';
import { defineScreen, useNavigation, useScreenTitle } from '@hpapp/features/root/protected/stack';
import { useSettings } from '@hpapp/features/settings/context';
import { LocalUserConfigurationSettings } from '@hpapp/features/settings/context/useLocalUserConfig';
import UPFCSettingsForm from '@hpapp/features/upfc/settings/UPFCSettingsForm';
import { t } from '@hpapp/system/i18n';

export default defineScreen('/upfc/settings/', function UPFCSettingScreen() {
  useScreenTitle(t('FC Settings'));
  const [userConfig, setUserConfig] = useSettings(LocalUserConfigurationSettings);
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
          setUserConfig(cfg);
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
});
