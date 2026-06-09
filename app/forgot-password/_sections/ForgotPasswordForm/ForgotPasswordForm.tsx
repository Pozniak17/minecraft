'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent } from 'react';
import styles from './ForgotPasswordForm.module.css';

const EXPECT_ITEMS = [
  'You will receive an email within 1–2 minutes.',
  'Click the link to set a new password.',
  'Old password stops working after reset.',
] as const;

export default function ForgotPasswordForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.head}>
              <h1 className={styles.title}>Reset your password</h1>
              <p className={styles.subtitle}>
                <span className={styles.subtitleMobile}>
                  Enter the email you registered with. We will send a one-time link valid for 30
                  minutes.
                </span>
                <span className={styles.subtitleDesktop}>
                  Enter the email you registered with. We will send a one-time link to set a new
                  password. The link is valid for 30 minutes.
                </span>
              </p>
            </div>

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
                required
              />
              <p className={styles.help}>
                <span className={styles.helpMobile}>We will send the reset link here.</span>
                <span className={styles.helpDesktop}>
                  We will send the reset link to this address.
                </span>
              </p>
            </div>

            <button type="submit" className={styles.submit}>
              Send reset link
            </button>

            <div className={styles.loginBlock}>
              <div className={styles.divider} role="presentation">
                <span className={styles.dividerLine} />
                <span className={styles.dividerLabel}>Or</span>
                <span className={styles.dividerLine} />
              </div>

              <p className={styles.footerLink}>
                <span>Remembered it?</span>
                <Link href="/login" className={styles.loginLink}>
                  Back to login →
                </Link>
              </p>
            </div>
          </form>

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
