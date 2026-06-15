'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logout } from '@/lib/api/auth';
import { LogoutModal } from '../../LogoutModal/LogoutModal';
import { dashboardIconStyle as iconStyle, WORKSPACE_LINKS } from '../../dashboardNav';
import { isNavLinkActive, NAV_LINKS } from '../../Header/navLinks';
import styles from './DashboardNav.module.css';

type DashboardNavProps = {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
};

export function DashboardNav({ isOpen, onClose, pathname }: DashboardNavProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [initial, setInitial] = useState('U');
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    const storedEmail = window.localStorage.getItem('user_email') ?? '';
    setEmail(storedEmail);
    setName(storedEmail ? storedEmail.split('@')[0] : 'Player');
    setInitial(storedEmail ? storedEmail.charAt(0).toUpperCase() : 'U');
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
    } catch {
      // навіть якщо запит впав — чистимо клієнтський стан і виходимо
    } finally {
      window.localStorage.removeItem('user_email');
      setLogoutOpen(false);
      onClose();
      router.push('/');
      router.refresh();
    }
  }

  function openLogoutModal() {
    onClose();
    setLogoutOpen(true);
  }

  return (
    <>
      {isOpen && (
      <div className={styles.root}>
      <button type="button" className={styles.overlay} aria-label="Close menu" onClick={onClose} />

      <aside
        id="mobile-nav-drawer"
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Dashboard navigation"
      >
        <div className={styles.top}>
          <Link href="/dashboard" className={styles.logo} onClick={onClose}>
            <Image src="/icons/icons/logo.webp" alt="Minecraft game logo" width={144} height={40} priority />
          </Link>
          <button type="button" className={styles.close} aria-label="Close menu" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.userCard}>
          <span className={styles.avatar} aria-hidden="true">
            {initial}
          </span>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{name}</span>
          </div>
        </div>

        <Link href="/dashboard/shop" className={styles.topup} onClick={onClose}>
          Top up crystals
        </Link>

        <div className={styles.sectionLabel}>
          <span>Browse the site</span>
          <span className={styles.sectionLine} aria-hidden="true" />
        </div>

        <nav className={styles.browse} aria-label="Browse the site">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} className={styles.browseLink} onClick={onClose}>
              <span>{link.drawerLabel}</span>
              <span className={styles.browseChevron} aria-hidden="true">
                ›
              </span>
            </Link>
          ))}
        </nav>

        <div className={styles.sectionLabel}>
          <span>My workspace</span>
          <span className={styles.sectionLine} aria-hidden="true" />
        </div>

        <nav className={styles.workspace} aria-label="My workspace">
          {WORKSPACE_LINKS.map(link => {
            const isActive = link.href !== '#' && isNavLinkActive(link.href, pathname);
            const isDisabled = link.soon && link.href === '#';
            const className = [
              styles.wsItem,
              isActive && styles.wsItemActive,
              isDisabled && styles.wsItemDisabled,
            ]
              .filter(Boolean)
              .join(' ');

            const content = (
              <>
                <span className={styles.wsIcon} style={iconStyle(link.icon)} aria-hidden="true" />
                <span className={styles.wsLabel}>{link.label}</span>
                {typeof link.badge === 'number' && link.badge > 0 && (
                  <span className={styles.badge}>{link.badge}</span>
                )}
                {link.soon && <span className={styles.soon}>Soon</span>}
              </>
            );

            if (isDisabled) {
              return (
                <span key={link.label} className={className} aria-disabled="true">
                  {content}
                </span>
              );
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                className={className}
                aria-current={isActive ? 'page' : undefined}
                onClick={onClose}
              >
                {content}
              </Link>
            );
          })}
        </nav>

        <div className={styles.spacer} aria-hidden="true" />

        <hr className={styles.divider} />

        <div className={styles.account}>
          <Link href="/dashboard" className={styles.footItem} onClick={onClose}>
            <span className={styles.wsIcon} style={iconStyle('settings-outline')} aria-hidden="true" />
            <span className={styles.footLabel}>Settings</span>
          </Link>
          <button
            type="button"
            className={styles.footItem}
            onClick={openLogoutModal}
            disabled={loggingOut}
          >
            <span className={styles.wsIcon} style={iconStyle('logout-outline')} aria-hidden="true" />
            <span className={styles.footLabel}>{loggingOut ? 'Logging out…' : 'Log out'}</span>
          </button>
        </div>

        <div className={styles.bottom}>
          <button type="button" className={styles.langButton}>
            <span>EN</span>
            <span className={styles.langArrow} aria-hidden="true">
              ▾
            </span>
          </button>
          <span className={styles.version}>v 2.6.0</span>
        </div>
      </aside>
      </div>
      )}

      <LogoutModal
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
        name={name}
        email={email}
        initial={initial}
        confirming={loggingOut}
      />
    </>
  );
}
