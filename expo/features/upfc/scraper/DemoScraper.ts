import { getToday, N_DAYS, N_HOURS } from "@hpapp/foundation/date";
import { EventApplicationTickets, Scraper } from "./types";

const TODAY = getToday().getTime();
const DemoData: EventApplicationTickets[] = [
  {
    name: "譜久村聖30thバースデーイベント",
    tickets: [
      {
        venue: "日本武道館",
        openAt: new Date("2026-10-30T17:00:00"),
        startAt: new Date("2026-10-30T18:00:00"),
        status: "申込済",
        num: 1,
      },
      {
        venue: "日本武道館",
        startAt: new Date("2026-10-30T19:00:00"),
        openAt: new Date("2026-10-30T20:00:00"),
        status: "申込済",
        num: 1,
      },
    ],
  },
  {
    name: "横山玲奈30thバースデーイベント",
    tickets: [
      {
        venue: "日本武道館",
        openAt: new Date("2031-02-22T17:30:00"),
        startAt: new Date("2031-02-22T18:00:00"),
        status: "入金済",
        num: 1,
      },
      {
        venue: "日本武道館",
        openAt: new Date("2031-02-22T19:30:00"),
        startAt: new Date("2031-02-22T20:00:00"),
        status: "落選",
        num: 1,
      },
    ],
  },
  {
    name: "野中美希30thバースデーイベント",
    tickets: [
      {
        venue: "日本武道館",
        openAt: new Date("2029-10-07T17:30:00"),
        startAt: new Date("2029-10-07T18:00:00"),
        status: "入金待",
        num: 1,
      },
      {
        venue: "日本武道館",
        openAt: new Date("2029-10-07T19:30:00"),
        startAt: new Date("2029-10-07T20:00:00"),
        status: "入金待",
        num: 1,
      },
    ],
  },
  // past event with 入金待 status (should be render as '入金忘')
  {
    name: "譜久村聖20thバースデーイベント",
    tickets: [
      {
        venue: "日本武道館",
        openAt: new Date("2016-10-07T17:30:00"),
        startAt: new Date("2016-10-07T18:00:00"),
        status: "入金待",
        num: 1,
      },
      {
        venue: "日本武道館",
        openAt: new Date("2016-10-07T19:30:00"),
        startAt: new Date("2016-10-07T20:00:00"),
        status: "入金待",
        num: 1,
      },
    ],
  },

  // tickets with event metadata introduced by https:--github.com-yssk22-sites-issues-429
  // 1. Event Payment Due Date is Today
  {
    name: "山﨑愛生30thバースデーイベント",
    applicationStartDate: new Date(TODAY - 14 * N_DAYS),
    applicationDueDate: new Date(TODAY - 7 * N_DAYS),
    paymentOpenDate: new Date(TODAY - 3 * N_DAYS),
    paymentDueDate: new Date(TODAY),
    tickets: [
      {
        venue: "日本武道館",
        openAt: new Date("2035-06-30T17:00:00"),
        startAt: new Date("2035-06-30T18:00:00"),
        status: "入金待",
        num: 1,
      },
      {
        venue: "日本武道館",
        startAt: new Date("2026-06-30T19:00:00"),
        openAt: new Date("2026-06-30T20:00:00"),
        status: "入金待",
        num: 1,
      },
    ],
  },
  // 2. Event Payment Due Date is past
  {
    name: "山﨑夢羽30thバースデーイベント",
    applicationStartDate: new Date(TODAY - 14 * N_DAYS),
    applicationDueDate: new Date(TODAY - 7 * N_DAYS),
    paymentOpenDate: new Date(TODAY - 5 * N_DAYS),
    paymentDueDate: new Date(TODAY - 2 * N_DAYS),
    tickets: [
      {
        venue: "日本武道館",
        openAt: new Date("2022-11-05T17:00:00"),
        startAt: new Date("2022-11-05T18:00:00"),
        status: "入金待",
        num: 1,
      },
      {
        venue: "日本武道館",
        startAt: new Date("2022-11-30T19:00:00"),
        openAt: new Date("2022-11-30T20:00:00"),
        status: "入金待",
        num: 1,
      },
    ],
  },
  // 3. PaymentOpenDate is future
  {
    name: "小田さくら30thバースデーイベント",
    applicationStartDate: new Date(TODAY - 14 * N_DAYS),
    applicationDueDate: new Date(TODAY - 7 * N_DAYS),
    paymentOpenDate: new Date(TODAY + 2 * N_DAYS),
    paymentDueDate: new Date(TODAY + 6 * N_DAYS),
    tickets: [
      {
        venue: "日本武道館",
        openAt: new Date("2029-03-12T17:00:00"),
        startAt: new Date("2029-03-12T18:00:00"),
        status: "申込済",
        num: 1,
      },
      {
        venue: "日本武道館",
        startAt: new Date("2029-03-12T19:00:00"),
        openAt: new Date("2029-03-12T20:00:00"),
        status: "申込済",
        num: 1,
      },
    ],
  },
  // for display only, comming soon events
  {
    name: "今週のイベントサンプル",
    applicationStartDate: new Date(TODAY - 14 * N_DAYS),
    applicationDueDate: new Date(TODAY - 7 * N_DAYS),
    paymentOpenDate: new Date(TODAY - 2 * N_DAYS),
    paymentDueDate: new Date(TODAY - 1 * N_DAYS),
    tickets: [
      {
        venue: "埼玉県川口総合文化センター・リリア メインホール",
        openAt: new Date(TODAY + 1 * N_DAYS + 14 * N_HOURS),
        startAt: new Date(TODAY + 1 * N_DAYS + 15 * N_HOURS),
        status: "入金済",
        num: 1,
      },
      {
        venue: "埼玉県川口総合文化センター・リリア メインホール",
        openAt: new Date(TODAY + 2 * N_DAYS + 14 * N_HOURS),
        startAt: new Date(TODAY + 2 * N_DAYS + 15 * N_HOURS),
        status: "入金済",
        num: 1,
      },
    ],
  },
  {
    // looooong name
    // eslint-disable-next-line quotes
    name: "モーニング娘。'21 10期メンバー 石田亜佑美＆佐藤優樹FCイベント～ひよこが10年経ったら、さぁ何になる？～『まーバースデーやってないよ。せめて衣装だけ着させて！』『いや、タイトル長いよ！』 ",
    applicationStartDate: new Date(TODAY - 14 * N_DAYS),
    applicationDueDate: new Date(TODAY - 7 * N_DAYS),
    paymentOpenDate: new Date(TODAY - 1 * N_DAYS),
    paymentDueDate: new Date(TODAY + 7 * N_DAYS),
    tickets: [
      {
        venue: "東京駅",
        openAt: new Date(TODAY + 30 * N_DAYS + 18 * N_HOURS),
        startAt: new Date(TODAY + 30 * N_DAYS + 19 * N_HOURS),
        status: "入金待",
        num: 1,
      },
      {
        venue: "日本武道館",
        openAt: new Date(TODAY + 30 * N_DAYS + 15 * N_HOURS),
        startAt: new Date(TODAY + 30 * N_DAYS + 16 * N_HOURS),
        status: "入金待",
        num: 1,
      },
    ],
  },
  // Open Event with due date
  {
    name: "入江里咲30thバースデーイベント",
    applicationStartDate: new Date(TODAY - 14 * N_DAYS),
    applicationDueDate: new Date(TODAY - 7 * N_DAYS),
    paymentOpenDate: new Date(TODAY - 5 * N_DAYS),
    paymentDueDate: new Date(TODAY - 2 * N_DAYS),
    tickets: [],
  },
  // Open Event without due date
  {
    name: "譜久村聖40thバースデーイベント",
    tickets: [],
  },
];

export default class DummyScraper implements Scraper {
  static Username = "00000000";
  // eslint-disable-next-line @typescript-eslint-no-unused-vars
  async authenticate(username: string, _: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(username === DummyScraper.Username);
      }, 1000);
    });
  }

  async getEventApplications(): Promise<EventApplicationTickets[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DemoData);
      }, 500);
    });
  }
}
