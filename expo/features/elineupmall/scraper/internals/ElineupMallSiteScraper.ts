import { parse } from 'node-html-parser';

import {
  ElineupMallFetcher,
  ElineupMallOrder,
  ElineupMallOrderDetail,
  ElineupMallOrderStatus,
  ElineupMallScraper
} from './types';

/**
 * a ElineupMallSiteScraper scrape html for elineupmall.com
 */
export default class ElineupMallSiteScraper implements ElineupMallScraper {
  private readonly fetcher: ElineupMallFetcher;

  constructor(fetcher: ElineupMallFetcher) {
    this.fetcher = fetcher;
  }

  public async authenticate(username: string, password: string): Promise<boolean> {
    const html = await this.fetcher.postCredential(username, password);
    const root = parse(html);
    const text = root.querySelector('div.cm-notification-container')?.text;
    if (text === undefined) {
      return false;
    }
    return text.indexOf('ログインに成功') >= 0;
  }

  public async getOrderList(from: Date): Promise<ElineupMallOrder[]> {
    const html = await this.fetcher.fetchOrderListHtml(1);
    const root = parse(html);
    let orders = root.querySelectorAll('table.ty-orders-search > tr').map((row) => {
      const id = row.querySelector('td:nth-child(1)')?.text.trim().replace('#', '');
      const status = toOrderStatus(row.querySelector('td:nth-child(2)')?.text.trim());
      const orderedAt = new Date(
        row.querySelector('td:nth-child(4)')?.text.trim().replaceAll('/', '-').replace(', ', 'T') + ':00+09:00'
      );
      return {
        id: id ?? '',
        status,
        orderedAt,
        details: []
      } as ElineupMallOrder;
    });
    orders = orders.filter((order) => {
      return order.id !== '' && order.status !== 'unknown' && order.orderedAt.getTime() >= from.getTime();
    });
    orders = await Promise.all(
      orders.map(async (o) => {
        o.details = await this.fetchOrderDetail(o.id);
        return o;
      })
    );
    return orders.filter((order) => order.details?.length > 0);
  }

  private async fetchOrderDetail(id: string): Promise<ElineupMallOrderDetail[]> {
    const html = await this.fetcher.fetchOrderDetailHtml(id);
    const root = parse(html);
    const details: ElineupMallOrderDetail[] = root.querySelectorAll('table.ty-orders-detail__table> tr').map((row) => {
      const a = row.querySelector('td:nth-child(1) > a');
      if (a === null) {
        return {
          name: '',
          num: 0,
          link: '',
          code: '',
          unitPrice: 0,
          totalPrice: 0
        };
      }
      const name = a.text.trim();
      const link = a.getAttribute('href') ?? '';
      const code =
        row
          .querySelector('td:nth-child(1) > div.ty-orders-detail__table-code')
          ?.text.replaceAll('&nbsp;', '')
          .replace('コード:', '')
          .trim() ?? '';
      const unitPrice = parseInt(
        row
          .querySelector('td:nth-child(2)')
          ?.text.replaceAll('&nbsp;', '')
          .replaceAll(',', '')
          .replace('円', '')
          .trim() ?? '0',
        10
      );
      const num = parseInt(row.querySelector('td:nth-child(3)')?.text.replaceAll('&nbsp;', '').trim() ?? '0', 10);
      return {
        name,
        num,
        link,
        code,
        unitPrice,
        totalPrice: unitPrice * num
      };
    });
    return details.filter((d) => {
      return d.name !== '' && d.num > 0 && d.unitPrice > 0;
    });
  }

  public async getCart(): Promise<ElineupMallOrder> {
    const html = await this.fetcher.fetchCartHtml();
    const root = parse(html);
    const details: ElineupMallOrderDetail[] = root.querySelectorAll('table.ty-cart-content > tbody > tr').map((row) => {
      const description = row.querySelector('td.ty-cart-content__description');
      const a = description?.querySelector('a.ty-cart-content__product-title');
      if (a === null || a === undefined) {
        return {
          name: '',
          num: 0,
          link: '',
          code: '',
          unitPrice: 0,
          totalPrice: 0
        };
      }
      const name = a.innerHTML.trim();
      const link = a.getAttribute('href') ?? '';
      const code =
        description?.querySelector('div.ty-cart-content__sku > span')?.text.replaceAll('&nbsp;', '').trim() ?? '';
      const unitPriceText = row.querySelector('td.ty-cart-content__price > span')?.text.replaceAll(',', '');
      const unitPrice = parseInt(unitPriceText ?? '0', 10);
      const qtyInput = row.querySelector('td.ty-cart-content__qty input.ty-value-changer__input');
      const num = parseInt(qtyInput?.getAttribute('value') ?? '0', 10);
      return {
        name,
        num,
        link,
        code,
        unitPrice,
        totalPrice: unitPrice * num
      };
    });

    return {
      id: 'cart',
      status: 'cart',
      orderedAt: new Date(),
      details
    };
  }
}

function toOrderStatus(statusString: string | undefined): ElineupMallOrderStatus {
  switch (statusString) {
    case '支払い確認済み':
      return 'payment_confirmed';
    case '発送済み':
      return 'shipped';
    case '注文受付':
      return 'ordered';
    case '失敗':
      return 'failed';
    case '拒否':
      return 'denied';
    case '在庫切れ':
      return 'out_of_stock';
    case 'キャンセル':
      return 'canceled';
    case '注文未処理':
      return 'unprocessed';
    default:
      return 'unknown';
  }
}
