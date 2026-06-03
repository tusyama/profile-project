import styled from 'styled-components';
import { Badge, Heading, SectionWrapper, Text } from '../../ui-kit';

const Stack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const SKILLS = [
  'Node.js',
  'TypeScript',
  'React',
  'Hono',
  'MongoDB',
  'Redis',
  'PostgreSQL',
  'Docker',
  'AI / LLM',
  'WebSocket',
  'Solidity',
];

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
      <Stack>
        {SKILLS.map((s) => (
          <Badge key={s}>{s}</Badge>
        ))}
      </Stack>
    </SectionWrapper>
  );
}
