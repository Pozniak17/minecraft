import { Badge } from '@/app/_components/Badge/Badge';
import AuthAwareLink from '@/app/_components/AuthAwareLink/AuthAwareLink';
import { Container } from '@/app/_components/Container/Container';
import styles from './Hero.module.css';

export default function Hero({ isAuthed = false }: { isAuthed?: boolean }) {
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
          <AuthAwareLink isAuthed={isAuthed} intent="play" className={styles.btnPrimary}>
            Start Playing
          </AuthAwareLink>
          <AuthAwareLink isAuthed={isAuthed} intent="store" className={styles.btnSecondary}>
            Go to Store
          </AuthAwareLink>
        </div>
      </Container>
    </section>
  );
}
