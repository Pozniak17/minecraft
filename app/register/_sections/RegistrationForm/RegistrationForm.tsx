'use client';

import { isAxiosError } from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { register as registerUser, sendEmailCode } from '@/lib/api/auth';
import { initSeon, getSeonSession } from '@/lib/client/seon';
import styles from './RegistrationForm.module.css';

type FieldErrors = Partial<Record<'email' | 'password', string>>;

function mapApiErrors(data: unknown): { fields: FieldErrors; general: string | null } {
  const fields: FieldErrors = {};
  let general: string | null = null;

  if (typeof data === 'string') {
    return { fields, general: data };
  }

  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    (['email', 'password'] as const).forEach(key => {
      const value = obj[key];
      if (Array.isArray(value) && value.length) fields[key] = String(value[0]);
      else if (typeof value === 'string') fields[key] = value;
    });
    if (typeof obj.detail === 'string') general = obj.detail;
  }

  return { fields, general };
}

type PasswordStrength = {
  filledBars: number;
  label: string;
  hint: string;
  color: string;
};

function getPasswordStrength(password: string): PasswordStrength | null {
  if (!password) return null;

  let points = 0;
  if (password.length >= 8) points++;
  if (/[0-9]/.test(password)) points++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points++;
  if (/[^a-zA-Z0-9]/.test(password)) points++;

  if (points <= 1) {
    return {
      filledBars: 1,
      label: 'Weak',
      hint: 'Use at least 8 characters.',
      color: '#ff6b6b',
    };
  }

  if (points === 2) {
    return {
      filledBars: 2,
      label: 'Fair',
      hint: 'Add a number or uppercase letter.',
      color: '#ffb347',
    };
  }

  if (points === 3) {
    return {
      filledBars: 3,
      label: 'Okay',
      hint: 'Good — try adding a symbol.',
      color: '#ffb347',
    };
  }

  return {
    filledBars: 4,
    label: 'Strong',
    hint: 'Great password!',
    color: '#bde153',
  };
}

const STATS = [
  { value: '12,000+', label: 'active players' },
  { value: '4.8/5', label: 'community rating' },
  { value: '24/7', label: 'support' },
] as const;

export default function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  useEffect(() => {
    // Стартуємо SEON-агент на відкритті форми (поведінковий аналіз для антифроду).
    initSeon();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const errors: FieldErrors = {};
    if (!email.trim()) errors.email = 'Email is required.';
    if (password.length < 4 || password.length > 24) {
      errors.password = 'Password must be 4–24 characters.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    if (confirmPassword !== password) {
      setFormError('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setFormError('Please accept the Terms of Service and Privacy Policy.');
      return;
    }

    setStatus('submitting');
    try {
      const seonSession = await getSeonSession();
      await registerUser({ password, email: email.trim(), seonSession });
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('pending_verify_email', email.trim());
      }
      try {
        await sendEmailCode({ email: email.trim() });
      } catch {
        // лист можна перевідправити з екрана успіху
      }
      setStatus('success');
    } catch (err) {
      setStatus('idle');
      if (isAxiosError(err)) {
        const { fields, general } = mapApiErrors(err.response?.data);
        setFieldErrors(fields);
        setFormError(general ?? 'Something went wrong. Please try again.');
      } else {
        setFormError('Network error. Please try again.');
      }
    }
  }

  async function handleResend() {
    setResending(true);
    setResent(false);
    try {
      await sendEmailCode({ email: email.trim() });
      setResent(true);
    } catch {
      setFormError('Could not resend the email. Please try again later.');
    } finally {
      setResending(false);
    }
  }

  return (
    <div className={`register-page ${styles.root}`}>
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

          {status === 'success' ? (
            <div className={styles.success}>
              <div className={styles.head}>
                <h1 className={styles.title}>Check your email</h1>
                <p className={styles.subtitle}>
                  We sent a verification link to{' '}
                  <span className={styles.successEmail}>{email}</span>. Open it to activate your
                  account, then sign in.
                </p>
              </div>

              {formError && <p className={styles.formError}>{formError}</p>}

              <Link href="/login" className={styles.successCta}>
                Go to login
              </Link>

              <p className={styles.footerLink}>
                <span>Didn&apos;t get the email?</span>
                <button
                  type="button"
                  className={styles.linkButton}
                  onClick={handleResend}
                  disabled={resending}
                >
                  {resending ? 'Sending…' : resent ? 'Sent again' : 'Resend email'}
                </button>
              </p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.head}>
                <h1 className={styles.title}>Create your account</h1>
                <p className={styles.subtitle}>
                  <span className={styles.subtitleMobile}>
                    Join 12,000+ players. Takes under a minute.
                  </span>
                  <span className={styles.subtitleDesktop}>
                    Join 12,000+ players already in the ecosystem. Free, takes under a minute.
                  </span>
                </p>
              </div>

              {formError && <p className={styles.formError}>{formError}</p>}

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
                  className={[styles.input, fieldErrors.email && styles.inputError]
                    .filter(Boolean)
                    .join(' ')}
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  required
                />
                {fieldErrors.email && (
                  <p className={styles.fieldError}>{fieldErrors.email}</p>
                )}
              </div>

              <div className={styles.passwordField}>
                <label className={styles.label} htmlFor="register-password">
                  Password
                </label>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Strong password"
                  className={[
                    styles.input,
                    password && styles.inputFilled,
                    fieldErrors.password && styles.inputError,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  minLength={4}
                  maxLength={24}
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  required
                />
                {fieldErrors.password && (
                  <p className={styles.fieldError}>{fieldErrors.password}</p>
                )}

                {passwordStrength && (
                  <div className={styles.strength} aria-live="polite">
                    <div className={styles.strengthBars}>
                      {Array.from({ length: 4 }, (_, index) => (
                        <span
                          key={index}
                          className={styles.strengthBar}
                          style={{
                            background:
                              index < passwordStrength.filledBars
                                ? passwordStrength.color
                                : 'rgba(255, 255, 255, 0.08)',
                          }}
                        />
                      ))}
                    </div>
                    <div className={styles.strengthMeta}>
                      <span
                        className={styles.strengthLabel}
                        style={{ color: passwordStrength.color }}
                      >
                        {passwordStrength.label}
                      </span>
                      <span className={styles.strengthHint}>{passwordStrength.hint}</span>
                    </div>
                  </div>
                )}
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
                  placeholder="Repeat your password"
                  className={styles.input}
                  minLength={4}
                  maxLength={24}
                  value={confirmPassword}
                  onChange={event => setConfirmPassword(event.target.value)}
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

              <button
                type="submit"
                className={styles.submit}
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Creating account…' : 'Create account'}
              </button>

              <div className={styles.loginBlock}>
                <div className={styles.divider} role="presentation">
                  <span className={styles.dividerLine} />
                  <span className={styles.dividerLabel}>Already a member</span>
                  <span className={styles.dividerLine} />
                </div>

                <p className={styles.footerLink}>
                  <span>Already have an account?</span>
                  <Link href="/login" className={styles.loginLink}>
                    Log in →
                  </Link>
                </p>
              </div>
            </form>
          )}

          <p className={styles.helpFoot}>
            Need help signing up?{' '}
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

        <div className={styles.statsCard}>
          {STATS.map((stat, index) => (
            <div key={stat.label} className={styles.statGroup}>
              {index > 0 && <span className={styles.statDivider} aria-hidden="true" />}
              <div className={styles.statContent}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
