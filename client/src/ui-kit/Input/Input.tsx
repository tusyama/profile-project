import { forwardRef } from 'react';
import { StyledInput } from './Input.styles';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, ...props }, ref) => {
    return <StyledInput ref={ref} $error={!!error} {...props} />;
  },
);

Input.displayName = 'Input';
