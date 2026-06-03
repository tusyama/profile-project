import styled from 'styled-components';
import { Stack } from '../../ui-kit';

export const SkillList = styled(Stack).attrs({
  $direction: 'row',
  $gap: 'sm',
  $wrap: true,
})`
  margin-top: ${({ theme }) => theme.spacing.md};
`;
