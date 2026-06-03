import styled from 'styled-components';
import { Stack } from '@/ui-kit';

export const ContactLinks = styled(Stack).attrs({
  $direction: 'row',
  $gap: 'lg',
  $wrap: true,
})`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;
