'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import styles from './RegistrationForm.module.css';

export default function RegistrationForm() {
  const [agreed, setAgreed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div className={styles.root}>
      <div className={styles.glowTop} aria-hidden="true">
        <Image src="/auth/glow-top.svg" alt="" width={561} height={561} priority />
      </div>
      <div className={styles.glowBottom} aria-hidden="true">
        <Image src="/auth/glow-bottom.svg" alt="" width={324} height={324} />
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
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

        <div className={styles.head}>
          <h1 className={styles.title}>Create your account</h1>
          <p className={styles.subtitle}>Join 12,000+ players. Takes under a minute.</p>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="register-email">
            Email address
          </label>
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={styles.input}
            required
          />
          <p className={styles.help}>We never share your email.</p>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="register-password">
            Password
          </label>
          <input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Strong password"
            className={styles.input}
            minLength={8}
            required
          />
          <p className={styles.help}>8+ chars, includes a number.</p>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="register-confirm-password">
            Confirm password
          </label>
          <input
            id="register-confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat password"
            className={styles.input}
            minLength={8}
            required
          />
        </div>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            className={styles.checkboxInput}
            checked={agreed}
            onChange={event => setAgreed(event.target.checked)}
            required
          />
          <span className={styles.checkboxBox} aria-hidden="true" />
          <span className={styles.checkboxText}>
            I agree to the{' '}
            <Link href="/terms" className={styles.checkboxLink}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy-policy" className={styles.checkboxLink}>
              Privacy Policy
            </Link>
          </span>
        </label>

        <button type="submit" className={styles.submit}>
          Create account
        </button>

        <div className={styles.divider} role="presentation">
          <span className={styles.dividerLine} />
          <span className={styles.dividerLabel}>Already a member</span>
          <span className={styles.dividerLine} />
        </div>

        <p className={styles.footerLink}>
          Already have an account?{' '}
          <Link href="/login" className={styles.loginLink}>
            Log in →
          </Link>
        </p>
      </form>
    </div>
  );
}
