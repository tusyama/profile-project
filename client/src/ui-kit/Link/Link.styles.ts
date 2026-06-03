import styled from 'styled-components';

export const Link = styled.a`
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.accentHover};
    text-decoration: underline;
  }
`;
