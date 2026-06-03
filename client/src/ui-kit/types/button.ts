export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export const BUTTON_VARIANTS = [
  'primary',
  'secondary',
  'ghost',
] as const satisfies readonly ButtonVariant[];
