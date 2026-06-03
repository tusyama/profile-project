import styled, { css } from 'styled-components';
import type { ButtonVariant } from '../types/button';

export const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all ${({ theme }) => theme.transitions.fast};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  ${({ $variant, theme }) =>
    $variant === 'primary' &&
    css`
      background: ${theme.colors.accent};
      color: ${theme.colors.bg};
      &:hover:not(:disabled) {
        background: ${theme.colors.accentHover};
      }
    `}

  ${({ $variant, theme }) =>
    $variant === 'secondary' &&
    css`
      background: transparent;
      color: ${theme.colors.accent};
      border-color: ${theme.colors.accent};
      &:hover:not(:disabled) {
        background: rgba(45, 212, 191, 0.1);
      }
    `}

  ${({ $variant, theme }) =>
    $variant === 'ghost' &&
    css`
      background: transparent;
      color: ${theme.colors.textMuted};
      &:hover:not(:disabled) {
        color: ${theme.colors.text};
      }
    `}
`;
