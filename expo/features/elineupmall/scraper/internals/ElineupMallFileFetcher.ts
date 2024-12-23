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
  };

  constructor(paths: { authResultHTMLPath: string; orderListHTMLPath: string; orderDetailHTMLPath: string }) {
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

  async readFile(path: string): Promise<string> {
    try {
      return await readFile(path);
    } catch {
      return '';
    }
  }
}
