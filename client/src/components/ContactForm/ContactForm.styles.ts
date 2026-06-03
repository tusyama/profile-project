import styled from 'styled-components';
import { Stack } from '@/ui-kit';

export const Form = styled(Stack).attrs({
  $direction: 'column',
  $gap: 'lg',
})`
  max-width: 520px;
`;
