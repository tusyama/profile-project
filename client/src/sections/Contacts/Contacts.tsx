import { ContactForm } from '@/components/ContactForm/ContactForm';
import styles from './Contacts.module.scss';

export function Contacts() {
  return (
    <section className="section" id="contact">
      <div className="container">
        <h2 className="h2">Контакты</h2>
        <div className={styles.links}>
          <p className="text-body">
            Email:{' '}
            <a className="link" href="mailto:lisesx@gmail.com">
              lisesx@gmail.com
            </a>
          </p>
          <p className="text-body">
            GitHub:{' '}
            <a
              className="link"
              href="https://github.com/tusyama"
              target="_blank"
              rel="noopener noreferrer"
            >
              tusyama
            </a>
          </p>
        </div>
        <h3 className="h3">Форма обратной связи</h3>
        <ContactForm />
      </div>
    </section>
  );
}
