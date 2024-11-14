import { defineScreen, useScreenTitle } from '@hpapp/features/common/stack';
import { t } from '@hpapp/system/i18n';

import UPFCEventList from './internals/UPFCEventList';

export default defineScreen('/upfc/history/', function UPFCHistoryScreen({ current, previous }) {
  useScreenTitle(t('Event History'));
  return <UPFCEventList />;
});
