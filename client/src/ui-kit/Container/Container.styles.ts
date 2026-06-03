import styled from 'styled-components';

export const StyledContainer = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

export const Section = styled.section`
  padding: ${({ theme }) => theme.spacing.xxl} 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl} 0;
  }
`;
