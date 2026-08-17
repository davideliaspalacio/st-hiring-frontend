/**
 * Shapes as the API actually returns them. The backend declares camelCase in
 * its entities, but knex does not map column names, so timestamps and foreign
 * keys arrive snake_case straight from PostgreSQL.
 */
export interface Ticket {
  id: number;
  event_id: number;
  type: string;
  status: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  location: string | null;
  date: string;
  created_at: string;
  updated_at: string;
  // The API sends a count, not the ticket rows: a list only needs the number,
  // and embedding them made a single page weigh hundreds of kilobytes.
  availableTicketsCount: number;
}

/** Envelope returned by paginated list endpoints. */
export interface Paginated<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export const CURRENCIES = ['USD', 'EUR', 'GBP'] as const;

export type Currency = (typeof CURRENCIES)[number];

export const MIN_TICKETS_PER_ORDER = 1;
export const MAX_TICKETS_PER_ORDER = 20;

export interface Settings {
  currency: Currency;
  maxTicketsPerOrder: number;
  salesEnabled: boolean;
  supportEmail: string;
}
