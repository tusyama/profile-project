export type HeadingSize = 'h1' | 'h2' | 'h3' | 'h4';
export type TextVariant = 'body' | 'muted' | 'small';

export const HEADING_SIZES = ['h1', 'h2', 'h3', 'h4'] as const satisfies readonly HeadingSize[];
export const TEXT_VARIANTS = ['body', 'muted', 'small'] as const satisfies readonly TextVariant[];
