import * as path from 'path';

import ElineupMallFileFetcher from './ElineupMallFileFetcher';
import ElineupMallSiteScraper from './ElineupMallSiteScraper';

describe('ElineupMallSiteScraper', () => {
  describe('authenticate', () => {
    it('success', async () => {
      const scraper = new ElineupMallSiteScraper(
        new ElineupMallFileFetcher({
          authResultHTMLPath: path.join(__dirname, './testdata/auth_success.html'),
          orderListHTMLPath: '',
          orderDetailHTMLPath: ''
        })
      );
      const ok = await scraper.authenticate('mizuki', 'fukumura');
      expect(ok).toBe(true);
    });

    it('error', async () => {
      const scraper = new ElineupMallSiteScraper(
        new ElineupMallFileFetcher({
          authResultHTMLPath: path.join(__dirname, './testdata/auth_error.html'),
          orderListHTMLPath: '',
          orderDetailHTMLPath: ''
        })
      );
      const ok = await scraper.authenticate('mizuki', 'fukumura');
      expect(ok).toBe(false);
    });
  });

  it('order_list', async () => {
    const scraper = new ElineupMallSiteScraper(
      new ElineupMallFileFetcher({
        authResultHTMLPath: '',
        orderListHTMLPath: path.join(__dirname, './testdata/order_list.html'),
        orderDetailHTMLPath: path.join(__dirname, './testdata/order_detail.html')
      })
    );
    const list = await scraper.getOrderList(new Date('2024-08-04T00:00:00+09:00'));
    expect(list.length).toBe(3);
    expect(list[0].id).toBe('1430811');
    expect(list[0].status).toBe('payment_confirmed');
    expect(list[0].orderedAt.toISOString()).toBe('2024-12-23T07:33:00.000Z');
    expect(list[1].id).toBe('1397584');
    expect(list[1].status).toBe('payment_confirmed');
    expect(list[1].orderedAt.toISOString()).toBe('2024-10-20T08:58:00.000Z');
    expect(list[2].id).toBe('1375993');
    expect(list[2].status).toBe('shipped');
    expect(list[2].orderedAt.toISOString()).toBe('2024-08-30T09:22:00.000Z');

    expect(list[0].details.length).toBe(1);
    expect(list[0].details[0].name).toBe(
      '2024年12月通信販売 DVD「Juice=Juice 工藤由愛バースデーイベント2024 /Juice=Juice 有澤一華・入江里咲・江端妃咲FCイベント2024」'
    );
    expect(list[0].details[0].name).toBe(
      '2024年12月通信販売 DVD「Juice=Juice 工藤由愛バースデーイベント2024 /Juice=Juice 有澤一華・入江里咲・江端妃咲FCイベント2024」'
    );
    expect(list[0].details[0].unitPrice).toBe(8250);
    expect(list[0].details[0].num).toBe(1);
    expect(list[0].details[0].totalPrice).toBe(8250);
    expect(list[0].details[0].code).toBe('HP2412_H-03');
    expect(list[0].details[0].link).toBe(
      'https://www.elineupmall.com/c720/c2784/202412-dvdjuicejuice-2024-juicejuice-fc2024-alp84jmu/'
    );
  });
});
