import { UPFCEventApplicationTickets, UPFCScraper, UPFCSite } from './types';

/**
 * UPFCCombiedSiteScraper implements UPFCScraper with multiple scraper instances.
 */
export default class UPFCCombiedSiteScraper implements UPFCScraper {
  scrapers: UPFCScraper[];

  constructor(scrapers: UPFCScraper[]) {
    this.scrapers = scrapers;
  }

  public async authenticate(username: string, password: string, site: UPFCSite): Promise<boolean> {
    const results = await Promise.all(this.scrapers.map((s) => s.authenticate(username, password, site)));
    // some scraper may fail but ignore if at least one succeeded
    return results.some((r) => r === true);
  }

  public async getEventApplications(): Promise<UPFCEventApplicationTickets[]> {
    const results = await Promise.all(this.scrapers.map((s) => s.getEventApplications()));
    return results.flat();
  }
}
