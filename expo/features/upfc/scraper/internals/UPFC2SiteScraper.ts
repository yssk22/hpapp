import { parse } from 'node-html-parser';

import { ErrUPFCAuthentication } from './errors';
import {
  UPFCScraper,
  UPFCEventApplication,
  UPFCEventApplicationTickets,
  UPFCFetcher,
  UPFCTicketApplicationStatus,
  UPFCSite,
  UPFCEventTicket
} from './types';

/**
 * UPFC2SiteScraper implements UPFCScraper that scrapes html returned by upfc.jp
 */
export default class UPFC2SiteScraper implements UPFCScraper {
  private readonly fetcher: UPFCFetcher;
  private username: string | undefined;
  private site: UPFCSite | undefined;

  constructor(fetcher: UPFCFetcher) {
    this.fetcher = fetcher;
  }

  /**
   * authenticate with upfc.jp
   * @param username fan club number
   * @param password password
   * @returns
   */
  async authenticate(username: string, password: string, site: UPFCSite): Promise<boolean> {
    const html = await this.fetcher.postCredential(username, password, site);
    if (!this.parseRedirectPageHTML(html)) {
      throw new ErrUPFCAuthentication();
    }
    this.username = username;
    this.site = site;
    return true;
  }

  /**
   * @returns a list of event applications
   */
  async getEventApplications(): Promise<UPFCEventApplicationTickets[]> {
    if (this.site === undefined) {
      throw new Error('not authenticated');
    }
    const events = this.fetcher.fetchEventApplicationsHtml(this.site!);
    const tickets = this.fetcher.fetchTicketsHtml(this.site!);
    const [eventsHtml, ticketsHtml] = await Promise.all([events, tickets]);
    return await this.parseEventApplications(eventsHtml, ticketsHtml);
  }

  parseRedirectPageHTML(text: string) {
    const doc = parse(text);
    const meta = doc.getElementsByTagName('title');
    // confirm login page is not displayed.
    if (meta.length === 1 && meta[0].innerHTML !== 'ログイン') {
      return true;
    }
    return false;
  }

  async parseEventApplications(eventsHtml: string, ticketsHtml: string): Promise<UPFCEventApplicationTickets[]> {
    // events avaialble on upfc.jp
    const events = await this.parseEventApplicationsHtml(eventsHtml);
    // tickets available on upfc.jp including past events
    const ticketApplications = await this.parseTicketsHtml(ticketsHtml);
    const result: UPFCEventApplicationTickets[] = [];
    const eventMap: Map<string, UPFCEventApplicationTickets> = new Map();

    // 1) convert all available events to a map and record to the result as UPFCEventApplicationTickets
    events.forEach((e) => {
      if (!eventMap.has(e.applicationID!)) {
        const eat = {
          ...e,
          tickets: []
        };
        eventMap.set(e.applicationID!, eat);
        result.push(eat);
      }
    });

    // 2) then fill the ticket innformation from ticketApplications
    //    if an event is not available in the eventMap, it means the event is no longer visible on upfc.jp
    //    but we can just push the ticketApplications to the result as a past event
    ticketApplications.forEach((a) => {
      if (eventMap.has(a.applicationID!)) {
        const existing = eventMap.get(a.applicationID!)!;
        existing.tickets = a.tickets;
      } else {
        result.push(a);
      }
    });
    return result;
  }

  async parseEventApplicationsHtml(text: string): Promise<UPFCEventApplication[]> {
    const doc = parse(text);
    const links = doc.querySelectorAll('li.p-list__li a');
    if (links === null) {
      return [];
    }
    const applications: UPFCEventApplication[] = [];
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const href = link.getAttribute('href');
      const titleH3 = link.querySelector('h3.event_ttl');
      if (!href || !titleH3) {
        continue;
      }
      const match = href.match(/event_info\.php\?@uid=(.+)/);
      if (match?.length !== 2) {
        continue;
      }
      applications.push({
        name: this.normalizeApplicationName(titleH3.textContent.trim()),
        site: this.site!,
        username: this.username!,
        applicationID: match![1]
      });
    }
    return (await Promise.all(
      applications.map(async (a) => {
        try {
          const applicationDetailHtml = await this.fetcher.fetchEventApplicationDetailHtml(
            this.site!,
            a.applicationID!
          );
          const details = this.parseEventApplicationDetailHtml(applicationDetailHtml);
          return {
            ...a,
            ...details
          };
        } catch {
          // ignore error as we need to debug anyway.
          return a;
        }
      })
    )) as UPFCEventApplicationTickets[];
  }

  parseEventApplicationDetailHtml(detailHtml: string): {
    applicationStartDate?: Date;
    applicationDueDate?: Date;
    paymentOpenDate?: Date;
    paymentDueDate?: Date;
  } {
    const obj: {
      applicationStartDate?: Date;
      applicationDueDate?: Date;
      paymentOpenDate?: Date;
      paymentDueDate?: Date;
    } = {};
    const dom = parse(detailHtml);
    const rows = dom.querySelectorAll('table tbody tr');
    if (rows === null) {
      return obj;
    }
    for (let i = 0; i < rows.length; i++) {
      const tr = rows[i];
      const th = tr.querySelector('th')?.textContent.trim();
      const text = tr.querySelector('td')?.textContent.trim();
      if (th === undefined || text === undefined) {
        continue;
      }
      const dates = this.parseApplicationDates(text);
      switch (th) {
        case '申込期間':
          if (dates !== null) {
            obj.applicationStartDate = dates[0];
            obj.applicationDueDate = dates[1];
          }
          break;
        case '当選・落選確認期間':
          if (dates !== null) {
            obj.paymentOpenDate = dates[0];
            obj.paymentDueDate = dates[1];
          }
          break;
      }
    }
    return obj;
  }

  async parseTicketsHtml(ticketsHtml: string): Promise<UPFCEventApplicationTickets[]> {
    const doc = parse(ticketsHtml);
    const links = doc.querySelectorAll('a');
    if (links === null) {
      return [];
    }

    const applicaions: UPFCEventApplication[] = [];
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const href = link.getAttribute('href');
      const titleH5 = link.querySelector('h5');
      if (!href || !titleH5) {
        continue;
      }
      const match = href.match(/event_payment\.php\?@uid=(.+)/);
      if (match?.length !== 2) {
        continue;
      }
      const applicationID = match[1];
      const applicationName = this.normalizeApplicationName(titleH5.textContent.trim());
      applicaions.push({
        name: applicationName,
        site: this.site!,
        username: this.username!,
        applicationID
      });
    }

    return (
      await Promise.all(
        applicaions.map(async (a) => {
          try {
            const ticketDetailHtml = await this.fetcher.fetchTicketDetailHtml(this.site!, a.applicationID!);
            const tickets = await this.parseTicketDetailHtml(ticketDetailHtml);
            return {
              ...a,
              tickets
            };
          } catch {
            // ignore error as we need to debug anyway.
            return null;
          }
        })
      )
    ).filter((a) => a !== null) as UPFCEventApplicationTickets[];
  }

  private parseApplicationDates(text: string): [Date, Date] | null {
    const m = text.match(
      /(?<start_y>\d{4})年(?<start_m>\d{1,2})月(?<start_d>\d{1,2})日（.+）(?<start_h>\d{1,2})時～(?<end_m>\d{1,2})月(?<end_d>\d{1,2})日（.+）(?<end_h>\d{1,2})時/
    );
    const groups = m?.groups;
    if (groups === undefined) {
      return null;
    }
    // NOTE: does upfc cover applications that run into the next year? probably no?
    return [
      new Date(
        `${groups.start_y}-${this.formatN(groups.start_m)}-${this.formatN(groups.start_d)}T${this.formatN(groups.start_m)}:00:00+09:00`
      ),
      new Date(
        `${groups.start_y}-${this.formatN(groups.end_m)}-${this.formatN(groups.end_d)}T${this.formatN(groups.end_m)}:00:00+09:00`
      )
    ];
  }

  private async parseTicketDetailHtml(detailHtml: string): Promise<UPFCEventTicket[]> {
    const tickets = [] as UPFCEventTicket[];
    const dom = parse(detailHtml);
    const rows = dom.querySelectorAll('table tbody tr');
    if (rows === null) {
      return [];
    }
    const paymentCompleted = dom.querySelector('div.order_number span.order_status')?.textContent.trim() === '入金完了';

    for (let i = 0; i < rows.length; i++) {
      const tr = rows[i];
      const status = this.parseTicketStatus(tr.querySelector('td.bingo ul li')!.textContent.trim(), paymentCompleted);
      const show = this.parseTicketShow(tr.querySelector('td.show')!.textContent.trim());
      const num = this.parseNumTickets(tr.querySelector('td.ticket')!.textContent.trim());
      if (show === null) {
        continue;
      }
      tickets.push({
        status,
        num,
        ...show
      });
    }
    return tickets;
  }

  private normalizeApplicationName(valueStr: string) {
    // upfc sometimes use different characters for the same character
    // モーニング娘。'24 (correct) vs モーニング娘。’24 (incorrect)
    return valueStr.replace('■', '').replace('\u2019', "'").trim();
  }

  private parseTicketStatus(valueStr: string, paymentCompleted: boolean): UPFCTicketApplicationStatus {
    if (valueStr.indexOf('抽選前') >= 0) {
      return '抽選前';
    }
    if (valueStr.indexOf('落選') >= 0) {
      return '落選';
    }
    if (valueStr.indexOf('当選') >= 0) {
      if (paymentCompleted) {
        return '入金済';
      }
      return '入金待';
    }
    return '不明';
  }

  private parseNumTickets(valueStr: string): number {
    const m = valueStr.match(/(\d+)\s*枚/);
    if (m !== null) {
      return parseInt(m[1], 10);
    }
    return 0;
  }

  private parseTicketShow(valueStr: string): { venue: string; startAt: Date; openAt: Date } | null {
    const m1 = valueStr.match(
      /(?<date_y>\d{4})\.(?<date_m>\d{1,2})\.(?<date_d>\d{1,2})（(.+)）\s+(?<location>[^:]+):(?<venue>[^\s]+)/
    );
    const m2 = valueStr.match(/開場(?<open_time>\d{2}:\d{2})\s+開演(?<start_time>\d{2}:\d{2})/);
    const g1 = m1?.groups;
    const g2 = m2?.groups;
    if (g1 === undefined || g2 === undefined) {
      return null;
    }
    return {
      // we keep "location venue" format, which was used in up-fc.jp.
      venue: `${g1.location} ${g1.venue}`,
      startAt: new Date(`${g1.date_y}-${this.formatN(g1.date_m)}-${this.formatN(g1.date_d)}T${g2.start_time}:00+09:00`),
      openAt: new Date(`${g1.date_y}-${this.formatN(g1.date_m)}-${this.formatN(g1.date_d)}T${g2.open_time}:00+09:00`)
    };
  }

  private formatN(n: string): string {
    if (n.length === 1) {
      return `0${n}`;
    }
    return n;
  }
}

export { UPFCScraper };
