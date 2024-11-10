import { ErrUPFCInvalidStatusCode } from './errors';
import { UPFCFetcher, UPFCSite } from './types';

/**
 * a UPFCFetcher fetches html from up-fc.jp
 */
export default class UPFC2HttpFetcher implements UPFCFetcher {
  /**
   * post a credential to up-fc.jp
   * @param username
   * @param password
   * @returns
   */
  async postCredential(username: string, password: string, site: UPFCSite): Promise<string> {
    const url = `https://www.upfc.jp/${site}/login.php`;

    await this.fetch(url); // dummy request to generate session
    const params = new URLSearchParams();
    params.append('Member_No', username);
    params.append('Member_Password', password);
    params.append('@btn', 'login');
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      body: params.toString(),
      credentials: 'include'
    });
    if (!resp.ok) {
      throw new ErrUPFCInvalidStatusCode();
    }
    return await resp.text();
  }

  async fetchEventApplicationsHtml(site: UPFCSite): Promise<string> {
    return await this.fetch(`https://www.upfc.jp/${site}/event/event_list.php`);
  }

  async fetchExecEventApplicationsHtml(site: UPFCSite): Promise<string> {
    return ''; // no exec event specici page
  }

  async fetchTicketsHtml(site: UPFCSite): Promise<string> {
    return await this.postForm(`https://www.upfc.jp/${site}/mypage/mypage_event_entry_list.php`, 'category=event');
  }

  async fetchEventApplicationDetailHtml(site: UPFCSite, id: string): Promise<string> {
    return await this.fetch(`https://www.upfc.jp/${site}/event/event_info.php?@uid=${id}`);
  }

  async fetchTicketDetailHtml(site: UPFCSite, id: string): Promise<string> {
    return await this.fetch(`https://www.upfc.jp/${site}/mypage/event_payment.php?@uid=${id}`);
  }

  async fetch(url: string): Promise<string> {
    const resp = await fetch(url, {
      credentials: 'include'
    });
    if (!resp.ok) {
      throw new ErrUPFCInvalidStatusCode();
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
      throw new ErrUPFCInvalidStatusCode();
    }
    const html = await resp.text();
    return html;
  }
}
