import { defineScreen, useScreenTitle } from '@hpapp/features/common/stack';
import { t } from '@hpapp/system/i18n';

import ElineupMallSettingsFollowings from './internal/settings/ElineupMallSettingsFollowings';

export default defineScreen('/elineupmall/settings/', function ElineupMallSettingsScreen() {
  useScreenTitle(t('Elineup Mall Settings'));
  return (
    <>
      <ElineupMallSettingsFollowings />
    </>
  );
});
