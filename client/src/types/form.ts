export type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export const FORM_STATUS = {
  Idle: 'idle',
  Loading: 'loading',
  Success: 'success',
  Error: 'error',
} as const satisfies Record<string, FormStatus>;
