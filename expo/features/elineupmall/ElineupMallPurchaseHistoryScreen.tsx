import { defineScreen, useScreenTitle } from '@hpapp/features/common/stack';
import { t } from '@hpapp/system/i18n';

import ElineupMallPurchaseHistoryList from './internals/ElineupMallPurchaseHistoryList';

export type UPFCWebViewScreenProps = {
  login?: boolean;
  uri: string;
};

export default defineScreen('/elineupmall/history/', function ElineupMallPurchaseHistoryScreen() {
  useScreenTitle(t('Elineup Mall Purchase History'));
  return <ElineupMallPurchaseHistoryList />;
});
