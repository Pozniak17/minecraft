import Link from 'next/link';
import { Container } from '@/app/_components/Container/Container';
import styles from './Support.module.css';

export default function Support() {
  return (
    <section id="contacts" className={styles.support}>
      <Container variant="faq">
        <div className={styles.content}>
          <div className={styles.card}>
            <p className={styles.label}>Live support online</p>
            <h2 className={styles.title}>Still need help?</h2>
            <p className={styles.description}>
              Chat with us 24/7 or send a ticket — we usually reply within 4 hours.
            </p>
            <Link href="/contacts" className={styles.primaryButton}>
              Send a ticket
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
