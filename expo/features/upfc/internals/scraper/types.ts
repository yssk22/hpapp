/**
 * a type to represent a ticket information.
 */
export type UPFCEventTicket = {
  /**
   * the name of the venue
   */
  venue: string;
  /**
   * time to open the venue
   */
  openAt?: Date;
  /**
   * time to start the event
   */
  startAt: Date;
  /**
   * the number of tickets
   */
  num: number;
  /**
   * the ticket application status
   */
  status: UPFCTicketApplicationStatus;
};

/**
 * a enum to represent a ticket application status.
 */
export type UPFCTicketApplicationStatus = '申込済' | '入金待' | '入金済' | '落選' | '入金忘' | '不明';

/**
 * application info for an event
 */
export type UPFCEventApplication = {
  /**
   * name of the application. This is not same as the event name. There can be an event with multiple applications such as
   * '入江里咲バースデーイベント2024' and '【2次受付】入江里咲バースデーイベント2024'
   */
  name: string;
  /**
   * an id for the application used in up-fc.jp (`EventSet_ID` parameter).
   */
  applicationID?: string | null;
  /**
   * A date to start an application
   */
  applicationStartDate?: Date;
  /**
   * A due date to end an application
   */
  applicationDueDate?: Date;
  /**
   * A date to open a payment window
   */
  paymentOpenDate?: Date;
  /**
   * A date to close a payment window
   */
  paymentDueDate?: Date;
};

/**
 * An application info for an event with tickets
 */
export type UPFCEventApplicationTickets = {
  tickets: UPFCEventTicket[];
} & UPFCEventApplication;

/**
 * An interface to scrape up-fc.jp.
 */
export interface UPFCScraper {
  authenticate(username: string, password: string): Promise<boolean>;
  getEventApplications(): Promise<UPFCEventApplicationTickets[]>;
}

/**
 * An interface to interact with up-fc.jp.
 */
export interface UPFCFetcher {
  postCredential(username: string, password: string): Promise<string>;
  fetchEventApplicationsHtml(): Promise<string>;
  fetchExecEventApplicationsHtml(): Promise<string>;
  fetchTicketsHtml(): Promise<string>;
}

export type UPFCScraperParams = {
  username: string;
  password: string;
  useDemo: boolean;
};
