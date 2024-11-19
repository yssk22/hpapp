import { defineScreen, useScreenTitle } from '@hpapp/features/common/stack';
import { t } from '@hpapp/system/i18n';

import ThemeContainer from './internals/ThemeContainer';

export default defineScreen('/theme/', function ThemeScreen() {
  useScreenTitle(t('Theme Settings'));
  return <ThemeContainer />;
});
