import styled from 'styled-components';

export const StyledTextArea = styled.textarea<{ $error: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid
    ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    border-color: ${({ theme, $error }) =>
      $error ? theme.colors.error : theme.colors.accent};
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;
