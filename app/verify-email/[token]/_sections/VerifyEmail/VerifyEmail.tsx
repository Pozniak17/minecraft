'use client';

import { isAxiosError } from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { verifyEmailCode } from '@/lib/api/auth';
import styles from './VerifyEmail.module.css';

type Status = 'verifying' | 'success' | 'error' | 'needEmail';

const STORAGE_KEY = 'pending_verify_email';

function normalizeEmail(raw: string | null): string {
  if (!raw) return '';
  // у query-рядку "+" декодується як пробіл, а в email пробілів не буває — повертаємо назад
  return raw.replace(/ /g, '+').trim();
}

export default function VerifyEmail({
  token,
  email: emailFromUrl,
}: {
  token: string;
  email: string | null;
}) {
  const router = useRouter();
  const [email, setEmail] = useState(() => normalizeEmail(emailFromUrl));
  const [status, setStatus] = useState<Status>('verifying');
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  const runVerify = useCallback(
    async (targetEmail: string) => {
      setStatus('verifying');
      setError(null);
      try {
        await verifyEmailCode({ email: targetEmail, email_code: token });
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(STORAGE_KEY);
        }
        setStatus('success');
        setTimeout(() => router.push('/login'), 2200);
      } catch (err) {
        setStatus('error');
        if (isAxiosError(err)) {
          const detail = err.response?.data?.detail;
          setError(
            typeof detail === 'string'
              ? detail
              : 'Could not verify your email. The link may be invalid or expired.'
          );
        } else {
          setError('Network error. Please try again.');
        }
      }
    },
    [router, token]
  );

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let resolved = email;
    if (!resolved && typeof window !== 'undefined') {
      resolved = normalizeEmail(window.localStorage.getItem(STORAGE_KEY));
    }

    if (resolved) {
      setEmail(resolved);
      runVerify(resolved);
    } else {
      setStatus('needEmail');
    }
  }, [email, runVerify]);

  function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    runVerify(email.trim());
  }

  return (
    <div className={`verify-email-page ${styles.root}`}>
      <div className={styles.card}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/icons/icons/logo.webp"
            alt="Minecraft game logo"
            width={180}
            height={49}
            priority
          />
        </Link>

        {status === 'verifying' && (
          <div className={styles.block}>
            <span className={styles.spinner} aria-hidden="true" />
            <h1 className={styles.title}>Activating your account…</h1>
            <p className={styles.text}>Just a moment while we verify your email.</p>
          </div>
        )}

        {status === 'success' && (
          <div className={styles.block}>
            <span className={`${styles.badge} ${styles.badgeOk}`} aria-hidden="true">
              ✓
            </span>
            <h1 className={styles.title}>Email verified!</h1>
            <p className={styles.text}>Your account is active. Redirecting you to login…</p>
            <Link href="/login" className={styles.cta}>
              Go to login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className={styles.block}>
            <span className={`${styles.badge} ${styles.badgeError}`} aria-hidden="true">
              !
            </span>
            <h1 className={styles.title}>Verification failed</h1>
            <p className={styles.text}>{error}</p>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cta}
                onClick={() => email.trim() && runVerify(email.trim())}
              >
                Try again
              </button>
              <Link href="/register" className={styles.secondaryLink}>
                Back to sign up
              </Link>
            </div>
          </div>
        )}

        {status === 'needEmail' && (
          <form className={styles.block} onSubmit={handleEmailSubmit} noValidate>
            <h1 className={styles.title}>Confirm your email</h1>
            <p className={styles.text}>
              Enter the email you registered with to activate your account.
            </p>
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={styles.input}
              value={email}
              onChange={event => setEmail(event.target.value)}
              required
            />
            <button type="submit" className={styles.cta}>
              Verify email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
