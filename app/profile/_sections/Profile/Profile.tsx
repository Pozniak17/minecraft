'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logout } from '@/lib/api/auth';
import styles from './Profile.module.css';

export default function Profile() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setEmail(window.localStorage.getItem('user_email') ?? '');
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
    } catch {
      // навіть якщо запит впав — чистимо клієнтський стан і виходимо
    } finally {
      window.localStorage.removeItem('user_email');
      router.push('/');
      router.refresh();
    }
  }

  const initial = email ? email.charAt(0).toUpperCase() : 'U';

  return (
    <section className={styles.root}>
      <div className={styles.container}>
        <header className={styles.head}>
          <div className={styles.identity}>
            <span className={styles.avatar} aria-hidden="true">
              {initial}
            </span>
            <div className={styles.identityText}>
              <h1 className={styles.title}>My account</h1>
              <p className={styles.email}>{email || 'Welcome back'}</p>
            </div>
          </div>
          <button
            type="button"
            className={styles.logout}
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? 'Logging out…' : 'Log out'}
          </button>
        </header>

        <div className={styles.grid}>
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>Order history</h2>
            <p className={styles.cardText}>Your purchases will appear here.</p>
            <span className={styles.soon}>Coming soon</span>
          </article>

          <article className={styles.card}>
            <h2 className={styles.cardTitle}>Privileges</h2>
            <p className={styles.cardText}>Donate groups and perks linked to your account.</p>
            <span className={styles.soon}>Coming soon</span>
          </article>

          <article className={styles.card}>
            <h2 className={styles.cardTitle}>Security</h2>
            <p className={styles.cardText}>Change your password and manage access.</p>
            <span className={styles.soon}>Coming soon</span>
          </article>
        </div>
      </div>
    </section>
  );
}
