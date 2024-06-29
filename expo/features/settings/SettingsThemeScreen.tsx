import { defineScreen, useScreenTitle } from '@hpapp/features/common/stack';
import { t } from '@hpapp/system/i18n';

export default defineScreen('/settings/theme/', function SettingsThemeContainer() {
  useScreenTitle(t('Theme Settings'));
  return <SettingsThemeContainer />;
});
