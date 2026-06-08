import { Container } from '@/app/_components/Container/Container';
import styles from './Suggest.module.css';

export default function Suggest() {
  return (
    <section className={styles.suggest}>
      <Container variant="faq">
        <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.top}>
            <span className={styles.icon} aria-hidden="true">
              💡
            </span>
            <span className={styles.topLabel}>Help improve this page</span>
          </div>

          <h2 className={styles.title}>Suggest a question</h2>
          <p className={styles.description}>
            Missing something? Tell us what you searched for and we will add it within a week.
          </p>

          <label className={styles.fieldLabel} htmlFor="faq-suggest-question">
            Your question
          </label>
          <input
            id="faq-suggest-question"
            className={styles.input}
            type="text"
            placeholder="Your question"
          />

          <label className={styles.fieldLabel} htmlFor="faq-suggest-category">
            Category
          </label>
          <button id="faq-suggest-category" type="button" className={styles.select}>
            <span className={styles.selectPlaceholder}>Category — pick one</span>
            <span className={styles.chevron} aria-hidden="true">
              ▾
            </span>
          </button>

          <button type="button" className={styles.submit}>
            Submit suggestion
          </button>
        </div>
        </div>
      </Container>
    </section>
  );
}
