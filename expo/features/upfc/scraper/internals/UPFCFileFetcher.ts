import { readFile } from '@hpapp/foundation/test_helper';

/**
 * an UPFCFileFetcher fetches HTML files from the file system.
 */
export default class UPFCFileFetcher {
  private username: string;
  private password: string;
  private paths: {
    redirectPageHtmlPath: string;
    openEventApplicationsHtmlPath: string;
    openExecEventApplicationsHtmlPath: string;
    ticketsHtmlPath: string;
  };

  constructor(
    username: string,
    password: string,
    paths: {
      redirectPageHtmlPath: string;
      openEventApplicationsHtmlPath: string;
      openExecEventApplicationsHtmlPath: string;
      ticketsHtmlPath: string;
    }
  ) {
    this.username = username;
    this.password = password;
    this.paths = paths;
  }

  async postCredential(username: string, password: string): Promise<string> {
    if (username !== this.username || password !== this.password) {
      return '';
    }
    return await this.readFile(this.paths.redirectPageHtmlPath);
  }

  async fetchEventApplicationsHtml(): Promise<string> {
    return await this.readFile(this.paths.openEventApplicationsHtmlPath);
  }

  async fetchExecEventApplicationsHtml(): Promise<string> {
    return await this.readFile(this.paths.openExecEventApplicationsHtmlPath);
  }

  async fetchTicketsHtml(): Promise<string> {
    return await this.readFile(this.paths.ticketsHtmlPath);
  }

  async readFile(path: string): Promise<string> {
    try {
      return await readFile(path);
    } catch {
      return '';
    }
  }
}
