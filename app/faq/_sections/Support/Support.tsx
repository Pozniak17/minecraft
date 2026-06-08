import { Container } from '@/app/_components/Container/Container';
import styles from './Support.module.css';

export default function Support() {
  return (
    <section className={styles.support}>
      <Container variant="faq">
        <div className={styles.content}>
          <div className={styles.card}>
            <div className={styles.top}>
              <span className={styles.dot} aria-hidden="true" />
              <span className={styles.topLabel}>Support online</span>
            </div>

            <h2 className={styles.title}>Can&apos;t find what you need?</h2>
            <p className={styles.description}>
              Our team replies in under 4 hours, around the clock. Pick whichever channel is
              easiest.
            </p>

            <div className={styles.actions}>
              <button type="button" className={styles.primaryButton}>
                Open live chat
              </button>
              <button type="button" className={styles.secondaryButton}>
                Send a ticket
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
