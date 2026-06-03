import styled, { css } from 'styled-components';
import type { ReactNode } from 'react';

type Variant = 'success' | 'error' | 'info';

const StyledAlert = styled.div<{ $variant: Variant }>`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.95rem;
  border: 1px solid;

  ${({ $variant, theme }) =>
    $variant === 'success' &&
    css`
      background: rgba(74, 222, 128, 0.1);
      border-color: ${theme.colors.success};
      color: ${theme.colors.success};
    `}

  ${({ $variant, theme }) =>
    $variant === 'error' &&
    css`
      background: rgba(248, 113, 113, 0.1);
      border-color: ${theme.colors.error};
      color: ${theme.colors.error};
    `}

  ${({ $variant, theme }) =>
    $variant === 'info' &&
    css`
      background: rgba(45, 212, 191, 0.08);
      border-color: ${theme.colors.accent};
      color: ${theme.colors.accent};
    `}
`;

export function Alert({
  variant,
  children,
}: {
  variant: Variant;
  children: ReactNode;
}) {
  return (
    <StyledAlert $variant={variant} role="alert">
      {children}
    </StyledAlert>
  );
}
