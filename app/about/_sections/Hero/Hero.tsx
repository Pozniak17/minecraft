import { Badge } from '@/app/_components/Badge/Badge';
import { Container } from '@/app/_components/Container/Container';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Container className={styles.content}>
        <Badge>About the project</Badge>
        <h1 className={styles.title}>Welcome to the Minecraft ecosystem!</h1>
        <p className={styles.description}>
          More than just Minecraft — a unique space for players, built by fans who live and breathe
          the craft.
        </p>

        <div className={styles.buttons}>
          <button type="button" className={styles.btnPrimary}>
            Start Playing
          </button>
          <button type="button" className={styles.btnSecondary}>
            Go to Store
          </button>
        </div>
      </Container>
    </section>
  );
}
