import { getToday, addDate } from '@hpapp/foundation/date';
import { sleep } from '@hpapp/foundation/globals';

import { UPFCEventApplicationTickets, UPFCScraper } from './types';

const TODAY = getToday().getTime();
const DemoData: UPFCEventApplicationTickets[] = [
  {
    name: '譜久村聖30thバースデーイベント',
    tickets: [
      {
        venue: '日本武道館',
        openAt: new Date('2026-10-30T17:00:00'),
        startAt: new Date('2026-10-30T18:00:00'),
        status: '申込済',
        num: 1
      },
      {
        venue: '日本武道館',
        startAt: new Date('2026-10-30T19:00:00'),
        openAt: new Date('2026-10-30T20:00:00'),
        status: '申込済',
        num: 1
      }
    ]
  },
  {
    name: '横山玲奈30thバースデーイベント',
    tickets: [
      {
        venue: '日本武道館',
        openAt: new Date('2031-02-22T17:30:00'),
        startAt: new Date('2031-02-22T18:00:00'),
        status: '入金済',
        num: 1
      },
      {
        venue: '日本武道館',
        openAt: new Date('2031-02-22T19:30:00'),
        startAt: new Date('2031-02-22T20:00:00'),
        status: '落選',
        num: 1
      }
    ]
  },
  {
    name: '野中美希30thバースデーイベント',
    tickets: [
      {
        venue: '日本武道館',
        openAt: new Date('2029-10-07T17:30:00'),
        startAt: new Date('2029-10-07T18:00:00'),
        status: '入金待',
        num: 1
      },
      {
        venue: '日本武道館',
        openAt: new Date('2029-10-07T19:30:00'),
        startAt: new Date('2029-10-07T20:00:00'),
        status: '入金待',
        num: 1
      }
    ]
  },
  // past event with 入金待 status (should be render as '入金忘')
  {
    name: '譜久村聖20thバースデーイベント',
    tickets: [
      {
        venue: '日本武道館',
        openAt: new Date('2016-10-07T17:30:00'),
        startAt: new Date('2016-10-07T18:00:00'),
        status: '入金待',
        num: 1
      },
      {
        venue: '日本武道館',
        openAt: new Date('2016-10-07T19:30:00'),
        startAt: new Date('2016-10-07T20:00:00'),
        status: '入金待',
        num: 1
      }
    ]
  },

  // tickets with event metadata introduced by https:--github.com-yssk22-sites-issues-429
  // 1. Event Payment Due Date is Today
  {
    name: '山﨑愛生30thバースデーイベント',
    applicationStartDate: addDate(TODAY, -14, 'day'),
    applicationDueDate: addDate(TODAY, -7, 'day'),
    paymentOpenDate: addDate(TODAY, -3, 'day'),
    paymentDueDate: new Date(TODAY),
    tickets: [
      {
        venue: '日本武道館',
        openAt: new Date('2035-06-30T17:00:00'),
        startAt: new Date('2035-06-30T18:00:00'),
        status: '入金待',
        num: 1
      },
      {
        venue: '日本武道館',
        startAt: new Date('2026-06-30T19:00:00'),
        openAt: new Date('2026-06-30T20:00:00'),
        status: '入金待',
        num: 1
      }
    ]
  },
  // 2. Event Payment Due Date is past
  {
    name: '山﨑夢羽30thバースデーイベント',
    applicationStartDate: addDate(TODAY, -14, 'day'),
    applicationDueDate: addDate(TODAY, -7, 'day'),
    paymentOpenDate: addDate(TODAY, -5, 'day'),
    paymentDueDate: addDate(TODAY, -2, 'day'),
    tickets: [
      {
        venue: '日本武道館',
        openAt: new Date('2022-11-05T17:00:00'),
        startAt: new Date('2022-11-05T18:00:00'),
        status: '入金待',
        num: 1
      },
      {
        venue: '日本武道館',
        startAt: new Date('2022-11-30T19:00:00'),
        openAt: new Date('2022-11-30T20:00:00'),
        status: '入金待',
        num: 1
      }
    ]
  },
  // 3. PaymentOpenDate is future
  {
    name: '小田さくら30thバースデーイベント',
    applicationStartDate: addDate(TODAY, -14, 'day'),
    applicationDueDate: addDate(TODAY, -7, 'day'),
    paymentOpenDate: addDate(TODAY, +2, 'day'),
    paymentDueDate: addDate(TODAY, +6, 'day'),
    tickets: [
      {
        venue: '日本武道館',
        openAt: new Date('2029-03-12T17:00:00'),
        startAt: new Date('2029-03-12T18:00:00'),
        status: '申込済',
        num: 1
      },
      {
        venue: '日本武道館',
        startAt: new Date('2029-03-12T19:00:00'),
        openAt: new Date('2029-03-12T20:00:00'),
        status: '申込済',
        num: 1
      }
    ]
  },
  // for display only, comming soon events
  {
    name: '今週のイベントサンプル',
    applicationStartDate: addDate(TODAY, 14, 'day'),
    applicationDueDate: addDate(TODAY, 7, 'day'),
    paymentOpenDate: addDate(TODAY, 2, 'day'),
    paymentDueDate: addDate(TODAY, 1, 'day'),
    tickets: [
      {
        venue: '埼玉県川口総合文化センター・リリア メインホール',
        openAt: addDate(addDate(TODAY, 1, 'day'), 14, 'hour'),
        startAt: addDate(addDate(TODAY, 1, 'day'), 15, 'hour'),
        status: '入金済',
        num: 1
      },
      {
        venue: '埼玉県川口総合文化センター・リリア メインホール',
        openAt: addDate(addDate(TODAY, 2, 'day'), 14, 'hour'),
        startAt: addDate(addDate(TODAY, 2, 'day'), 15, 'hour'),
        status: '入金済',
        num: 1
      }
    ]
  },
  {
    // looooong name
    // eslint-disable-next-line quotes
    name: "モーニング娘。'21 10期メンバー 石田亜佑美＆佐藤優樹FCイベント～ひよこが10年経ったら、さぁ何になる？～『まーバースデーやってないよ。せめて衣装だけ着させて！』『いや、タイトル長いよ！』 ",
    applicationStartDate: addDate(TODAY, -1, 'day'),
    applicationDueDate: addDate(TODAY, -7, 'day'),
    paymentOpenDate: addDate(TODAY, -1, 'day'),
    paymentDueDate: addDate(TODAY, 7, 'day'),
    tickets: [
      {
        venue: '東京駅',
        openAt: addDate(addDate(TODAY, 30, 'day'), 18, 'hour'),
        startAt: addDate(addDate(TODAY, 30, 'day'), 19, 'hour'),
        status: '入金待',
        num: 1
      },
      {
        venue: '日本武道館',
        openAt: addDate(addDate(TODAY, 30, 'day'), 15, 'hour'),
        startAt: addDate(addDate(TODAY, 30, 'day'), 16, 'hour'),
        status: '入金待',
        num: 1
      }
    ]
  },
  // Open Event with due date
  {
    name: '入江里咲30thバースデーイベント',
    applicationStartDate: addDate(TODAY, -14, 'day'),
    applicationDueDate: addDate(TODAY, -7, 'day'),
    paymentOpenDate: addDate(TODAY, -5, 'day'),
    paymentDueDate: addDate(TODAY, -2, 'day'),
    tickets: []
  },
  // Open Event without due date
  {
    name: '譜久村聖40thバースデーイベント',
    tickets: []
  }
];

/**
 * UPFCDemoScraper is a UPFCScraper implementation for demo purpose. It is used for the developing purpose and the app review purpose.
 */
export default class UPFCDemoScraper implements UPFCScraper {
  /**
   * Username is a constant to authenticate with the demoscraper instance.
   */
  static Username = '00000000';

  /**
   * authenticate
   * @param username
   * @returns true if username is UPFCDemoScraper.Username
   */
  async authenticate(username: string, _: string): Promise<boolean> {
    // await sleep(1000);
    return username === UPFCDemoScraper.Username;
  }

  /**
   * @returns a list of event applications
   */
  async getEventApplications(): Promise<UPFCEventApplicationTickets[]> {
    await sleep(500);
    return DemoData;
  }
}
