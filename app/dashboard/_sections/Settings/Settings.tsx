'use client';

import { isAxiosError } from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import { restorePassword, changePassword } from '@/lib/api/auth';
import styles from './Settings.module.css';

type Step = 'request' | 'reset' | 'done';

function errorText(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    return fallback;
  }
  return 'Network error. Please try again.';
}

export default function Settings() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<Step>('request');
  const [tmpPassword, setTmpPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem('user_email') ?? '';
    setEmail(stored);
  }, []);

  async function handleRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!email.trim()) {
      setError('Enter your account email.');
      return;
    }

    setStatus('submitting');
    try {
      await restorePassword({ email: email.trim() });
      setStep('reset');
      setNotice('We emailed you a temporary password. Enter it below with your new password.');
    } catch (err) {
      setError(errorText(err, 'Could not send the temporary password.'));
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
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setStatus('submitting');
    try {
      await changePassword({
        email: email.trim(),
        tmp_password: tmpPassword,
        new_password: newPassword,
      });
      setStep('done');
      setNotice(null);
      setTmpPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(errorText(err, 'Could not change the password.'));
    } finally {
      setStatus('idle');
    }
  }

  function restart() {
    setError(null);
    setNotice(null);
    setStep('request');
  }

  return (
    <div className={styles.shell}>
      <div className={styles.root}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Settings</span>
          <h1 className={styles.title}>Account settings</h1>
          <p className={styles.subtitle}>Manage your account security and credentials.</p>
        </header>

        <section className={styles.card}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>Change password</h2>
            <p className={styles.cardDesc}>
              For your security we send a temporary password to your email, then you set a new one.
            </p>
          </div>

          {error && <p className={styles.formError}>{error}</p>}
          {notice && <p className={styles.help}>{notice}</p>}

          {step === 'done' ? (
            <div className={styles.success}>
              <p className={styles.successText}>Your password has been changed successfully.</p>
              <button type="button" className={styles.secondaryBtn} onClick={restart}>
                Change again
              </button>
            </div>
          ) : step === 'request' ? (
            <form className={styles.form} onSubmit={handleRequest} noValidate>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="settings-email">
                  Account email
                </label>
                <input
                  id="settings-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={styles.input}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <p className={styles.help}>We will send the temporary password to this address.</p>
              </div>

              <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending…' : 'Send temporary password'}
              </button>
            </form>
          ) : (
            <form className={styles.form} onSubmit={handleReset} noValidate>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="settings-tmp">
                  Temporary password
                </label>
                <input
                  id="settings-tmp"
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
                <label className={styles.label} htmlFor="settings-new">
                  New password
                </label>
                <input
                  id="settings-new"
                  name="new_password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Choose a new password"
                  className={styles.input}
                  minLength={4}
                  maxLength={24}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="settings-confirm">
                  Confirm new password
                </label>
                <input
                  id="settings-confirm"
                  name="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat your new password"
                  className={styles.input}
                  minLength={4}
                  maxLength={24}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className={styles.actions}>
                <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Saving…' : 'Save new password'}
                </button>
                <button type="button" className={styles.secondaryBtn} onClick={restart}>
                  Request a new code
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
