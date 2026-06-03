import styled, { css } from 'styled-components';
import type { AppTheme } from '../theme/theme';

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

export const Stack = styled.div<StackStyleProps>`
  display: flex;
  flex-direction: ${({ $direction = 'column' }) => $direction};
  align-items: ${({ $align }) => $align ?? 'stretch'};
  justify-content: ${({ $justify }) => $justify ?? 'flex-start'};
  flex-wrap: ${({ $wrap }) => ($wrap ? 'wrap' : 'nowrap')};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  ${({ $gap, theme }) =>
    $gap &&
    css`
      gap: ${theme.spacing[$gap]};
    `}
`;
