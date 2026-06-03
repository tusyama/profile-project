import styled from 'styled-components';
import { Container, Text, Link } from '@/ui-kit';

const FooterBar = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

export function Footer() {
  return (
    <FooterBar>
      <Container>
        <Text $variant="muted">
          © {new Date().getFullYear()} Артем Репин ·{' '}
          <Link href="https://github.com/tusyama" target="_blank" rel="noopener noreferrer">
            GitHub
          </Link>
        </Text>
      </Container>
    </FooterBar>
  );
}
