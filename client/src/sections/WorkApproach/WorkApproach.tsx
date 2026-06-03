import styled from 'styled-components';
import { Alert, Heading, SectionWrapper, Stack } from '@/ui-kit';

const List = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.8;
`;

const AlertWrap = styled(Stack).attrs({ $gap: 'md' })`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export function WorkApproach() {
  return (
    <SectionWrapper id="work">
      <Heading as="h2" $size="h2">
        Как я работаю
      </Heading>
      <List>
        <li>Разбиваю задачи на итерации, фиксирую критерии готовности до начала кода</li>
        <li>Code review и менторство — часть ежедневной работы</li>
        <li>
          AI в дев-процессе: Cursor для ускорения рутины; в продакшне — LLM API для генерации
          обучающего контента (контент-редакторы свели к proofread)
        </li>
        <li>Фокус на измеримых результатах: производительность, стабильность, DX команды</li>
      </List>
      <AlertWrap>
        <Alert variant="info">
          Кнопка «Улучшить комментарий» в форме ниже — тот же подход: LLM API + валидация ввода и
          ответа, без утечки секретов.
        </Alert>
      </AlertWrap>
    </SectionWrapper>
  );
}
