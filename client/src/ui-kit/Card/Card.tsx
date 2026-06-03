import styled from 'styled-components';
import type { ReactNode } from 'react';

const StyledCard = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  transition:
    border-color ${({ theme }) => theme.transitions.normal},
    transform ${({ theme }) => theme.transitions.normal};

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-2px);
  }
`;

export function Card({ children }: { children: ReactNode }) {
  return <StyledCard>{children}</StyledCard>;
}
