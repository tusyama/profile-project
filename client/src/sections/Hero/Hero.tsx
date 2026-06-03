import styles from './Hero.module.scss';

export function Hero() {
  return (
    <section className="section">
      <div className="container">
        <div className={styles.inner}>
          <p className={styles.tagline}>Fullstack / Backend · Middle+ / Senior</p>
          <h1 className="h1">Артем Репин</h1>
          <p className="text-muted">
            Fullstack-разработчик с ~4 годами коммерческого опыта. EdTech, AI-интеграции в
            продакшне, архитектура и продукт end-to-end.
          </p>
          <a className={styles.cta} href="#contact">
            <button type="button" className="btn">
              Связаться
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
