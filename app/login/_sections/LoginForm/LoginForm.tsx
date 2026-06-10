'use client';

import { isAxiosError } from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { login } from '@/lib/api/auth';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!email.trim() || !password) {
      setFormError('Enter your email and password.');
      return;
    }

    setStatus('submitting');
    try {
      await login({ username: email.trim(), password });
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('user_email', email.trim());
      }
      router.push('/profile');
      router.refresh();
    } catch (err) {
      setStatus('idle');
      if (isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        setFormError(typeof detail === 'string' ? detail : 'Invalid email or password.');
      } else {
        setFormError('Network error. Please try again.');
      }
    }
  }

  return (
    <div className={`login-page ${styles.root}`}>
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

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.head}>
              <h1 className={styles.title}>Welcome back</h1>
              <p className={styles.subtitle}>
                <span className={styles.subtitleMobile}>Sign in to continue building.</span>
                <span className={styles.subtitleDesktop}>
                  Sign in to continue building. Use the email and password you registered with.
                </span>
              </p>
            </div>

            {formError && <p className={styles.formError}>{formError}</p>}

            <div className={styles.field}>
              <label className={styles.label} htmlFor="login-email">
                Email address
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={styles.input}
                value={email}
                onChange={event => setEmail(event.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className={styles.input}
                value={password}
                onChange={event => setPassword(event.target.value)}
                required
              />
            </div>

            <div className={styles.helperRow}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={rememberMe}
                  onChange={event => setRememberMe(event.target.checked)}
                />
                <span className={styles.checkboxBox} aria-hidden="true" />
                <span className={styles.checkboxText}>Remember me</span>
              </label>
              <Link href="/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Logging in…' : 'Log in'}
            </button>

            <div className={styles.signupBlock}>
              <div className={styles.divider} role="presentation">
                <span className={styles.dividerLine} />
                <span className={styles.dividerLabel}>
                  <span className={styles.dividerLabelMobile}>New here?</span>
                  <span className={styles.dividerLabelDesktop}>New to the ecosystem?</span>
                </span>
                <span className={styles.dividerLine} />
              </div>

              <p className={styles.footerLink}>
                No account?
                <Link href="/register" className={styles.createLink}>
                  Create one →
                </Link>
              </p>
            </div>
          </form>

          <p className={styles.helpFoot}>
            Trouble signing in?{' '}
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

        <blockquote className={styles.quoteCard}>
          <p className={styles.quoteText}>
            &ldquo;Best survival server I have ever played on — fair economy, kind admins, zero
            lag.&rdquo;
          </p>
          <footer className={styles.quoteMeta}>
            <span className={styles.quoteAvatar}>R</span>
            <span className={styles.quoteAuthor}>
              <span className={styles.quoteName}>RedstoneKing</span>
              <span className={styles.quoteSince}>Player since 2024</span>
            </span>
          </footer>
        </blockquote>
      </div>
    </div>
  );
}
