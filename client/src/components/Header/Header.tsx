import { useEffect, useState } from 'react';
import { Container, Link } from '../../ui-kit';
import { NAV_ITEMS } from '../../constants/navigation';
import { Burger, HeaderBar, Inner, Logo, Nav } from './Header.styles';

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <HeaderBar>
      <Container>
        <Inner>
          <Logo href="#">Артем Репин</Logo>
          <Burger
            type="button"
            aria-label="Меню"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            ☰
          </Burger>
          <Nav $open={open}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </Nav>
        </Inner>
      </Container>
    </HeaderBar>
  );
}
