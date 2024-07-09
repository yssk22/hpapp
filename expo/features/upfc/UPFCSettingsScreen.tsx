import { defineScreen, useScreenTitle } from '@hpapp/features/common/stack';
import { t } from '@hpapp/system/i18n';

import UPFCSettingsScreenContainer from './internals/settings/UPFCSettingsScreenContainer';

export default defineScreen('/upfc/settings/', function UPFCSettingScreen() {
  useScreenTitle(t('FC Settings'));
  return <UPFCSettingsScreenContainer />;
});
