import { readFile } from "@hpapp/foundation/test_helper";

export default class FileFetcher {
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
    if (username != this.username || password != this.password) {
      return "";
    }
    return await readFile(this.paths.redirectPageHtmlPath);
  }

  async fetchEventApplicationsHtml(): Promise<string> {
    return await readFile(this.paths.openEventApplicationsHtmlPath);
  }

  async fetchExecEventApplicationsHtml(): Promise<string> {
    return await readFile(this.paths.openExecEventApplicationsHtmlPath);
  }

  async fetchTicketsHtml(): Promise<string> {
    return await readFile(this.paths.ticketsHtmlPath);
  }
}
