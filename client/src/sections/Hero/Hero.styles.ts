import styled from 'styled-components';

export const HeroInner = styled.div`
  padding-top: ${({ theme }) => theme.spacing.xl};
`;

export const Tagline = styled.p`
  font-size: 1.15rem;
  color: ${({ theme }) => theme.colors.accent};
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
`;

export const CtaLink = styled.a`
  display: inline-block;
  text-decoration: none;
`;
