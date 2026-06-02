import styles from './AboutServers.module.css';
import { Container } from '@/app/_components/Container/Container';
import CardList from './CardList/CardList';

export default function AboutServers() {
  return (
    <Container>
      <main className={styles.section}>
        <span className={styles.badge}>World</span>
        <h2 className={styles.title}>3 unique worlds — choose your path</h2>
        <p className={styles.description}>
          Pick the playstyle that fits you best. Each server is hand-tuned with custom plugins and a
          dedicated community.
        </p>
        <CardList />
      </main>
    </Container>
  );
}
