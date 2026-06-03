import { CASES } from '@/constants/cases';
import styles from './Cases.module.scss';

export function Cases() {
  return (
    <section className="section" id="cases">
      <div className="container">
        <h2 className="h2">Кейсы</h2>
        <div className={styles.grid}>
          {CASES.map((c) => (
            <article key={c.title} className="card">
              <h3 className="h3">{c.title}</h3>
              <p className="text-muted">{c.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
