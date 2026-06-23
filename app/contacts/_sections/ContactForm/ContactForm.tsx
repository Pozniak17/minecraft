'use client';

import { FormEvent, useState } from 'react';
import { CONTACT_TOPICS, SUPPORT_EMAIL } from '@/lib/data/contacts';
import styles from './ContactForm.module.css';

type FormStatus = 'idle' | 'submitting' | 'sent';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!name.trim() || !email.trim() || !topic || !message.trim()) {
      setFormError('Please fill in all fields.');
      return;
    }

    const topicLabel = CONTACT_TOPICS.find(item => item.value === topic)?.label ?? topic;
    const subject = encodeURIComponent(`Support: ${topicLabel}`);
    const body = encodeURIComponent(
      `Name: ${name.trim()}\nEmail: ${email.trim()}\nTopic: ${topicLabel}\n\n${message.trim()}`,
    );

    setStatus('submitting');
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

    window.setTimeout(() => {
      setStatus('sent');
    }, 400);
  }

  return (
    <article className={styles.formCard} aria-labelledby="contact-form-heading">
      <p className={styles.formLabel}>Write to us</p>
      <h2 id="contact-form-heading" className={styles.formTitle}>
        Send a message
      </h2>
      <p className={styles.formDescription}>
        Fill in the form and we will reply to your email within one business day.
      </p>

      {status === 'sent' ? (
        <div className={styles.success} role="status">
          <p className={styles.successTitle}>Ready to send</p>
          <p className={styles.successText}>
            Your email app should open with the message pre-filled. If it does not, write to{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className={styles.successLink}>
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
          <button
            type="button"
            className={styles.resetButton}
            onClick={() => {
              setStatus('idle');
              setName('');
              setEmail('');
              setTopic('');
              setMessage('');
            }}
          >
            Send another
          </button>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {formError ? <p className={styles.formError}>{formError}</p> : null}

          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="contact-name">
                Your name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Steve"
                className={styles.input}
                value={name}
                onChange={event => setName(event.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="contact-email">
                Email address
              </label>
              <input
                id="contact-email"
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
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact-topic">
              Topic
            </label>
            <div className={styles.selectWrap}>
              <select
                id="contact-topic"
                name="topic"
                className={styles.select}
                value={topic}
                onChange={event => setTopic(event.target.value)}
                required
              >
                <option value="" disabled>
                  Pick a topic
                </option>
                {CONTACT_TOPICS.map(item => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <span className={styles.chevron} aria-hidden="true">
                ▾
              </span>
            </div>
          </div>

          <div className={`${styles.field} ${styles.messageField}`}>
            <label className={styles.label} htmlFor="contact-message">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              className={styles.textarea}
              placeholder="Tell us how we can help…"
              rows={5}
              value={message}
              onChange={event => setMessage(event.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Opening email…' : 'Send message'}
          </button>
        </form>
      )}
    </article>
  );
}
