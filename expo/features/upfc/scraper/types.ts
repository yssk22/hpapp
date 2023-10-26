export const ErrAuthentication = new Error('failed to authenticate');
export const ErrNoCredential = new Error('no credential is set');
export const ErrInvalidStatusCode = new Error('up-fc.jp returned non 200 response');

export type EventTicket = {
  venue: string;
  status: TicketStatus;
  num: number;
} & EventDateTime;

export type EventDateTime = {
  openAt?: Date;
  startAt: Date;
};

export type EventApplication = {
  name: string;
  applicationID?: string | null;
  applicationStartDate?: Date;
  applicationDueDate?: Date;
  paymentOpenDate?: Date;
  paymentDueDate?: Date;
};

export type EventApplicationTickets = {
  tickets: EventTicket[];
} & EventApplication;

export type TicketStatus = '申込済' | '入金待' | '入金済' | '落選' | '入金忘' | '不明';

export interface Scraper {
  authenticate(username: string, password: string): Promise<boolean>;
  getEventApplications(): Promise<EventApplicationTickets[]>;
}

export interface Fetcher {
  postCredential(username: string, password: string): Promise<string>;
  fetchEventApplicationsHtml(): Promise<string>;
  fetchExecEventApplicationsHtml(): Promise<string>;
  fetchTicketsHtml(): Promise<string>;
}
