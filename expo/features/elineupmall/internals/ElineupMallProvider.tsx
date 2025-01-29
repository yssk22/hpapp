import { useCurrentUser, useUPFCConfig, useUserConfig } from '@hpapp/features/app/settings';
import {
  ElineupMallSiteScraper,
  ElineupMallHttpFetcher,
  ElineupMallOrder,
  ElineupMallOrderDetail,
  ElineupMallSiteAuthError
} from '@hpapp/features/elineupmall/scraper/';
import { UPFCDemoScraper } from '@hpapp/features/upfc/scraper';
import * as date from '@hpapp/foundation/date';
import { isEmpty } from '@hpapp/foundation/string';
import { logEvent } from '@hpapp/system/firebase';
import * as logging from '@hpapp/system/logging';
import CookieManager from '@react-native-cookies/cookies';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { commitMutation, graphql, useRelayEnvironment } from 'react-relay';
import { IEnvironment } from 'relay-runtime';

import { ElineupMallProviderUpsertPurchaseHistoryMutation } from './__generated__/ElineupMallProviderUpsertPurchaseHistoryMutation.graphql';

export type ElineupMallPurchaseHistoryItem = ElineupMallOrderDetail & { order: ElineupMallOrder };

/**
 * ElineupMallStatus represents the status of the scraper.
 */
export type ElineupMallStatus =
  | 'initialized'
  | 'ready'
  | 'loading_purchase_history'
  | 'loading_cart'
  | 'adding_to_cart'
  | 'removing_from_cart'
  | 'error_not_opted_in'
  | 'error_upfc_is_empty'
  | 'error_authenticate'
  | 'error_unknown';

export interface ElineupMallContext {
  status: ElineupMallStatus;
  purchaseHistory: Map<string, ElineupMallPurchaseHistoryItem> | null;
  cart: Map<string, ElineupMallOrderDetail> | null;
  reload: () => void;
  addToCart: (link: string) => Promise<boolean>;
  removeFromCart: (orderDetail: ElineupMallOrderDetail) => Promise<boolean>;
}

const contextObj = createContext<ElineupMallContext>({
  status: 'initialized',
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

export default function ElineupMallScraperProvider({ children }: { children: React.ReactElement }) {
  const Provider = contextObj.Provider;
  const [status, setStatus] = useState<ElineupMallStatus>('initialized');
  const [purchaseHistory, setPurchaseHistory] = useState<Map<string, ElineupMallPurchaseHistoryItem> | null>(null);
  const [cart, setCart] = useState<Map<string, ElineupMallOrderDetail> | null>(null);
  const userConfig = useUserConfig();
  const upfcConfig = useUPFCConfig();
  const scraper = useMemo(() => {
    return new ElineupMallSiteScraper(
      upfcConfig?.hpUsername ?? '',
      upfcConfig?.hpPassword ?? '',
      new ElineupMallHttpFetcher()
    );
  }, [upfcConfig?.hpUsername, upfcConfig?.hpPassword]);

  const env = useRelayEnvironment();
  const userId = useCurrentUser()!.id;

  const fetchPurchaseHistory = async (nextStatus: ElineupMallStatus = 'ready') => {
    try {
      const from = date.addDate(date.getToday(), -180, 'day');
      const [orderList, err] = await scraper.getOrderList(from);
      if (orderList === undefined) {
        if (err instanceof ElineupMallSiteAuthError) {
          setStatus('error_authenticate');
        } else {
          setStatus('error_unknown');
        }
        return false;
      }
      logEvent('elineupmall_authenticate', {
        feature: 'elineupmall'
      });
      const map = new Map<string, ElineupMallPurchaseHistoryItem>();
      for (const order of orderList!) {
        for (const detail of order.details) {
          map.set(detail.link, { ...detail, order });
        }
      }
      setPurchaseHistory(map);
      logging.Info(
        'features.elineupmall.scraper.internals.ElineupMallScraperProvider.fetchPurchaseHistory',
        'completed',
        {
          num: orderList!.length
        }
      );
      // do not await the promise since we don't care if server sync succeeds or not.
      syncToServer(env, userId, orderList!);
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
      const [cart, err] = await scraper.getCart();
      if (cart === undefined) {
        if (err instanceof ElineupMallSiteAuthError) {
          setStatus('error_authenticate');
        } else {
          setStatus('error_unknown');
        }
        return false;
      }
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
    try {
      setStatus('adding_to_cart');
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
    logEvent('elineupmall_add_to_cart', {
      feature: 'elineupmall',
      link
    });
    return true;
  };
  const removeFromCart = async (orderDetail: ElineupMallOrderDetail) => {
    try {
      setStatus('adding_to_cart');
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
      if (
        isEmpty(upfcConfig?.hpUsername) ||
        isEmpty(upfcConfig?.hpPassword) ||
        upfcConfig?.hpUsername === UPFCDemoScraper.Username
      ) {
        setStatus('error_upfc_is_empty');
        return;
      }
      // TODO: clear cookies only for elineupmall.com
      setStatus('loading_purchase_history');
      await CookieManager.clearAll();
      const ok = await fetchPurchaseHistory('loading_cart');
      if (!ok) {
        return false;
      }
      return await fetchCart('ready');
    })();
  };
  useEffect(() => {
    reload();
  }, [userConfig?.elineupmallFetchPurchaseHistory, upfcConfig?.hpUsername, upfcConfig?.hpPassword]);
  return <Provider value={{ status, purchaseHistory, cart, reload, addToCart, removeFromCart }}>{children}</Provider>;
}

export function useElineupMall() {
  return useContext(contextObj);
}

const ElineupMallProviderUpsertPurchaseHistoryMutationGraphQL = graphql`
  mutation ElineupMallProviderUpsertPurchaseHistoryMutation(
    $params: HPElineupMallItemPurchaseHistoryUpsertParamsInput!
  ) {
    me {
      upsertElineupmallPurchaseHistories(params: $params) {
        id
      }
    }
  }
`;

async function syncToServer(env: IEnvironment, userId: string, orderList: ElineupMallOrder[]): Promise<void> {
  const orders = orderList
    .map((order) => {
      return order.details.map((detail) => {
        return {
          orderId: order.id,
          permalink: detail.link,
          name: detail.name,
          price: detail.unitPrice,
          num: detail.num,
          orderedAt: date.toNullableQueryString(order.orderedAt)!
        };
      });
    })
    .flat();
  return new Promise((resolve) => {
    commitMutation<ElineupMallProviderUpsertPurchaseHistoryMutation>(env, {
      mutation: ElineupMallProviderUpsertPurchaseHistoryMutationGraphQL,
      variables: {
        params: {
          userId: parseInt(userId, 10),
          orders
        }
      },
      onCompleted: (response, errors) => {
        if (errors) {
          logging.Info('features.elineupmall.internals.ElineupMallProvider.syncToServer', 'failed', {
            numHistories: orders.length,
            error: errors.map((e) => e.message).join(',')
          });
        } else {
          logging.Info('features.elineupmall.internals.ElineupMallProvider.syncToServer', 'completed', {
            numHistories: orders.length
          });
        }
        resolve();
      },
      onError: (error) => {
        logging.Info('features.elineupmall.internals.ElineupMallProvider.syncToServer', 'failed', {
          numApplications: orders.length,
          error: error.message
        });
        resolve();
      }
    });
  });
}
