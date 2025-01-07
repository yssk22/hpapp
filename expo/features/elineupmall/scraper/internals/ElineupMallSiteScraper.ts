import TaskQueue, { TaskQueueResult } from '@hpapp/foundation/TaskQueue';
import { parse } from 'node-html-parser';

import { ElineupMallFetcher, ElineupMallOrder, ElineupMallOrderDetail, ElineupMallOrderStatus } from './types';

export class ElineupMallSiteAuthError extends Error {}

let countAuthError = 0;

/**
 * a ElineupMallSiteScraper scrape html for elineupmall.com
 */
export default class ElineupMallSiteScraper extends TaskQueue {
  private readonly username: string;
  private readonly password: string;
  private readonly fetcher: ElineupMallFetcher;

  constructor(username: string, password: string, fetcher: ElineupMallFetcher) {
    super();
    this.username = username;
    this.password = password;
    this.fetcher = fetcher;
  }

  private async authenticate(): Promise<void> {
    if (countAuthError > 3) {
      // In this case, IP address may be blocked if the app still tries to authenticate.
      // to avoid this, the app should stop trying to authenticate and users should authenticate via the normal browser and reboot the app to reset the count.
      throw new ElineupMallSiteAuthError('3 authentication errors happened with the accuont.');
    }
    let html = await this.fetcher.fetchTop();
    const root = parse(html);
    const loggedIn = root.querySelector('div.ty-dropdown-box__title')?.classList.contains('logged');
    if (!loggedIn) {
      html = await this.fetcher.postCredential(this.username, this.password);
      const root = parse(html);
      const text = root.querySelector('div.cm-notification-container')?.text;
      if (text === undefined) {
        countAuthError++;
        throw new ElineupMallSiteAuthError('failed to authenticate');
      }
      if (text.indexOf('ログインに成功') < 0) {
        countAuthError++;
        throw new ElineupMallSiteAuthError('failed to authenticate');
      }
    }
  }

  public async getOrderList(from: Date): Promise<TaskQueueResult<ElineupMallOrder[]>> {
    return this.enqueue(async () => {
      await this.authenticate();
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
    });
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

  public async getCart(): Promise<TaskQueueResult<ElineupMallOrder>> {
    return this.enqueue(async () => {
      await this.authenticate();
      const html = await this.fetcher.fetchCartHtml();
      const root = parse(html);
      const details: ElineupMallOrderDetail[] = root
        .querySelectorAll('table.ty-cart-content > tbody > tr')
        .map((row) => {
          const description = row.querySelector('td.ty-cart-content__description');
          const a = description?.querySelector('a.ty-cart-content__product-title') ?? null;
          const deleteA = description?.querySelector('a.ty-cart-content__product-delete') ?? null;
          if (a === null || deleteA === null) {
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
          const deleteLink = deleteA.getAttribute('href') ?? '';
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
            deleteLink,
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
    });
  }

  public async addToCart(link: string): Promise<TaskQueueResult<void>> {
    return this.enqueue(async () => {
      await this.authenticate();
      const params = new URLSearchParams();
      const html = await this.fetcher.fetch(link);
      const root = parse(html);
      const form = root.querySelector('div.ty-product-block__left > form');
      form?.querySelectorAll('input').forEach((input) => {
        params.set(input.attributes.name, input.attributes.value);
      });
      form?.querySelectorAll('select').forEach((select) => {
        params.set(select.attributes.name, select.attributes.value);
      });
      form?.querySelectorAll('button').forEach((button) => {
        params.set(button.attributes.name, '');
      });
      const resp = await fetch('https://www.elineupmall.com/', {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: params.toString(),
        credentials: 'include'
      });
      if (resp.status >= 400) {
        throw new Error('invalid response code: ' + resp.status);
      }
    });
  }

  public async removeFromCart(detail: ElineupMallOrderDetail): Promise<TaskQueueResult<void>> {
    return this.enqueue(async () => {
      await this.authenticate();
      if (detail.deleteLink === undefined) {
        throw new Error('delete link is not available');
      }
      const resp = await fetch(detail.deleteLink, {
        credentials: 'include'
      });
      if (resp.status >= 400) {
        throw new Error('invalid response code: ' + resp.status);
      }
    });
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
