import styles from './Footer.module.scss';

export function Footer() {
  return (
    <footer className={styles.bar}>
      <div className="container">
        <p className="text-muted">
          © {new Date().getFullYear()} Артем Репин ·{' '}
          <a
            className="link"
            href="https://github.com/tusyama"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
