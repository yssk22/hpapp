import { UPFC2SiteScraper, UPFCEventApplicationTickets } from '@hpapp/features/upfc/scraper';
import { readFileAsJSON } from '@hpapp/foundation/test_helper';
import * as path from 'path';

import UPFCFileFetcher from './UPFCFileFetcher';

describe('UPFCSiteScraper', () => {
  describe('helloproject', () => {
    describe('getEventApplications', () => {
      it('should return all Applications listed in applications and mypage', async () => {
        const fetcher = new UPFCFileFetcher('mizuki', 'fukumura', {
          redirectPageHtmlPath: path.join(__dirname, './testdata/upfc2/valid-redirect.html'),
          openEventApplicationsHtmlPath: path.join(__dirname, './testdata/upfc2/valid-available-applications.html'),
          ticketsHtmlPath: path.join(__dirname, './testdata/upfc2/valid-tickets-page.html'),
          applicationDetailHtmlPath: path.join(__dirname, './testdata/upfc2/valid-available-application-detail.html'),
          ticketDetailHtmlPath: path.join(__dirname, './testdata/upfc2/valid-ticket-detail.html')
        });
        const scraper = new UPFC2SiteScraper(fetcher);
        const got = await scraper.getEventApplications('helloproject');
        const expected = await readFileAsJSON<UPFCEventApplicationTickets[]>(
          path.join(__dirname, './testdata/upfc2/valid.expected.json')
        );
        expect(got.length).toBe(expected.length);
        expected.forEach((e, i) => {
          const g = got[i];
          expect(g.name).toBe(e.name);
          expect(g.site).toBe('helloproject');
          expect(g.applicationID).toBe(e.applicationID);
          if (g.applicationStartDate !== undefined) {
            expect(g.applicationStartDate!.getTime()).toBe(new Date(e.applicationStartDate!).getTime());
            expect(g.applicationDueDate!.getTime()).toBe(new Date(e.applicationDueDate!).getTime());
            expect(g.paymentOpenDate!.getTime()).toBe(new Date(e.paymentOpenDate!).getTime());
            expect(g.paymentDueDate!.getTime()).toBe(new Date(e.paymentDueDate!).getTime());
          }
        });
      });
    });
  });
});
