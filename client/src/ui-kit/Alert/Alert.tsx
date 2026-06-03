import type { ReactNode } from 'react';
import { StyledAlert, type AlertVariant } from './Alert.styles';

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
