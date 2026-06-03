import type { ReactNode } from 'react';
import { StyledCard } from './Card.styles';

export function Card({ children }: { children: ReactNode }) {
  return <StyledCard>{children}</StyledCard>;
}
