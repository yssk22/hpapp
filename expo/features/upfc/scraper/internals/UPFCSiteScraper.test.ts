import { ErrUPFCAuthentication, UPFCEventApplicationTickets } from '@hpapp/features/upfc/scraper';
import { readFileAsJSON } from '@hpapp/foundation/test_helper';
import * as path from 'path';

import UPFCFileFetcher from './UPFCFileFetcher';
import UPFCSiteScraper from './UPFCSiteScraper';

describe('UPFCSiteScraper', () => {
  describe('helloproject', () => {
    describe('authorize', () => {
      it('should return true if valid redirection page is responded', async () => {
        const fetcher = new UPFCFileFetcher('mizuki', 'fukumura', {
          redirectPageHtmlPath: path.join(__dirname, './testdata/valid-redirect.html'),
          openEventApplicationsHtmlPath: path.join(__dirname, './testdata/valid-available-applications.html'),
          openExecEventApplicationsHtmlPath: path.join(__dirname, './testdata/valid-available-applications-exe.html'),
          ticketsHtmlPath: path.join(__dirname, './testdata/valid-tickets-page.html')
        });
        const scraper = new UPFCSiteScraper(fetcher);
        const result = await scraper.authenticate('mizuki', 'fukumura', 'helloproject');
        expect(result).toBe(true);
      });

      it('should throw ErrAuthentication if wrong redirection page is responded', async () => {
        const fetcher = new UPFCFileFetcher('mizuki', 'fukumura', {
          redirectPageHtmlPath: path.join(__dirname, './testdata/valid-no-events.html'),
          openEventApplicationsHtmlPath: path.join(__dirname, './testdata/valid-available-applications.html'),
          openExecEventApplicationsHtmlPath: path.join(__dirname, './testdata/valid-available-applications-exe.html'),
          ticketsHtmlPath: path.join(__dirname, './testdata/valid-tickets-page.html')
        });
        const scraper = new UPFCSiteScraper(fetcher);
        expect.assertions(1);
        return scraper
          .authenticate('mizuki', 'fukumura', 'helloproject')
          .catch((e) => expect(e).toBeInstanceOf(ErrUPFCAuthentication));
      });
    });

    describe('getEventApplications', () => {
      it('should return all Applications in tickets page', async () => {
        const fetcher = new UPFCFileFetcher('mizuki', 'fukumura', {
          redirectPageHtmlPath: path.join(__dirname, './testdata/valid-redirect.html'),
          openEventApplicationsHtmlPath: '',
          openExecEventApplicationsHtmlPath: '',
          ticketsHtmlPath: path.join(__dirname, './testdata/valid-tickets-page.html')
        });
        const scraper = new UPFCSiteScraper(fetcher);
        await scraper.authenticate('mizuki', 'fukumura', 'helloproject');
        const got = await scraper.getEventApplications();
        const expected = await readFileAsJSON<UPFCEventApplicationTickets[]>(
          path.join(__dirname, './testdata/valid-tickets-page.expected.json')
        );
        expect(got.length).toBe(expected.length);
        expected.forEach((e, i) => {
          const g = got[i];
          expect(g.name).toBe(e.name);
          expect(g.site).toBe('helloproject');
          expect(g.applicationID).toBe(undefined); // ticket page shouldn't have applicationID
          expect(g.tickets.length).toBe(e.tickets.length);
          e.tickets.forEach((et, i) => {
            const gt = g.tickets[i];
            expect(gt.num).toBe(et.num);
            expect(gt.venue).toBe(et.venue);
            expect(gt.openAt!.getTime()).toBe(new Date(et.openAt!).getTime());
            expect(gt.startAt.getTime()).toBe(new Date(et.startAt).getTime());
            expect(gt.status).toBe(et.status);
          });
        });
      });
    });

    describe('getEventApplications', () => {
      it('should return all Applications in applications page', async () => {
        const fetcher = new UPFCFileFetcher('mizuki', 'fukumura', {
          redirectPageHtmlPath: path.join(__dirname, './testdata/valid-redirect.html'),
          openEventApplicationsHtmlPath: path.join(__dirname, './testdata/valid-available-applications.html'),
          openExecEventApplicationsHtmlPath: '',
          ticketsHtmlPath: path.join(__dirname, './testdata/test-no-event.html')
        });
        const scraper = new UPFCSiteScraper(fetcher);
        await scraper.authenticate('mizuki', 'fukumura', 'helloproject');
        const got = await scraper.getEventApplications();
        const expected = await readFileAsJSON<UPFCEventApplicationTickets[]>(
          path.join(__dirname, './testdata/valid-available-applications.expected.json')
        );
        expect(got.length).toBe(expected.length);
        expected.forEach((e, i) => {
          const g = got[i];
          expect(g.name).toBe(e.name);
          expect(g.site).toBe('helloproject');
          expect(g.applicationID).toBe(e.applicationID);
          expect(g.applicationStartDate!.getTime()).toBe(new Date(e.applicationStartDate!).getTime());
          expect(g.applicationDueDate!.getTime()).toBe(new Date(e.applicationDueDate!).getTime());
          expect(g.paymentOpenDate!.getTime()).toBe(new Date(e.paymentOpenDate!).getTime());
          expect(g.paymentDueDate!.getTime()).toBe(new Date(e.paymentDueDate!).getTime());
        });
      });

      it('should return all Applications in applications page (exe)', async () => {
        const fetcher = new UPFCFileFetcher('mizuki', 'fukumura', {
          redirectPageHtmlPath: path.join(__dirname, './testdata/valid-redirect.html'),
          openEventApplicationsHtmlPath: '',
          openExecEventApplicationsHtmlPath: path.join(__dirname, './testdata/valid-available-applications-exe.html'),
          ticketsHtmlPath: path.join(__dirname, './testdata/test-no-event.html')
        });
        const scraper = new UPFCSiteScraper(fetcher);
        await scraper.authenticate('mizuki', 'fukumura', 'helloproject');

        const got = await scraper.getEventApplications();
        const expected = await readFileAsJSON<UPFCEventApplicationTickets[]>(
          path.join(__dirname, './testdata/valid-available-applications-exe.expected.json')
        );
        expect(got.length).toBe(expected.length);
        expected.forEach((e, i) => {
          const g = got[i];
          expect(g.name).toBe(e.name);
          expect(g.site).toBe('helloproject');
          expect(g.applicationID).toBe(e.applicationID);
          expect(g.applicationStartDate!.getTime()).toBe(new Date(e.applicationStartDate!).getTime());
          expect(g.applicationDueDate!.getTime()).toBe(new Date(e.applicationDueDate!).getTime());
          expect(g.paymentOpenDate!.getTime()).toBe(new Date(e.paymentOpenDate!).getTime());
          expect(g.paymentDueDate!.getTime()).toBe(new Date(e.paymentDueDate!).getTime());
        });
      });
      it('should return all Applications listed in tickets, applications, and exe applications', async () => {
        const fetcher = new UPFCFileFetcher('mizuki', 'fukumura', {
          redirectPageHtmlPath: path.join(__dirname, './testdata/valid-redirect.html'),
          openEventApplicationsHtmlPath: path.join(
            __dirname,
            './testdata/integration-test-available-applications.html'
          ),
          openExecEventApplicationsHtmlPath: path.join(
            __dirname,
            './testdata/integration-test-available-applications-exe.html'
          ),
          ticketsHtmlPath: path.join(__dirname, './testdata/integration-test-tickets.html')
        });
        const scraper = new UPFCSiteScraper(fetcher);
        await scraper.authenticate('mizuki', 'fukumura', 'helloproject');

        const got = await scraper.getEventApplications();
        const expected = await readFileAsJSON<UPFCEventApplicationTickets[]>(
          path.join(__dirname, './testdata/integration-test.exepected.json')
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

  describe('m-line', () => {
    describe('getEventApplications', () => {
      it('should return all Applications in applications page', async () => {
        const fetcher = new UPFCFileFetcher('mizuki', 'fukumura', {
          redirectPageHtmlPath: path.join(__dirname, './testdata/valid-redirect.html'),
          openEventApplicationsHtmlPath: path.join(__dirname, './testdata/m-line/event_Event_SetList.html'),
          openExecEventApplicationsHtmlPath: path.join(__dirname, './testdata/m-line/fantciket_DM_List.html'),
          ticketsHtmlPath: path.join(__dirname, './testdata/m-line/mypage02.html')
        });
        const scraper = new UPFCSiteScraper(fetcher);
        await scraper.authenticate('mizuki', 'fukumura', 'm-line');

        const got = await scraper.getEventApplications();
        const expected = await readFileAsJSON<UPFCEventApplicationTickets[]>(
          path.join(__dirname, './testdata/m-line/expected.json')
        );
        expect(got.length).toBe(expected.length);
        expected.forEach((e, i) => {
          const g = got[i];
          expect(g.name).toBe(e.name);
          expect(g.site).toBe('m-line');
          expect(g.applicationID).toBe(e.applicationID);
          expect(g.applicationStartDate!.getTime()).toBe(new Date(e.applicationStartDate!).getTime());
          expect(g.applicationDueDate!.getTime()).toBe(new Date(e.applicationDueDate!).getTime());
          expect(g.paymentOpenDate!.getTime()).toBe(new Date(e.paymentOpenDate!).getTime());
          expect(g.paymentDueDate!.getTime()).toBe(new Date(e.paymentDueDate!).getTime());
        });
      });
    });
  });
});
