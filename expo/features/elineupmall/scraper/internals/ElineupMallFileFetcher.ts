import { readFile } from '@hpapp/foundation/test_helper';

import { ElineupMallFetcher } from './types';

/**
 * an ElineupMallFileFetcher fetches HTML files from the file system.
 */
export default class ElineupMallFileFetcher implements ElineupMallFetcher {
  private paths: {
    authResultHTMLPath: string;
    orderListHTMLPath: string;
    orderDetailHTMLPath: string;
    cartHTMLPath: string;
  };

  constructor(paths: {
    authResultHTMLPath: string;
    orderListHTMLPath: string;
    orderDetailHTMLPath: string;
    cartHTMLPath: string;
  }) {
    this.paths = paths;
  }

  async postCredential(username: string, password: string): Promise<string> {
    return await this.readFile(this.paths.authResultHTMLPath);
  }

  async fetchOrderListHtml(page: number): Promise<string> {
    return await this.readFile(this.paths.orderListHTMLPath);
  }

  async fetchOrderDetailHtml(id: string): Promise<string> {
    return await this.readFile(this.paths.orderDetailHTMLPath);
  }

  async fetchCartHtml(): Promise<string> {
    return await this.readFile(this.paths.cartHTMLPath);
  }

  async fetch(link: string): Promise<string> {
    // we do not mock this since testing on UI.
    throw new Error('not implemented');
  }

  async readFile(path: string): Promise<string> {
    try {
      return await readFile(path);
    } catch {
      return '';
    }
  }
}
