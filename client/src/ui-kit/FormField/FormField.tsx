import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import styled from 'styled-components';
import { Stack } from '../Stack/Stack';

const Wrapper = styled(Stack).attrs({
  $direction: 'column',
  $gap: 'sm',
})``;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const ErrorText = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.error};
`;

const Honeypot = styled.div`
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
`;

export interface FormFieldProps {
  label?: string;
  error?: string;
  children: ReactNode;
  htmlFor?: string;
  honeypot?: boolean;
}

export function FormField({ label, error, children, htmlFor, honeypot }: FormFieldProps) {
  if (honeypot) {
    return <Honeypot aria-hidden="true">{children}</Honeypot>;
  }

  const errorId = htmlFor ? `${htmlFor}-error` : undefined;

  const enhancedChild =
    isValidElement(children) && htmlFor
      ? cloneElement(children as ReactElement<Record<string, unknown>>, {
          'aria-invalid': error ? true : undefined,
          'aria-describedby': error && errorId ? errorId : undefined,
        })
      : children;

  return (
    <Wrapper>
      {label && htmlFor && <Label htmlFor={htmlFor}>{label}</Label>}
      {enhancedChild}
      {error && (
        <ErrorText id={errorId} role="alert">
          {error}
        </ErrorText>
      )}
    </Wrapper>
  );
}
