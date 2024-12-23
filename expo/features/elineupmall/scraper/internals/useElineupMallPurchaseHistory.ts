import { useUPFCConfig, useUserConfig } from '@hpapp/features/app/settings';
import * as date from '@hpapp/foundation/date';
import { isEmpty } from '@hpapp/foundation/string';
import * as logging from '@hpapp/system/logging';
import { useEffect, useMemo, useState } from 'react';

import ElineupMallHttpFetcher from './ElineupMallHttpFetcher';
import ElineupMallSiteScraper from './ElineupMallSiteScraper';
import { ElineupMallOrder, ElineupMallOrderDetail } from './types';

export type ElineupMallPurchaseHistoryItem = ElineupMallOrderDetail & { order: ElineupMallOrder };

export type ElineupMallPurchaseHistoryLoadingStatus =
  | 'loaded'
  | 'loading'
  | 'error_not_opted_in'
  | 'error_upfc_is_empty'
  | 'error_fetch';

const scraper = new ElineupMallSiteScraper(new ElineupMallHttpFetcher());

export default function useElineupMallPurchaseHistory(): [
  Map<string, ElineupMallOrderDetail>,
  ElineupMallPurchaseHistoryLoadingStatus
] {
  const [history, setHistory] = useState<ElineupMallOrder[]>([]);
  const [status, setStatus] = useState<ElineupMallPurchaseHistoryLoadingStatus>('loaded');
  const userConfig = useUserConfig();
  const upfcConfig = useUPFCConfig();
  useEffect(() => {
    if (!userConfig?.elineupmallFetchPurchaseHistory) {
      setStatus('error_not_opted_in');
      return;
    }
    if (isEmpty(upfcConfig?.hpUsername) || isEmpty(upfcConfig?.hpPassword)) {
      setStatus('error_upfc_is_empty');
    }
    setStatus('loading');
    (async () => {
      try {
        scraper.authenticate(upfcConfig!.hpUsername!, upfcConfig!.hpPassword!);
        const from = date.addDate(date.getToday(), -180, 'day');
        const orderList = await scraper.getOrderList(from);
        logging.Info('features.elineupmall.scraper.internals.useElineupMallPurshaseHistory', 'completed', {
          num: orderList.length
        });
        // TODO: sync with server
        setHistory(orderList);
        setStatus('loaded');
      } catch (e: unknown) {
        logging.Info('features.elineupmall.scraper.internals.useElineupMallPurshaseHistory', 'failed', {
          error: (e as any).toString()
        });
        setStatus('error_fetch');
      }
    })();
  }, [userConfig?.elineupmallFetchPurchaseHistory, upfcConfig?.hpUsername, upfcConfig?.hpPassword]);
  const historyMap = useMemo(() => {
    const map = new Map<string, ElineupMallPurchaseHistoryItem>();
    for (const order of history) {
      for (const detail of order.details) {
        map.set(detail.link, { ...detail, order });
      }
    }
    return map;
  }, [history]);
  return [historyMap, status];
}
