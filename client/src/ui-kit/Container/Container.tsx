import type { ReactNode } from 'react';
import { Section, StyledContainer } from './Container.styles';

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
