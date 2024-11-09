import * as date from '@hpapp/foundation/date';

import { ErrUPFCAuthentication } from './errors';
import {
  UPFCScraper,
  UPFCEventApplication,
  UPFCEventApplicationTickets,
  UPFCFetcher,
  UPFCTicketApplicationStatus,
  UPFCSite
} from './types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsdom = require('jsdom-jscore-rn').jsdom;

/**
 * UPFCScraper implements UPFCScraper that scrapes html returned by up-fc.jp
 */
export default class UPFCSiteScraper implements UPFCScraper {
  private readonly fetcher: UPFCFetcher;

  constructor(fetcher: UPFCFetcher) {
    this.fetcher = fetcher;
  }

  /**
   * authenticate with up-fc.jp
   * @param username fan club number
   * @param password password
   * @returns
   */
  async authenticate(username: string, password: string, site: UPFCSite): Promise<boolean> {
    const html = await this.fetcher.postCredential(username, password, site);
    if (!this.parseRedirectPageHTML(html)) {
      throw new ErrUPFCAuthentication();
    }
    return true;
  }

  /**
   * @returns a list of event applications
   */
  async getEventApplications(site: UPFCSite): Promise<UPFCEventApplicationTickets[]> {
    const events = this.fetcher.fetchEventApplicationsHtml(site);
    const exeEvents = this.fetcher.fetchExecEventApplicationsHtml(site);
    const tickets = this.fetcher.fetchTicketsHtml(site);
    const [eventsHtml, execEventHtml, ticketsHtml] = await Promise.all([events, exeEvents, tickets]);
    return this.parseEventApplications(eventsHtml, execEventHtml, ticketsHtml, site);
  }

  parseRedirectPageHTML(text: string) {
    const doc = jsdom(text);
    const meta = doc.getElementsByTagName('meta');
    for (let i = 0; i < meta.length; i++) {
      const equiv = meta[i].getAttribute('http-equiv') as string | null;
      if (equiv && equiv.toLowerCase() === 'refresh') {
        const content = meta[i].getAttribute('content') as string | null;
        // eslint-disable-next-line quotes
        if (content && content.toLowerCase().indexOf('mypage01.php') >= 0) {
          return true;
        }
      }
    }
    return false;
  }

  parseEventApplications(
    eventsHtml: string,
    execEventHtml: string,
    ticketsHtml: string,
    site: UPFCSite
  ): UPFCEventApplicationTickets[] {
    const eventApplications = this.parseEventApplicationsHtml(eventsHtml, site);
    const execEventApplications = this.parseEventApplicationsHtml(execEventHtml, site);
    const ticketApplications = this.parseTicketsHtml(ticketsHtml, site);
    const result: UPFCEventApplicationTickets[] = [];
    const eventMap: Map<string, UPFCEventApplicationTickets> = new Map();
    const allApplications = eventApplications.concat(execEventApplications);
    allApplications.forEach((a) => {
      if (!eventMap.has(a.name)) {
        const eat = {
          ...a,
          tickets: []
        };
        eventMap.set(eat.name, eat);
        result.push(eat);
      }
    });
    ticketApplications.forEach((eat) => {
      if (eventMap.has(eat.name)) {
        const existing = eventMap.get(eat.name)!;
        const { tickets } = eat;
        existing.tickets = existing.tickets.concat(tickets);
      } else {
        // past ticket where the application is no longer available
        result.push(eat);
        eventMap.set(eat.name, eat);
      }
    });
    return result;
  }

  parseEventApplicationsHtml(text: string, site: UPFCSite): UPFCEventApplication[] {
    const doc = jsdom(text);
    const links = doc.querySelectorAll('div.contents-body a');
    if (links === null) {
      throw new Error('unexpected dom');
    }
    const applications: UPFCEventApplication[] = [];
    for (let i = 0; i < links.length; i++) {
      const availalble = this.parseEventApplicationLink(links[i], site);
      if (availalble) {
        applications.push(availalble);
      }
    }
    return applications;
  }

  parseTicketsHtml(text: string, site: UPFCSite): UPFCEventApplicationTickets[] {
    const doc = jsdom(text);
    const today = date.getToday();
    const content = doc.querySelector('div.mypage_contents');
    if (content === null) {
      return [];
    }
    const allApplications: UPFCEventApplicationTickets[] = [];
    const eventNameDOMs = content.querySelectorAll('dt');
    const eventAttrDOMs = content.querySelectorAll('dd');

    for (let i = 0; i < eventNameDOMs.length; i++) {
      const node = eventNameDOMs.item(i);
      const application: UPFCEventApplicationTickets = {
        name: this.parseEventApplicationName(node.innerHTML.trim()),
        site,
        tickets: []
      };
      const rows = eventAttrDOMs.item(i).querySelectorAll('table tr');
      for (let j = 0; j < rows.length; j++) {
        const r = rows[j];
        const cols = r.querySelectorAll('td');
        if (cols.length === 7) {
          const eventDate = this.parseEventDate(cols.item(0).innerHTML, cols.item(2).innerHTML.trim());
          const venue = cols
            .item(1)
            .innerHTML.replace('<br />', '')
            .split('\n')
            .map((s: string) => s.trim())
            .join(' ')
            .trim();
          const num = this.parseNumTickets(cols.item(3).innerHTML.trim());
          let status = this.parseTicketStatus(cols.item(4).innerHTML.trim());
          if (cols.item(5).innerHTML.trim().indexOf('入金日') > 0) {
            status = '入金済';
          }
          if (status === '入金待') {
            if (!application.paymentDueDate) {
              if (eventDate !== null && today.getTime() >= eventDate.startAt.getTime()) {
                status = '入金忘';
              }
            } else {
              if (today.getTime() > application.paymentDueDate.getTime()) {
                status = '入金忘';
              }
            }
          }
          if (eventDate !== null) {
            application.tickets.push({
              venue,
              openAt: eventDate.openAt,
              startAt: eventDate.startAt,
              status,
              num
            });
          }
        }
      }
      if (application.tickets.length > 0) {
        allApplications.push(application);
      }
    }
    return allApplications;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseEventApplicationLink(link: any, site: UPFCSite): UPFCEventApplication | null {
    const href = link.getAttribute('href');
    const titleSpan = link.querySelector('span');
    if (!href || !titleSpan) {
      return null;
    }
    if (href.match(/event_Event_Announce\.php/) === null && href.match(/fanticket_Tour_List\.php/) === null) {
      // not an event nor exe event.
      return null;
    }
    let match = href.match(/EventSet_ID=(\d+)/);
    let applicationID = match ? `ES_${match[1]}` : null;
    if (applicationID === null) {
      match = href.match(/DM_ID=(\d+)/);
      applicationID = match ? `DM_${match[1]}` : null;
    }

    const span = link.querySelector('span');
    if (!span) {
      return null;
    }
    const name = this.parseEventApplicationName(span.textContent.trim() as string);
    const spans = link.parentNode.children;
    let dateText = null;
    for (let j = 0; j < spans.length; j++) {
      const span = spans[j];
      if (span.textContent.indexOf('受付期間') >= 0) {
        dateText = span.textContent.trim();
        break;
      }
    }
    if (dateText === null) {
      return null;
    }
    const dates = this.parseEventApplicationDatesText(dateText);
    if (dates == null) {
      return null;
    }
    return {
      name,
      site,
      applicationID,
      ...dates
    };
  }

  private parseEventApplicationName(valueStr: string) {
    return valueStr.replace('■', '').trim();
  }

  private parseNumTickets(valueStr: string): number {
    const m = valueStr.match(/(\d+)\s*枚/);
    if (m !== null) {
      return parseInt(m[1], 10);
    }
    return 0;
  }

  private parseTicketStatus(valueStr: string): UPFCTicketApplicationStatus {
    if (valueStr.indexOf('申込済') >= 0) {
      return '申込済';
    }
    if (valueStr.indexOf('落選') >= 0) {
      return '落選';
    }
    if (valueStr.indexOf('当選') >= 0) {
      if (valueStr.indexOf('入金済') >= 0) {
        return '入金済';
      }
      return '入金待';
    }
    return '不明';
  }

  private parseEventApplicationDatesText(text: string) {
    let applicationDates: [Date, Date] | null = null;
    let paymentDates: [Date, Date] | null = null;
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.indexOf('受付期間') >= 0) {
        applicationDates = this.extractJPDates(line);
      } else if (line.indexOf('当落発表期間') >= 0) {
        paymentDates = this.extractJPDates(line);
      }
    }
    if (!applicationDates || !paymentDates) {
      return null;
    }
    return {
      applicationStartDate: applicationDates[0],
      applicationDueDate: applicationDates[1],
      paymentOpenDate: paymentDates[0],
      paymentDueDate: paymentDates[1]
    };
  }

  private parseEventDate(dateStr: string, timeStr: string) {
    dateStr = dateStr.trim();
    const dateMatch = dateStr.match(/(\d{4}\/\d{2}\s*\/\d{2})/);
    if (dateMatch !== null) {
      dateStr = dateMatch[1].toString().replace(' ', '').replace(/\//g, '-');
      const timeMatch = timeStr.match(/(\d{2}:\d{2})/g);
      if (timeMatch !== null) {
        if (timeMatch.length > 1) {
          return {
            openAt: new Date(dateStr + 'T' + timeMatch[0] + ':00+09:00'),
            startAt: new Date(dateStr + 'T' + timeMatch[1] + ':00+09:00')
          };
        }
        return {
          startAt: new Date(dateStr + 'T' + timeMatch[0] + ':00+09:00')
        };
      }
    }
    return null;
  }
  private static jpDateRegexp = /\s*\d{4}\s*年\s*\d{2}\s*月\s*\d{2}\s*日/g;

  private extractJPDates(text: string): [Date, Date] | null {
    const matches = text.match(UPFCSiteScraper.jpDateRegexp);
    const dates = matches?.map((m) => {
      const dateStr = m.replace(/\s*/g, '').replace('年', '-').replace('月', '-').replace('日', '');
      return new Date(dateStr + 'T00:00:00+09:00');
    });
    if (dates?.length !== 2) {
      return null;
    }
    return [dates[0], dates[1]];
  }
}

export { UPFCScraper };
