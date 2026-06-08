import { Container } from '@/app/_components/Container/Container';
import styles from './ArticleCta.module.css';

export default function ArticleCta() {
  return (
    <section className={styles.cta}>
      <Container variant="faq">
        <div className={styles.inner}>
          <div className={styles.card}>
            <div className={styles.content}>
              <div className={styles.status}>
                <span className={styles.dot} aria-hidden="true" />
                <span className={`${styles.statusLabel} ${styles.mobileOnly}`}>Support online</span>
                <span className={`${styles.statusLabel} ${styles.desktopOnly}`}>Support — online</span>
              </div>

              <h2 className={styles.title}>Still need help?</h2>

              <p className={`${styles.description} ${styles.mobileOnly}`}>
                Support team replies within 4 h, 24/7.
              </p>
              <p className={`${styles.description} ${styles.desktopOnly}`}>
                Our support team replies within 4 hours, around the clock. Live chat, email ticket, or
                Discord — pick whichever is fastest for you.
              </p>
            </div>

            <div className={styles.action}>
              <button type="button" className={styles.button}>
                Open live chat
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
