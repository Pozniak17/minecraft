'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const [rememberMe, setRememberMe] = useState(true);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
                Sign in to continue building. Use the email and password you registered with.
              </p>
            </div>

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

            <button type="submit" className={styles.submit}>
              Log in
            </button>

            <div className={styles.signupBlock}>
              <div className={styles.divider} role="presentation">
                <span className={styles.dividerLine} />
                <span className={styles.dividerLabel}>New to the ecosystem?</span>
                <span className={styles.dividerLine} />
              </div>

              <p className={styles.footerLink}>
                Don&apos;t have an account?{' '}
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
