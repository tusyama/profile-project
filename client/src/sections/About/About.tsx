import { SKILLS } from '@/constants/skills';
import { Badge, Heading, SectionWrapper, Text } from '@/ui-kit';
import { SkillList } from './About.styles';

export function About() {
  return (
    <SectionWrapper id="about">
      <Heading as="h2" $size="h2">
        Обо мне
      </Heading>
      <Text $variant="body">
        В разработке с 2021 года, из них около четырёх — коммерческий опыт в EdTech-стартапе.
        Прошёл путь от Junior до Senior, отвечал за техническую сторону продукта: архитектура,
        разработка, оптимизация, DevOps, найм и менторство.
      </Text>
      <Text $variant="muted">
        Направления: backend и fullstack, интеграция AI в продакшн, реалтайм, Web3
        (смарт-контракты).
      </Text>
      <SkillList>
        {SKILLS.map((s) => (
          <Badge key={s}>{s}</Badge>
        ))}
      </SkillList>
    </SectionWrapper>
  );
}
