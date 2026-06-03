import { Spinner } from '@/ui-kit/Spinner/Spinner';
import type { ButtonVariant } from '@/ui-kit/types/button';
import { StyledButton } from './Button.styles';

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
