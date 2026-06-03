import { SKILLS } from '@/constants/skills';
import styles from './About.module.scss';

export function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <h2 className="h2">Обо мне</h2>
        <p className="text-body">
          В разработке с 2021 года, из них около четырёх — коммерческий опыт в EdTech-стартапе.
          Прошёл путь от Junior до Senior, отвечал за техническую сторону продукта: архитектура,
          разработка, оптимизация, DevOps, найм и менторство.
        </p>
        <p className="text-muted">
          Направления: backend и fullstack, интеграция AI в продакшн, реалтайм, Web3
          (смарт-контракты).
        </p>
        <div className={styles.skills}>
          {SKILLS.map((s) => (
            <span key={s} className="badge">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
