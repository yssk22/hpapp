import { defineScreen, useScreenTitle } from '@hpapp/features/common/stack';
import { t } from '@hpapp/system/i18n';

import HPSortHistoryList from './internals/HPSortHistoryList';

export default defineScreen('/hpsort/', function HPSortSceen() {
  useScreenTitle(t('Sort History'));
  return <HPSortHistoryList />;
});
