import { Button, Heading, SectionWrapper, Text } from '@/ui-kit';
import { CtaLink, HeroInner, Tagline } from './Hero.styles';

export function Hero() {
  return (
    <SectionWrapper>
      <HeroInner>
        <Tagline>Fullstack / Backend · Middle+ / Senior</Tagline>
        <Heading as="h1" $size="h1">
          Артем Репин
        </Heading>
        <Text $variant="muted">
          Fullstack-разработчик с ~4 годами коммерческого опыта. EdTech, AI-интеграции в продакшне,
          архитектура и продукт end-to-end.
        </Text>
        <CtaLink href="#contact">
          <Button type="button">Связаться</Button>
        </CtaLink>
      </HeroInner>
    </SectionWrapper>
  );
}
