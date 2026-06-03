import styled from 'styled-components';
import { Stack } from '@/ui-kit/Stack/Stack.styles';

export const Wrapper = styled(Stack).attrs({
  $direction: 'column',
  $gap: 'sm',
})``;

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

export const ErrorText = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.error};
`;

export const Honeypot = styled.div`
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
`;
