import styled from 'styled-components';
import { Stack } from '../../ui-kit';

export const Row = styled(Stack).attrs({
  $direction: 'row',
  $gap: 'sm',
  $wrap: true,
})`
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const Preview = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
`;

export const ErrorWrap = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
`;
