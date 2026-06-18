'use client';

import Link from 'next/link';
import { useCallback, useSyncExternalStore } from 'react';
import styles from './CookieConsent.module.css';

const STORAGE_KEY = 'cookie-consent';
const CHANGE_EVENT = 'cookie-consent-change';

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function getSnapshot(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

// During SSR and the first hydration pass, report a decided state so the banner
// stays hidden and server/client markup match. After hydration the real value
// from localStorage is read.
function getServerSnapshot(): string {
  return 'ssr';
}

export function CookieConsent() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const persist = useCallback((value: 'accepted' | 'rejected') => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Storage unavailable (e.g. privacy mode) — still dismiss the banner.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  if (consent) {
    return null;
  }

  return (
    <div className={styles.root} role="dialog" aria-live="polite" aria-label="Cookie consent">
      <div className={styles.card}>
        <div className={styles.copy}>
          <p className={styles.title}>We use cookies</p>
          <p className={styles.text}>
            We use cookies to keep you signed in, secure your session, and improve your experience.
            Read more in our{' '}
            <Link href="/cookie-policy" className={styles.link}>
              Cookie Policy
            </Link>
            .
          </p>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.reject}
            onClick={() => persist('rejected')}
          >
            Reject
          </button>
          <button
            type="button"
            className={styles.accept}
            onClick={() => persist('accepted')}
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
