'use client';

import { isAxiosError } from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { restorePassword, changePassword } from '@/lib/api/auth';
import styles from './ForgotPasswordForm.module.css';

const EXPECT_ITEMS = [
  'You will receive an email within 1–2 minutes.',
  'Use the temporary password to set a new one.',
  'Old password stops working after reset.',
] as const;

function errorText(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    return fallback;
  }
  return 'Network error. Please try again.';
}

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [tmpPassword, setTmpPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!email.trim()) {
      setError('Enter your email address.');
      return;
    }

    setStatus('submitting');
    try {
      await restorePassword({ email: email.trim() });
      setStep('reset');
      setNotice('We emailed you a temporary password. Enter it below with your new password.');
    } catch (err) {
      setError(errorText(err, 'Could not send reset email.'));
    } finally {
      setStatus('idle');
    }
  }

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!tmpPassword || !newPassword) {
      setError('Enter the temporary password and your new password.');
      return;
    }
    if (newPassword.length < 4 || newPassword.length > 24) {
      setError('New password must be 4–24 characters.');
      return;
    }

    setStatus('submitting');
    try {
      await changePassword({
        email: email.trim(),
        tmp_password: tmpPassword,
        new_password: newPassword,
      });
      router.push('/login');
    } catch (err) {
      setError(errorText(err, 'Could not change password.'));
      setStatus('idle');
    }
  }

  return (
    <div className={`forgot-password-page ${styles.root}`}>
      <div className={styles.panelLeft}>
        <div className={styles.leftInner}>
          <div className={styles.topbar}>
            <Link href="/" className={styles.logo}>
              <Image
                src="/icons/icons/logo.webp"
                alt="Minecraft game logo"
                width={215}
                height={59}
                priority
              />
            </Link>
            <Link href="/" className={styles.backLink}>
              <span className={styles.backArrow} aria-hidden="true">
                ←
              </span>
              Back to home
            </Link>
          </div>

          {step === 'request' ? (
            <form className={styles.form} onSubmit={handleRequest} noValidate>
              <div className={styles.head}>
                <h1 className={styles.title}>Reset your password</h1>
                <p className={styles.subtitle}>
                  <span className={styles.subtitleMobile}>
                    Enter the email you registered with. We will email a temporary password.
                  </span>
                  <span className={styles.subtitleDesktop}>
                    Enter the email you registered with. We will email a temporary password you can
                    use to set a new one.
                  </span>
                </p>
              </div>

              {error && <p className={styles.formError}>{error}</p>}
              {notice && <p className={styles.help}>{notice}</p>}

              <div className={styles.field}>
                <label className={styles.label} htmlFor="forgot-email">
                  Email address
                </label>
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={styles.input}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <p className={styles.help}>
                  <span className={styles.helpMobile}>We will send the reset email here.</span>
                  <span className={styles.helpDesktop}>
                    We will send the temporary password to this address.
                  </span>
                </p>
              </div>

              <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending…' : 'Send reset email'}
              </button>

              <div className={styles.loginBlock}>
                <div className={styles.divider} role="presentation">
                  <span className={styles.dividerLine} />
                  <span className={styles.dividerLabel}>Or</span>
                  <span className={styles.dividerLine} />
                </div>

                <p className={styles.footerLink}>
                  <span>Already have a code?</span>
                  <button
                    type="button"
                    className={styles.loginLink}
                    onClick={() => {
                      setError(null);
                      setStep('reset');
                    }}
                  >
                    Enter it →
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form className={styles.form} onSubmit={handleReset} noValidate>
              <div className={styles.head}>
                <h1 className={styles.title}>Set a new password</h1>
                <p className={styles.subtitle}>
                  <span className={styles.subtitleMobile}>
                    Enter the temporary password and choose a new one.
                  </span>
                  <span className={styles.subtitleDesktop}>
                    Enter the temporary password from the email, then choose a new password (4–24
                    characters).
                  </span>
                </p>
              </div>

              {error && <p className={styles.formError}>{error}</p>}
              {notice && <p className={styles.help}>{notice}</p>}

              <div className={styles.field}>
                <label className={styles.label} htmlFor="reset-email">
                  Email address
                </label>
                <input
                  id="reset-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={styles.input}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="reset-tmp">
                  Temporary password
                </label>
                <input
                  id="reset-tmp"
                  name="tmp_password"
                  type="text"
                  autoComplete="one-time-code"
                  placeholder="From the email"
                  className={styles.input}
                  value={tmpPassword}
                  onChange={e => setTmpPassword(e.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="reset-new">
                  New password
                </label>
                <input
                  id="reset-new"
                  name="new_password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Choose a new password"
                  className={styles.input}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Saving…' : 'Save new password'}
              </button>

              <div className={styles.loginBlock}>
                <div className={styles.divider} role="presentation">
                  <span className={styles.dividerLine} />
                  <span className={styles.dividerLabel}>Or</span>
                  <span className={styles.dividerLine} />
                </div>

                <p className={styles.footerLink}>
                  <span>Need a new email?</span>
                  <button
                    type="button"
                    className={styles.loginLink}
                    onClick={() => {
                      setError(null);
                      setNotice(null);
                      setStep('request');
                    }}
                  >
                    Request again →
                  </button>
                </p>
              </div>
            </form>
          )}

          <p className={styles.helpFoot}>
            Can&apos;t access your email?{' '}
            <Link href="/faq" className={styles.supportLink}>
              Contact support
            </Link>
          </p>
        </div>
      </div>

      <div className={styles.panelRight}>
        <div className={styles.heroWrap}>
          <Image
            src="/auth/auth-menu.webp"
            alt="Minecraft characters in a forest landscape"
            fill
            className={styles.heroImage}
            sizes="(min-width: 1280px) 50vw, 0px"
            priority
          />
          <div className={styles.heroFade} />
        </div>

        <div className={styles.reassureCard}>
          <p className={styles.reassureTitle}>What to expect</p>
          <ul className={styles.reassureList}>
            {EXPECT_ITEMS.map(item => (
              <li key={item} className={styles.reassureItem}>
                <span className={styles.reassureDot} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
