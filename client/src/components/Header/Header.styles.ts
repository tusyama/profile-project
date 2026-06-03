import styled from 'styled-components';
import { Link } from '@/ui-kit';

export const HeaderBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(10, 14, 20, 0.9);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    background: ${({ theme }) => theme.colors.bg};
    backdrop-filter: none;
  }
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

export const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

export const MobileNav = styled.nav<{ $open: boolean }>`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    position: fixed;
    top: ${({ theme }) => theme.layout.headerHeight};
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
    background-color: ${({ theme }) => theme.colors.bg};
    padding: ${({ theme }) => theme.spacing.xl};
    transform: translate3d(${({ $open }) => ($open ? '0, 0, 0' : '100%, 0, 0')});
    transition: transform ${({ theme }) => theme.transitions.normal};
    pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
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
