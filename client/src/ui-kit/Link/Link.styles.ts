import styled from 'styled-components';

export interface LinkStyleProps {
  $external?: boolean;
}

export const Link = styled.a<LinkStyleProps>`
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.accentHover};
    text-decoration: underline;
  }
`;
