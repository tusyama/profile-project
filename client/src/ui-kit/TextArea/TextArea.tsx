import { forwardRef } from 'react';
import { StyledTextArea } from './TextArea.styles';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ error, ...props }, ref) => {
    return <StyledTextArea ref={ref} $error={!!error} {...props} />;
  },
);

TextArea.displayName = 'TextArea';
