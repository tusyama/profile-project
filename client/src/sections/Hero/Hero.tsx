import styled from 'styled-components';
import { Button, Heading, SectionWrapper, Text } from '../../ui-kit';

const HeroInner = styled.div`
  padding-top: ${({ theme }) => theme.spacing.xl};
`;

const Tagline = styled.p`
  font-size: 1.15rem;
  color: ${({ theme }) => theme.colors.accent};
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
`;

export function Hero() {
  return (
    <SectionWrapper>
      <HeroInner>
        <Tagline>Fullstack / Backend · Middle+ / Senior</Tagline>
        <Heading as="h1" $size="h1">
          Артем Репин
        </Heading>
        <Text $variant="muted">
          Fullstack-разработчик с ~4 годами коммерческого опыта. EdTech, AI-интеграции в
          продакшне, архитектура и продукт end-to-end.
        </Text>
        <a href="#contact" style={{ textDecoration: 'none', display: 'inline-block' }}>
          <Button type="button">Связаться</Button>
        </a>
      </HeroInner>
    </SectionWrapper>
  );
}
