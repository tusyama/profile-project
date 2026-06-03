import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { NAV_ITEMS } from '@/constants/navigation';
import styles from './Header.module.scss';

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
    <header className={styles.bar}>
      <div className="container">
        <div className={styles.inner}>
          <a className={styles.logo} href="#">
            Артем Репин
          </a>
          <button
            type="button"
            className={styles.burger}
            aria-label="Меню"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            ☰
          </button>
          <nav className={styles.nav}>
            {NAV_ITEMS.map((item) => (
              <a key={item.href} className="link" href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
      {createPortal(
        <nav
          className={`${styles.mobileNav} ${open ? styles.mobileNavOpen : ''}`}
          aria-hidden={!open}
        >
          {NAV_ITEMS.map((item) => (
            <a key={item.href} className="link" href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>,
        document.body,
      )}
    </header>
  );
}
