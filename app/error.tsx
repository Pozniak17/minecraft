'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Container } from './_components/Container/Container';
import styles from './error.module.css';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.section}>
      <Container variant="faq">
        <div className={styles.content}>
          <span className={styles.badge}>
            <span />
            Error — something went wrong
          </span>

          <h1 className={styles.title}>Crafty hit a wall</h1>
          <p className={styles.text}>
            An unexpected error stopped this page from loading. You can try again or head back home.
          </p>

          {error?.message ? <p className={styles.details}>{error.message}</p> : null}

          <div className={styles.actions}>
            <button type="button" onClick={reset} className={styles.button}>
              <span>↻</span>Try again
            </button>
            <Link href="/" className={styles.backLink}>
              <span>←</span>Go back
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
