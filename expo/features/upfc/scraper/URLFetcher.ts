import { ErrInvalidStatusCode } from './types';

export default class URLFetcher {
  async postCredential(username: string, password: string): Promise<string> {
    const url = 'https://www.up-fc.jp/helloproject/fanclub_Login.php';
    await this.fetch(url); // dummy request to generate session

    const params = new URLSearchParams();
    params.append('User_No', username);
    params.append('User_LoginPassword', password);
    params.append('pp', 'OK');
    params.append('@Control_Name@', '認証');
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      body: params.toString(),
      credentials: 'include',
    });
    if (!resp.ok) {
      throw ErrInvalidStatusCode;
    }
    return await resp.text();
  }

  async fetchEventApplicationsHtml(): Promise<string> {
    return await this.fetch('https://www.up-fc.jp/helloproject/event_Event_SetList.php');
  }

  async fetchExecEventApplicationsHtml(): Promise<string> {
    return await this.fetch('https://www.up-fc.jp/helloproject/fanticket_DM_List.php');
  }

  async fetchTicketsHtml(): Promise<string> {
    return await this.fetch('https://www.up-fc.jp/helloproject/mypage02.php');
  }

  async fetch(url: string): Promise<string> {
    const resp = await fetch(url, {
      credentials: 'include',
    });
    if (!resp.ok) {
      throw ErrInvalidStatusCode;
    }
    const html = await resp.text();
    return html;
  }
}
