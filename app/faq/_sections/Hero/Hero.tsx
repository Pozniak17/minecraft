import { Container } from '@/app/_components/Container/Container';
import { Badge } from '@/app/_components/Badge/Badge';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Container variant="blog" className={styles.content}>
        <div className={styles.head}>
          <Badge className={styles.badge}>FAQ</Badge>
          <h1 className={styles.title}>Frequently asked questions</h1>
          <p className={styles.description}>
            Quick answers about servers, the store, your account, and how to get started.
          </p>
        </div>

        <div className={styles.search}>
          <span className={styles.searchIcon} aria-hidden="true">
            ⌕
          </span>
          <input className={styles.input} type="search" placeholder="Search questions…" />
          <button type="button" className={styles.searchButton}>
            Search
          </button>
        </div>
      </Container>
    </section>
  );
}
