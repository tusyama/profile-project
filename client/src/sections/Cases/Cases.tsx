import styled from 'styled-components';
import { Card, Heading, SectionWrapper, Text } from '../../ui-kit';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const CASES = [
  {
    title: 'EdTech-платформа',
    desc: 'Основной продукт: AI-генерация курсов в БД, MongoDB, WebSocket, CI/CD. Роль — lead fullstack.',
  },
  {
    title: 'E-commerce проект',
    desc: 'Умные теги, кастомизация UI на React, навигация и логика интерфейса.',
  },
  {
    title: 'Taskboard',
    desc: 'Учебный fullstack-проект: React, Node.js, MongoDB — для освоения стека.',
  },
];

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
