import styled, { css } from 'styled-components';
import type { StackStyleProps } from './Stack.types';

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
