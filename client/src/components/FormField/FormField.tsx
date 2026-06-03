import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import styles from './FormField.module.scss';

export interface FormFieldProps {
  label?: string;
  error?: string;
  children: ReactNode;
  htmlFor?: string;
  honeypot?: boolean;
}

export function FormField({ label, error, children, htmlFor, honeypot }: FormFieldProps) {
  if (honeypot) {
    return <div className="honeypot">{children}</div>;
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
    <div className={styles.field}>
      {label && htmlFor && (
        <label className={styles.label} htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {enhancedChild}
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
