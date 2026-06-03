import type { ReactNode } from 'react';
import type { AlertVariant } from '../types/alert';
import { StyledAlert } from './Alert.styles';

export function Alert({
  variant,
  children,
}: {
  variant: AlertVariant;
  children: ReactNode;
}) {
  return (
    <StyledAlert $variant={variant} role="alert">
      {children}
    </StyledAlert>
  );
}
