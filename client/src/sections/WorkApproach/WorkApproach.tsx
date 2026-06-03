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
        <li>
          Слона ем по кусочкам: крупное режу на этапы с понятным результатом на каждом, а не тащу
          один бесконечный «почти готово»
        </li>
        <li>
          Всё раскладываю по полочкам — в коде, в задачах и в договорённостях с командой, чтобы
          через полгода не гадать, «где это лежит»
        </li>
        <li>
          "Make it to work, then make it to shine" - Сначала запускаю рабочий вариант, потом довожу
          до аккуратного - не откладываю пользу ради идеальной картинки в голове
        </li>
        <li>
          Новое подключаю с умом: если AI или другой инструмент реально ускоряет — беру, без гонки
          за модными словами
        </li>
      </List>
      <AlertWrap>
        <Alert variant="info">
          Кнопка «Улучшить комментарий» в форме — маленький пример на практике: помогаю текстом, но
          не отдаю наружу то, что должно остаться у нас.
        </Alert>
      </AlertWrap>
    </SectionWrapper>
  );
}
