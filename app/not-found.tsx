import Link from 'next/link';
import { Container } from './_components/Container/Container';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.section}>
      <Container variant="faq">
        <div className={styles.content}>
          <span className={styles.badgeMobile}>
            <span></span>Page not found
          </span>

          <span className={styles.badgeDesktop}>
            <span></span>Error 404 — page not found
          </span>
          <h1 className={styles.title}>Lost in the void</h1>
          <p className={styles.textMobile}>
            Crafty wandered too far. The page may have been moved or never existed.
          </p>
          <p className={styles.textDesktop}>
            Looks like Crafty wandered too far. The page you were looking for may have been moved,
            renamed, or never existed in the first place.
          </p>
          <Link href="/" className={styles.backLink}>
            <span>←</span>Go back
          </Link>
        </div>
      </Container>
    </div>
  );
}
