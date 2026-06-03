import { Spinner } from '../Spinner/Spinner';
import { StyledButton, type ButtonVariant } from './Button.styles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  loading,
  fullWidth,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      $variant={variant}
      $fullWidth={!!fullWidth}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size={18} />}
      {children}
    </StyledButton>
  );
}
