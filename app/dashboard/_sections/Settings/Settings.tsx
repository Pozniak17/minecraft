'use client';

import { isAxiosError } from 'axios';
import { FormEvent, useCallback, useEffect, useId, useRef, useState } from 'react';
import { changePassword, restorePassword } from '@/lib/api/auth';
import styles from './Settings.module.css';

type SectionId = 'profile' | 'security' | 'notifications' | 'linked' | 'danger';

type PasswordStep = 'idle' | 'form' | 'done';

const SECTIONS: { id: SectionId; label: string; danger?: boolean }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'security', label: 'Security' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'linked', label: 'Linked accounts' },
  { id: 'danger', label: 'Danger zone', danger: true },
];

const COUNTRIES = ['Ukraine', 'Poland', 'Germany', 'United States', 'United Kingdom'] as const;

const NOTIFICATIONS = [
  {
    id: 'serverUpdates',
    title: 'Server updates',
    hintMobile: 'New patches and maintenance.',
    hintDesktop: 'When new patches release or maintenance is scheduled.',
    emailDefault: true,
    pushDefault: true,
  },
  {
    id: 'purchaseConfirmations',
    title: 'Purchase confirmations',
    hintMobile: 'Receipts and order updates.',
    hintDesktop: 'Receipts and order updates by email.',
    emailDefault: true,
    pushDefault: false,
  },
  {
    id: 'tournamentReminders',
    title: 'Tournament reminders',
    hintMobile: '24 h before start.',
    hintDesktop: '24 h before a tournament you signed up for starts.',
    emailDefault: false,
    pushDefault: true,
  },
  {
    id: 'marketingNews',
    title: 'Marketing & news',
    hintMobile: 'Weekly dispatch.',
    hintDesktop: 'Weekly dispatch with guides, community stories, and promos.',
    emailDefault: true,
    pushDefault: false,
  },
] as const;

const LINKED_ACCOUNTS = [
  {
    id: 'java',
    icon: 'M',
    name: 'Minecraft Java',
    detailMobile: 'RedstoneKing • UUID 8d4c…',
    detailDesktop: 'RedstoneKing • UUID 8d4c…3a91',
    status: 'linked' as const,
    action: 'unlink' as const,
  },
  {
    id: 'bedrock',
    icon: 'M',
    name: 'Minecraft Bedrock',
    detailMobile: 'Not yet connected',
    detailDesktop: 'Not yet connected',
    status: 'notLinked' as const,
    action: 'link' as const,
  },
  {
    id: 'discord',
    icon: 'D',
    name: 'Discord',
    detailMobile: '@redstoneking#4291',
    detailDesktop: '@redstoneking#4291',
    status: 'linked' as const,
    action: 'unlink' as const,
  },
  {
    id: 'microsoft',
    icon: 'M',
    name: 'Microsoft account',
    detailMobile: 'Linked via Minecraft',
    detailDesktop: 'Linked via Minecraft',
    status: 'linked' as const,
    action: 'unlink' as const,
  },
];

function errorText(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    return fallback;
  }
  return 'Network error. Please try again.';
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={[styles.toggle, checked && styles.toggleOn].filter(Boolean).join(' ')}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.toggleKnob} />
    </button>
  );
}

function scrollSubnavItemIntoView(button: HTMLButtonElement | undefined) {
  button?.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
  });
}

export default function Settings() {
  const sectionSelectId = useId();
  const sectionRefs = useRef<Partial<Record<SectionId, HTMLElement | null>>>({});
  const subnavButtonRefs = useRef(new Map<SectionId, HTMLButtonElement>());
  const isProgrammaticScroll = useRef(false);
  const lastSyncedSectionId = useRef<SectionId>('profile');

  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [nickname, setNickname] = useState('');
  const [country, setCountry] = useState<(typeof COUNTRIES)[number]>('Ukraine');
  const [bio, setBio] = useState(
    'Redstone tinkerer since 2022. Mostly Skyblock. Always down to help new players.',
  );
  const [initial, setInitial] = useState('R');
  const [activeSection, setActiveSection] = useState<SectionId>('profile');

  const [twoFactor, setTwoFactor] = useState(true);
  const [notifications, setNotifications] = useState(() =>
    Object.fromEntries(
      NOTIFICATIONS.flatMap(item => [
        [`${item.id}Email`, item.emailDefault],
        [`${item.id}Push`, item.pushDefault],
      ]),
    ) as Record<string, boolean>,
  );

  const [passwordStep, setPasswordStep] = useState<PasswordStep>('idle');
  const [tmpPassword, setTmpPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'saving'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem('user_email') ?? '';
    const name = stored ? stored.split('@')[0] : 'Player';
    setEmail(stored);
    setDisplayName(name);
    setNickname(name);
    setInitial(name.charAt(0).toUpperCase() || 'U');
  }, []);

  const scrollToSection = useCallback((id: SectionId) => {
    setActiveSection(id);
    lastSyncedSectionId.current = id;
    isProgrammaticScroll.current = true;

    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    scrollSubnavItemIntoView(subnavButtonRefs.current.get(id));

    window.setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 700);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');

    const resolveActiveSection = () => {
      const headerHeight = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
      );
      const marker = (Number.isFinite(headerHeight) ? headerHeight : 72) + 40;
      let nextActiveSection = SECTIONS[0].id;

      for (const section of SECTIONS) {
        const element = sectionRefs.current[section.id];
        if (!element) continue;

        if (element.getBoundingClientRect().top <= marker) {
          nextActiveSection = section.id;
        }
      }

      setActiveSection(nextActiveSection);

      if (lastSyncedSectionId.current !== nextActiveSection) {
        lastSyncedSectionId.current = nextActiveSection;
        scrollSubnavItemIntoView(subnavButtonRefs.current.get(nextActiveSection));
      }
    };

    const onScroll = () => {
      if (!mediaQuery.matches || isProgrammaticScroll.current) return;
      resolveActiveSection();
    };

    const onMediaChange = () => {
      if (mediaQuery.matches) {
        resolveActiveSection();
      } else {
        setActiveSection('profile');
        lastSyncedSectionId.current = 'profile';
      }
    };

    onMediaChange();
    window.addEventListener('scroll', onScroll, { passive: true });
    mediaQuery.addEventListener('change', onMediaChange);

    return () => {
      window.removeEventListener('scroll', onScroll);
      mediaQuery.removeEventListener('change', onMediaChange);
    };
  }, []);

  async function handleSendTempPassword() {
    setError(null);
    setNotice(null);

    if (!email.trim()) {
      setError('No account email found. Sign in again.');
      return;
    }

    setStatus('sending');
    try {
      await restorePassword({ email: email.trim() });
      setNotice('Temporary password sent to your email. Enter it below with your new password.');
    } catch (err) {
      setError(errorText(err, 'Could not send the temporary password.'));
    } finally {
      setStatus('idle');
    }
  }

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
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

    setStatus('saving');
    try {
      await changePassword({
        email: email.trim(),
        tmp_password: tmpPassword,
        new_password: newPassword,
      });
      setPasswordStep('done');
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

  function openPasswordChange() {
    setError(null);
    setNotice(null);
    setPasswordStep('form');
    scrollToSection('security');
  }

  function closePasswordChange() {
    setError(null);
    setNotice(null);
    setPasswordStep('idle');
    setTmpPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  return (
    <div className={styles.shell}>
      <div className={styles.root}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Settings</span>
          <h1 className={styles.title}>Account settings</h1>
          <p className={styles.subtitleMobile}>
            Manage profile, security, and notifications. Changes save automatically.
          </p>
          <p className={styles.subtitleDesktop}>
            Manage your profile, password, notifications, and connected accounts. Changes save
            automatically.
          </p>
        </header>

        <label className={styles.sectionSelect} htmlFor={sectionSelectId}>
          <span className={styles.sectionSelectLabel}>Section:</span>
          <select
            id={sectionSelectId}
            className={styles.sectionSelectControl}
            value={activeSection}
            onChange={event => scrollToSection(event.target.value as SectionId)}
          >
            {SECTIONS.map(section => (
              <option key={section.id} value={section.id}>
                {section.label}
              </option>
            ))}
          </select>
          <span className={styles.sectionSelectChevron} aria-hidden="true">
            ▾
          </span>
        </label>

        <div className={styles.body}>
          <nav className={styles.subnav} aria-label="Settings sections">
            <span className={styles.subnavLabel}>Sections</span>
            <div className={styles.subnavList}>
              {SECTIONS.map(section => (
                <button
                  key={section.id}
                  ref={node => {
                    if (node) {
                      subnavButtonRefs.current.set(section.id, node);
                    } else {
                      subnavButtonRefs.current.delete(section.id);
                    }
                  }}
                  type="button"
                  className={[
                    styles.subnavItem,
                    section.danger && styles.subnavItemDanger,
                    activeSection === section.id && styles.subnavItemActive,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => scrollToSection(section.id)}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </nav>

          <div className={styles.main}>
            <section
              ref={node => {
                sectionRefs.current.profile = node;
              }}
              id="settings-profile"
              className={styles.card}
            >
              <div className={styles.cardHead}>
                <h2 className={styles.cardTitle}>Profile</h2>
                <span className={styles.savedBadge}>
                  <span className={styles.savedDot} aria-hidden="true" />
                  <span className={styles.savedBadgeMobile}>Auto-saved</span>
                  <span className={styles.savedBadgeDesktop}>Auto-saved 2 min ago</span>
                </span>
              </div>

              <div className={styles.avatarRow}>
                <span className={styles.avatarLarge} aria-hidden="true">
                  {initial}
                </span>
                <div className={styles.avatarMeta}>
                  <span className={styles.avatarTitle}>Profile picture</span>
                  <span className={styles.avatarHintMobile}>PNG/JPG, up to 2 MB.</span>
                  <span className={styles.avatarHintDesktop}>
                    PNG or JPG, square format, up to 2 MB. Your in-game skin can also sync
                    automatically.
                  </span>
                  <div className={styles.avatarActions}>
                    <button type="button" className={styles.primaryPill}>
                      <span className={styles.pillMobile}>Upload</span>
                      <span className={styles.pillDesktop}>Upload photo</span>
                    </button>
                    <button type="button" className={styles.outlinePill}>
                      <span className={styles.pillMobile}>Sync</span>
                      <span className={styles.pillDesktop}>Sync from Minecraft</span>
                    </button>
                    <button type="button" className={styles.ghostPill}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.profileGrid}>
                <div className={styles.formCol}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="settings-display-name">
                      Display name
                    </label>
                    <input
                      id="settings-display-name"
                      className={styles.input}
                      value={displayName}
                      onChange={event => setDisplayName(event.target.value)}
                    />
                    <p className={styles.help}>
                      <span className={styles.helpMobile}>Visible on the leaderboard.</span>
                      <span className={styles.helpDesktop}>
                        Visible to other players on the leaderboard.
                      </span>
                    </p>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="settings-nickname">
                      In-game nickname
                    </label>
                    <input
                      id="settings-nickname"
                      className={styles.input}
                      value={nickname}
                      onChange={event => setNickname(event.target.value)}
                    />
                    <p className={styles.help}>
                      <span className={styles.helpMobile}>Must match Minecraft account.</span>
                      <span className={styles.helpDesktop}>Must match your Minecraft account.</span>
                    </p>
                  </div>
                </div>

                <div className={styles.formCol}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="settings-email-readonly">
                      Email address
                    </label>
                    <div className={styles.inputWithTag}>
                      <input
                        id="settings-email-readonly"
                        className={styles.inputInline}
                        value={email}
                        readOnly
                      />
                      <span className={styles.verifiedTag}>Verified</span>
                    </div>
                    <p className={styles.helpDesktopOnly}>You can update your email below.</p>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="settings-country">
                      Country / region
                    </label>
                    <div className={styles.selectWrap}>
                      <select
                        id="settings-country"
                        className={styles.select}
                        value={country}
                        onChange={event =>
                          setCountry(event.target.value as (typeof COUNTRIES)[number])
                        }
                      >
                        {COUNTRIES.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <span className={styles.selectChevron} aria-hidden="true">
                        ▾
                      </span>
                    </div>
                    <p className={styles.helpDesktopOnly}>Used only for tax-compliant billing.</p>
                  </div>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="settings-bio">
                  Bio
                </label>
                <div className={styles.textareaWrap}>
                  <textarea
                    id="settings-bio"
                    className={styles.textarea}
                    value={bio}
                    maxLength={240}
                    onChange={event => setBio(event.target.value)}
                  />
                  <div className={styles.textareaFoot}>
                    <span className={styles.markdownMobile}>Markdown</span>
                    <span className={styles.markdownDesktop}>Markdown supported</span>
                    <span>
                      {bio.length} / 240
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section
              ref={node => {
                sectionRefs.current.security = node;
              }}
              id="settings-security"
              className={styles.card}
            >
              <h2 className={styles.cardTitleStandalone}>Security</h2>

              <div className={styles.row}>
                <div className={styles.rowText}>
                  <span className={styles.rowTitle}>Password</span>
                  <span className={styles.rowHintMobile}>Last changed 3 weeks ago.</span>
                  <span className={styles.rowHintDesktop}>
                    Last changed 3 weeks ago. We recommend changing every 90 days.
                  </span>
                </div>
                <button type="button" className={styles.outlinePill} onClick={openPasswordChange}>
                  <span className={styles.pillMobile}>Change</span>
                  <span className={styles.pillDesktop}>Change password</span>
                </button>
              </div>

              {passwordStep !== 'idle' && (
                <div className={styles.passwordPanel}>
                  {error && <p className={styles.formError}>{error}</p>}
                  {notice && <p className={styles.notice}>{notice}</p>}

                  {passwordStep === 'done' ? (
                    <div className={styles.passwordDone}>
                      <p className={styles.successText}>
                        Your password has been changed successfully.
                      </p>
                      <button type="button" className={styles.outlinePill} onClick={closePasswordChange}>
                        Close
                      </button>
                    </div>
                  ) : (
                    <form className={styles.passwordForm} onSubmit={handleResetPassword} noValidate>
                      <p className={styles.passwordIntro}>
                        We email a temporary password to{' '}
                        <strong>{email || 'your account email'}</strong>, then you set a new one
                        below.
                      </p>
                      <button
                        type="button"
                        className={styles.outlinePillWide}
                        disabled={status !== 'idle'}
                        onClick={handleSendTempPassword}
                      >
                        {status === 'sending' ? 'Sending…' : 'Send temporary password'}
                      </button>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="settings-tmp">
                          Temporary password
                        </label>
                        <input
                          id="settings-tmp"
                          className={styles.input}
                          value={tmpPassword}
                          onChange={event => setTmpPassword(event.target.value)}
                          autoComplete="one-time-code"
                          required
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="settings-new">
                          New password
                        </label>
                        <input
                          id="settings-new"
                          type="password"
                          className={styles.input}
                          value={newPassword}
                          onChange={event => setNewPassword(event.target.value)}
                          autoComplete="new-password"
                          minLength={4}
                          maxLength={24}
                          required
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="settings-confirm">
                          Confirm new password
                        </label>
                        <input
                          id="settings-confirm"
                          type="password"
                          className={styles.input}
                          value={confirmPassword}
                          onChange={event => setConfirmPassword(event.target.value)}
                          autoComplete="new-password"
                          minLength={4}
                          maxLength={24}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className={styles.primaryPillWide}
                        disabled={status !== 'idle'}
                      >
                        {status === 'saving' ? 'Saving…' : 'Save new password'}
                      </button>
                      <button type="button" className={styles.textBtn} onClick={closePasswordChange}>
                        Cancel
                      </button>
                    </form>
                  )}
                </div>
              )}

              <hr className={styles.divider} />

              <div className={styles.row}>
                <div className={styles.rowText}>
                  <div className={styles.rowTitleWrap}>
                    <span className={styles.rowTitleMobile}>Two-factor auth</span>
                    <span className={styles.rowTitleDesktop}>Two-factor authentication</span>
                    {twoFactor && (
                      <span className={styles.onBadge}>On</span>
                    )}
                  </div>
                  <span className={styles.rowHintMobile}>Authenticator + recovery codes.</span>
                  <span className={styles.rowHintDesktop}>
                    Authenticator app + recovery codes. Adds an extra layer to login.
                  </span>
                </div>
                <Toggle
                  checked={twoFactor}
                  onChange={setTwoFactor}
                  label="Two-factor authentication"
                />
              </div>

              <hr className={styles.divider} />

              <div className={styles.row}>
                <div className={styles.rowText}>
                  <span className={styles.rowTitle}>Active sessions</span>
                  <span className={styles.rowHintMobile}>3 devices currently signed in.</span>
                  <span className={styles.rowHintDesktop}>
                    3 devices currently signed in. Sign out of all to reset.
                  </span>
                </div>
                <button type="button" className={styles.outlinePill}>
                  <span className={styles.pillMobile}>Manage</span>
                  <span className={styles.pillDesktop}>Manage sessions</span>
                </button>
              </div>
            </section>

            <section
              ref={node => {
                sectionRefs.current.notifications = node;
              }}
              id="settings-notifications"
              className={styles.card}
            >
              <h2 className={styles.cardTitleStandalone}>Notifications</h2>

              {NOTIFICATIONS.map((item, index) => (
                <div key={item.id}>
                  {index > 0 && <hr className={styles.divider} />}
                  <div className={styles.notifyItem}>
                    <div className={styles.notifyCopy}>
                      <span className={styles.rowTitle}>{item.title}</span>
                      <span className={styles.rowHintMobile}>{item.hintMobile}</span>
                      <span className={styles.rowHintDesktop}>{item.hintDesktop}</span>
                    </div>
                    <div className={styles.notifyToggles}>
                      <div className={styles.notifyToggle}>
                        <span className={styles.notifyChannel}>Email</span>
                        <Toggle
                          checked={notifications[`${item.id}Email`]}
                          onChange={value =>
                            setNotifications(prev => ({ ...prev, [`${item.id}Email`]: value }))
                          }
                          label={`${item.title} email notifications`}
                        />
                      </div>
                      <div className={styles.notifyToggle}>
                        <span className={styles.notifyChannel}>Push</span>
                        <Toggle
                          checked={notifications[`${item.id}Push`]}
                          onChange={value =>
                            setNotifications(prev => ({ ...prev, [`${item.id}Push`]: value }))
                          }
                          label={`${item.title} push notifications`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <section
              ref={node => {
                sectionRefs.current.linked = node;
              }}
              id="settings-linked"
              className={styles.card}
            >
              <h2 className={styles.cardTitleStandalone}>Linked accounts</h2>

              <div className={styles.linkedList}>
                {LINKED_ACCOUNTS.map(account => (
                  <div key={account.id} className={styles.linkedRow}>
                    <div className={styles.linkedMeta}>
                      <span className={styles.linkedIcon} aria-hidden="true">
                        {account.icon}
                      </span>
                      <div className={styles.linkedText}>
                        <span className={styles.linkedName}>{account.name}</span>
                        <span className={styles.linkedDetailMobile}>{account.detailMobile}</span>
                        <span className={styles.linkedDetailDesktop}>{account.detailDesktop}</span>
                      </div>
                    </div>
                    <div className={styles.linkedActions}>
                      <span
                        className={[
                          styles.statusBadge,
                          account.status === 'linked'
                            ? styles.statusLinked
                            : styles.statusNotLinked,
                        ].join(' ')}
                      >
                        <span className={styles.statusDot} aria-hidden="true" />
                        {account.status === 'linked' ? 'Linked' : 'Not linked'}
                      </span>
                      <button
                        type="button"
                        className={
                          account.action === 'link' ? styles.primaryPill : styles.outlinePill
                        }
                      >
                        {account.action === 'link' ? 'Link' : 'Unlink'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section
              ref={node => {
                sectionRefs.current.danger = node;
              }}
              id="settings-danger"
              className={styles.dangerCard}
            >
              <h2 className={styles.dangerTitle}>
                <span aria-hidden="true">⚠</span>
                Danger zone
              </h2>

              <div className={styles.dangerRow}>
                <div className={styles.rowText}>
                  <span className={styles.rowTitleMobile}>Deactivate</span>
                  <span className={styles.rowTitleDesktop}>Deactivate account</span>
                  <span className={styles.dangerHintMobile}>Pause profile and notifications.</span>
                  <span className={styles.dangerHintDesktop}>
                    Pause profile and notifications.
                  </span>
                </div>
                <button type="button" className={styles.dangerBtn}>
                  <span className={styles.pillMobile}>Pause</span>
                  <span className={styles.pillDesktop}>Deactivate</span>
                </button>
              </div>

              <hr className={styles.dangerDivider} />

              <div className={styles.dangerRow}>
                <div className={styles.rowText}>
                  <span className={styles.rowTitleMobile}>Delete permanently</span>
                  <span className={styles.rowTitleDesktop}>Delete account permanently</span>
                  <span className={styles.dangerHintMobile}>Removes all data forever.</span>
                  <span className={styles.dangerHintDesktop}>Removes all data forever.</span>
                </div>
                <button type="button" className={styles.dangerBtn}>
                  <span className={styles.pillMobile}>Delete</span>
                  <span className={styles.pillDesktop}>Delete forever</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
