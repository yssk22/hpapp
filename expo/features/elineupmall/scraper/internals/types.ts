export type ElineupMallOrderStatus =
  | 'cart'
  | 'payment_confirmed'
  | 'shipped'
  | 'ordered'
  | 'failed'
  | 'denied'
  | 'out_of_stock'
  | 'canceled'
  | 'unprocessed'
  | 'unknown';

export type ElineupMallOrder = {
  id: string;
  status: ElineupMallOrderStatus;
  orderedAt: Date;
  details: ElineupMallOrderDetail[];
};

export type ElineupMallOrderDetail = {
  name: string;
  num: number;
  link: string;
  deleteLink?: string; // only available for cart
  code: string;
  unitPrice: number;
  totalPrice: number;
};

export interface ElineupMallScraper {
  authenticate(username: string, password: string): Promise<boolean>;
  getOrderList(from: Date): Promise<ElineupMallOrder[]>;
}

export interface ElineupMallFetcher {
  postCredential(username: string, password: string): Promise<string>;
  fetch(url: string): Promise<string>;
  fetchOrderListHtml(pageNum: number): Promise<string>;
  fetchOrderDetailHtml(id: string): Promise<string>;
  fetchCartHtml(): Promise<string>;
}
