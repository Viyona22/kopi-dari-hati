
// Payment method constants to ensure consistency across the app
export const PAYMENT_METHODS = {
  QRIS: 'qris',
  BANK_TRANSFER: 'bank_transfer',
  EWALLET: 'ewallet'
} as const;

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.QRIS]: 'QRIS',
  [PAYMENT_METHODS.BANK_TRANSFER]: 'Transfer Bank',
  [PAYMENT_METHODS.EWALLET]: 'E-Wallet'
} as const;

export const VALID_PAYMENT_METHODS = Object.values(PAYMENT_METHODS);
