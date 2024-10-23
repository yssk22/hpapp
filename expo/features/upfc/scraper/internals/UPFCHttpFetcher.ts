import { ErrUPFCInvalidStatusCode } from './errors';
import { UPFCFetcher, UPFCSite } from './types';

/**
 * a UPFCFetcher fetches html from up-fc.jp
 */
export default class UPFCHttpFetcher implements UPFCFetcher {
  /**
   * post a credential to up-fc.jp
   * @param username
   * @param password
   * @returns
   */
  async postCredential(username: string, password: string, site: UPFCSite): Promise<string> {
    const url = `https://www.up-fc.jp/${site}/fanclub_Login.php`;

    await this.fetch(url); // dummy request to generate session
    const params = new URLSearchParams();
    params.append('User_No', username);
    params.append('User_LoginPassword', password);
    params.append('pp', 'OK');
    params.append('@Control_Name@', '認証');
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
    return await this.fetch(`https://www.up-fc.jp/${site}/event_Event_SetList.php`);
  }

  async fetchExecEventApplicationsHtml(site: UPFCSite): Promise<string> {
    return await this.fetch(`https://www.up-fc.jp/${site}/fanticket_DM_List.php`);
  }

  async fetchTicketsHtml(site: UPFCSite): Promise<string> {
    return await this.fetch(`https://www.up-fc.jp/${site}/mypage02.php`);
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
}
