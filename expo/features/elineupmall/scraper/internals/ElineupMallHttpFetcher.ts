import { ElineupMallFetcher } from './types';

/**
 * a ElineupMallHttpFetcher fetches html from elineupmall.com
 */
export default class ElineupMallHttpFetcher implements ElineupMallFetcher {
  /**
   * post a credential to up-fc.jp
   * @param username
   * @param password
   * @returns
   */
  async postCredential(username: string, password: string): Promise<string> {
    const url = `https://www.elineupmall.com/`;

    await this.fetch(url); // dummy request to generate session
    const params = new URLSearchParams();
    params.append('return_url', 'index.php');
    params.append('redirect_url', 'index.php');
    params.append('user_login', username);
    params.append('password', password);
    params.append('dispatch[auth.login]', '');
    params.append('remember_me', 'Y');
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      body: params.toString(),
      credentials: 'include'
    });
    return await resp.text();
  }

  async fetchOrderListHtml(page: number): Promise<string> {
    return await this.fetch(`https://www.elineupmall.com/orders/?page=${page}`);
  }

  async fetchOrderDetailHtml(id: string): Promise<string> {
    return await this.fetch(`https://www.elineupmall.com/index.php?dispatch=orders.details&order_id=${id}`);
  }

  async fetch(url: string): Promise<string> {
    const resp = await fetch(url, {
      credentials: 'include'
    });
    if (!resp.ok) {
      throw new Error('invalid response');
    }
    const html = await resp.text();
    return html;
  }

  async postForm(url: string, body: string): Promise<string> {
    const resp = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body,
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    });
    if (!resp.ok) {
      throw new Error('invalid response');
    }
    const html = await resp.text();
    return html;
  }
}
