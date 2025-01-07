import { useUPFCConfig, useUserConfig } from '@hpapp/features/app/settings';
import * as date from '@hpapp/foundation/date';
import { isEmpty } from '@hpapp/foundation/string';
import * as logging from '@hpapp/system/logging';
import { createContext, useContext, useEffect, useState } from 'react';

import { ElineupMallSiteScraper, ElineupMallHttpFetcher, ElineupMallOrder, ElineupMallOrderDetail } from '../scraper/';

export type ElineupMallPurchaseHistoryItem = ElineupMallOrderDetail & { order: ElineupMallOrder };

/**
 * ElineupMallStatus represents the status of the scraper.
 */
export type ElineupMallStatus =
  | 'initialized'
  | 'ready'
  | 'authenticating'
  | 'loading_purchase_history'
  | 'loading_cart'
  | 'adding_to_cart'
  | 'removing_from_cart'
  | 'error_not_opted_in'
  | 'error_upfc_is_empty'
  | 'error_authenticate'
  | 'error_unknown';

const scraper = new ElineupMallSiteScraper(new ElineupMallHttpFetcher());

export interface ElineupMallContext {
  status: ElineupMallStatus;
  lastAuthenticationTimestamp: Date | null;
  purchaseHistory: Map<string, ElineupMallPurchaseHistoryItem> | null;
  cart: Map<string, ElineupMallOrderDetail> | null;
  reload: () => void;
  addToCart: (link: string) => Promise<boolean>;
  removeFromCart: (orderDetail: ElineupMallOrderDetail) => Promise<boolean>;
}

const contextObj = createContext<ElineupMallContext>({
  status: 'initialized',
  lastAuthenticationTimestamp: null,
  purchaseHistory: null,
  cart: null,
  reload: () => {},
  addToCart: async (link: string) => {
    return false;
  },
  removeFromCart: async (orderDetail: ElineupMallOrderDetail) => {
    return false;
  }
});

const AUTHENTICATE_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes to reauth

export default function ElineupMallScraperProvider({ children }: { children: React.ReactElement }) {
  const Provider = contextObj.Provider;
  const [status, setStatus] = useState<ElineupMallStatus>('initialized');
  const [lastAuthenticationTimestamp, setLastAuthenticationTimestamp] = useState<Date | null>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<Map<string, ElineupMallPurchaseHistoryItem> | null>(null);
  const [cart, setCart] = useState<Map<string, ElineupMallOrderDetail> | null>(null);
  const userConfig = useUserConfig();
  const upfcConfig = useUPFCConfig();
  const authenticate = async (nextStatus: ElineupMallStatus = 'ready') => {
    const now = new Date();
    if (lastAuthenticationTimestamp !== null) {
      const diff = now.getTime() - lastAuthenticationTimestamp.getTime();
      if (diff < AUTHENTICATE_INTERVAL_MS) {
        setStatus(nextStatus);
        return true;
      }
    }
    setStatus('authenticating');
    const ok = await scraper.authenticate(upfcConfig!.hpUsername!, upfcConfig!.hpPassword!);
    if (!ok) {
      setStatus('error_authenticate');
      return false;
    }
    logging.Info('features.elineupmall.scraper.internals.ElineupMallScraperProvider.authnticate', 'completed', {});
    setLastAuthenticationTimestamp(new Date());
    setStatus(nextStatus);
    return true;
  };
  const fetchPurchaseHistory = async (nextStatus: ElineupMallStatus = 'ready') => {
    try {
      const from = date.addDate(date.getToday(), -180, 'day');
      const orderList = await scraper.getOrderList(from);
      const map = new Map<string, ElineupMallPurchaseHistoryItem>();
      for (const order of orderList) {
        for (const detail of order.details) {
          map.set(detail.link, { ...detail, order });
        }
      }
      setPurchaseHistory(map);
      logging.Info(
        'features.elineupmall.scraper.internals.ElineupMallScraperProvider.fetchPurchaseHistory',
        'completed',
        {
          num: orderList.length
        }
      );
    } catch (e) {
      logging.Error('features.elineupmall.scraper.internals.ElineupMallScraperProvider.fetchPurchaseHistory', 'error', {
        error: (e as Error).toString()
      });
      setStatus('error_unknown');
      return false;
    }
    setStatus(nextStatus);
    return true;
  };
  const fetchCart = async (nextStatus: ElineupMallStatus = 'ready') => {
    try {
      const cart = await scraper.getCart();
      const map = new Map<string, ElineupMallOrderDetail>();
      for (const detail of cart.details) {
        map.set(detail.link, detail);
      }
      setCart(map);
      logging.Info('features.elineupmall.scraper.internals.ElineupMallScraperProvider.fetchCart', 'completed', {
        num: cart.details.length
      });
    } catch (e) {
      logging.Error('features.elineupmall.scraper.internals.ElineupMallScraperProvider.fetchCart', 'error', {
        error: (e as Error).toString()
      });
      setStatus('error_unknown');
      return false;
    }
    setStatus(nextStatus);
    return true;
  };
  const addToCart = async (link: string) => {
    const ok = await authenticate('adding_to_cart');
    if (!ok) {
      return false;
    }
    try {
      await scraper.addToCart(link);
      await fetchCart('ready');
      logging.Info('features.elineupmall.scraper.internals.ElineupMallScraperProvider.addToCart', 'completed', {
        link
      });
    } catch (e) {
      logging.Error('features.elineupmall.scraper.internals.ElineupMallScraperProvider.addToCart', 'error', {
        error: (e as Error).toString()
      });
      setStatus('ready');
      return false;
    }
    return true;
  };
  const removeFromCart = async (orderDetail: ElineupMallOrderDetail) => {
    const ok = await authenticate('removing_from_cart');
    if (!ok) {
      return false;
    }
    try {
      await scraper.removeFromCart(orderDetail);
      await fetchCart('ready');
      logging.Info('features.elineupmall.scraper.internals.ElineupMallScraperProvider.removeFromCart', 'completed', {
        orderDetail
      });
    } catch (e) {
      logging.Error('features.elineupmall.scraper.internals.ElineupMallScraperProvider.removeFromCart', 'error', {
        error: (e as Error).toString()
      });
      setStatus('ready');
      return false;
    }
    return true;
  };
  const reload = async () => {
    (async () => {
      if (!userConfig?.elineupmallFetchPurchaseHistory) {
        setStatus('error_not_opted_in');
        return;
      }
      if (isEmpty(upfcConfig?.hpUsername) || isEmpty(upfcConfig?.hpPassword)) {
        setStatus('error_upfc_is_empty');
      }
      let ok = await authenticate('loading_purchase_history');
      if (!ok) {
        return false;
      }
      ok = await fetchPurchaseHistory('loading_cart');
      if (!ok) {
        return false;
      }
      return await fetchCart('ready');
    })();
  };
  useEffect(() => {
    reload();
  }, [userConfig?.elineupmallFetchPurchaseHistory, upfcConfig?.hpUsername, upfcConfig?.hpPassword]);
  return (
    <Provider value={{ status, lastAuthenticationTimestamp, purchaseHistory, cart, reload, addToCart, removeFromCart }}>
      {children}
    </Provider>
  );
}

export function useElineupMall() {
  return useContext(contextObj);
}
