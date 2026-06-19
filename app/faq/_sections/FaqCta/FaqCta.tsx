import { Container } from '@/app/_components/Container/Container';
import styles from './FaqCta.module.css';

export default function FaqCta() {
  return (
    <section className={styles.faqCta}>
      <Container variant="faq" className={styles.shell}>
        <div className={styles.grid}>
          <div className={styles.supportCard}>
            <div className={styles.supportTop}>
              <span className={styles.dot} aria-hidden="true" />
              <span className={styles.supportLabel}>Support team — online</span>
            </div>

            <h2 className={styles.title}>Can&apos;t find what you need?</h2>
            <p className={styles.supportDescription}>
              Our support team replies in under 4 hours, around the clock. Live chat, email, or
              Discord — whichever is easiest for you.
            </p>

            <div className={styles.supportActions}>
              <button type="button" className={styles.primaryButton}>
                Open live chat
              </button>
              <button type="button" className={styles.secondaryButton}>
                Send a ticket
              </button>
              <button type="button" className={styles.secondaryButton}>
                Join Twitch
              </button>
            </div>
          </div>

          <div className={styles.suggestCard}>
            <p className={styles.suggestLabel}>Help improve this page</p>

            <h2 className={styles.title}>Suggest a question</h2>
            <p className={styles.suggestDescription}>
              Missing something? Tell us what you searched for and we will add it to the FAQ within
              a week.
            </p>

            <label className={styles.fieldLabel} htmlFor="faq-cta-question">
              Your question
            </label>
            <input
              id="faq-cta-question"
              className={styles.input}
              type="text"
              placeholder='Your question (e.g. "How do I host a private world?")'
            />

            <label className={styles.fieldLabel} htmlFor="faq-cta-category">
              Category
            </label>
            <button id="faq-cta-category" type="button" className={styles.select}>
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
