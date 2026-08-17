import * as Yup from 'yup';
import {
  CURRENCIES,
  MAX_TICKETS_PER_ORDER,
  MIN_TICKETS_PER_ORDER,
} from '../../types/api';

/**
 * Mirrors the rules the API enforces, so the user is told what is wrong before
 * a round trip. The server still validates: this is convenience, not trust.
 */
export const settingsSchema = Yup.object({
  currency: Yup.string()
    .oneOf([...CURRENCIES], 'Choose one of the supported currencies')
    .required('Currency is required'),

  maxTicketsPerOrder: Yup.number()
    .typeError('Must be a number')
    .integer('Must be a whole number of tickets')
    .min(MIN_TICKETS_PER_ORDER, `Must be at least ${MIN_TICKETS_PER_ORDER}`)
    .max(MAX_TICKETS_PER_ORDER, `Must be at most ${MAX_TICKETS_PER_ORDER}`)
    .required('Maximum tickets per order is required'),

  salesEnabled: Yup.boolean().required(),

  supportEmail: Yup.string()
    .email('Must be a valid email address')
    .required('Support email is required'),
});
