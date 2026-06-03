import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { ErrorText, Honeypot, Label, Wrapper } from './FormField.styles';

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
