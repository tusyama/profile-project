import { CASES } from '@/constants/cases';
import { Card, Heading, SectionWrapper, Text } from '@/ui-kit';
import { Grid } from './Cases.styles';

export function Cases() {
  return (
    <SectionWrapper id="cases">
      <Heading as="h2" $size="h2">
        Кейсы
      </Heading>
      <Grid>
        {CASES.map((c) => (
          <Card key={c.title}>
            <Heading as="h3" $size="h3">
              {c.title}
            </Heading>
            <Text $variant="muted">{c.desc}</Text>
          </Card>
        ))}
      </Grid>
    </SectionWrapper>
  );
}
