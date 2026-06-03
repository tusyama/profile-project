import styled from 'styled-components';
import type { ReactNode } from 'react';

const StyledContainer = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing.xxl} 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl} 0;
  }
`;

export function Container({ children }: { children: ReactNode }) {
  return <StyledContainer>{children}</StyledContainer>;
}

export function SectionWrapper({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  return (
    <Section id={id}>
      <Container>{children}</Container>
    </Section>
  );
}
