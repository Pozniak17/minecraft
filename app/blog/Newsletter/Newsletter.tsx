import { Container } from '@/app/_components/Container/Container';
import styles from './Newsletter.module.css';

export default function Newsletter() {
  return (
    <section className={styles.newsletter}>
      <Container variant="blog">
        <div className={styles.inner}>
          <div className={styles.head}>
            <span className={styles.badge}>Newsletter</span>
            <h2 className={styles.title}>Get the next dispatch in your inbox</h2>
            <p className={styles.description}>
              One email every other week. Server updates, new guides, and a single hand-picked
              community story. No spam, easy unsubscribe.{' '}
            </p>
          </div>
          <form className={styles.form}>
            <input type="email" placeholder="you@example.com" className={styles.input} />
            <button type="submit" className={styles.button}>
              Subscribe
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}
