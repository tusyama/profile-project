import styled from 'styled-components';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  $external?: boolean;
}

export const Link = styled.a<LinkProps>`
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.accentHover};
    text-decoration: underline;
  }
`;
