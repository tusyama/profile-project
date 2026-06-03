import type { AppTheme } from '@/ui-kit/theme/theme';

export type StackDirection = 'row' | 'column';
export type StackAlign = 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
export type StackJustify =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

export type StackSpacing = keyof AppTheme['spacing'];

export interface StackStyleProps {
  $direction?: StackDirection;
  $gap?: StackSpacing;
  $align?: StackAlign;
  $justify?: StackJustify;
  $fullWidth?: boolean;
  $wrap?: boolean;
}
