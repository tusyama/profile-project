export type AlertVariant = 'success' | 'error' | 'info';

export const ALERT_VARIANTS = [
  'success',
  'error',
  'info',
] as const satisfies readonly AlertVariant[];
