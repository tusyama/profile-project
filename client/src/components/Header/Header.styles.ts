import styled from 'styled-components';
import { Link } from '../../ui-kit';

export const HeaderBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(10, 14, 20, 0.9);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

export const Logo = styled(Link)`
  font-weight: 700;
  font-size: 1.1rem;
  text-decoration: none !important;
`;

export const Nav = styled.nav<{ $open: boolean }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: fixed;
    inset: 60px 0 0 0;
    flex-direction: column;
    background: ${({ theme }) => theme.colors.bg};
    padding: ${({ theme }) => theme.spacing.xl};
    transform: translateX(${({ $open }) => ($open ? '0' : '100%')});
    transition: transform ${({ theme }) => theme.transitions.normal};
  }
`;

export const Burger = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;
